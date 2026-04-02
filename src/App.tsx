import './App.css'
import { useState, useEffect, useRef } from 'react'
import { useAgentData } from './hooks/useAgentData'
import { useAgentBuilder } from './hooks/useAgentBuilder'
import { useSavedAgents } from './hooks/useSavedAgents'
import { useChatPlayground } from './hooks/useChatPlayground'
import { useGoogleAuth } from './hooks/useGoogleAuth'
import { useGoogleDrive } from './hooks/useGoogleDrive'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { ToastProvider } from './components/shared/Toast'
import { useToast } from './components/shared/ToastContext'
import { LoadingSkeleton } from './components/shared/LoadingSkeleton'
import { AppHeader } from './components/layout/AppHeader'
import { AgentBuilderTab } from './components/builder/AgentBuilderTab'
import { SavedAgentsList } from './components/saved/SavedAgentsList'
import { ChatPlayground } from './components/chat/ChatPlayground'
import { LiveChatPlayground } from './components/chat/LiveChatPlayground'
import { ApiKeyModal } from './components/chat/ApiKeyModal'
import { GoogleSetupModal, STORED_CLIENT_ID_KEY } from './components/auth/GoogleSetupModal'
import { DriveConsentModal } from './components/auth/DriveConsentModal'
import { FREE_PROVIDER } from './lib/constants'
import type { SavedAgent, Provider } from './types'

// ################ Resolve effective Google Client ID ##################
const USE_ENV_CREDENTIALS = import.meta.env.VITE_USE_ENV_CREDENTIALS === 'true'
const ENV_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || ''

function resolveInitialClientId(): string {
  if (USE_ENV_CREDENTIALS) return ENV_CLIENT_ID
  return localStorage.getItem(STORED_CLIENT_ID_KEY) ?? ''
}

type Tab = 'builder' | 'saved'

// ################ Main App Component ##################

function AppContent() {
  const { data, loading, error, refetch } = useAgentData()
  const builder = useAgentBuilder()
  const { savedAgents, saveAgent, updateAgent, deleteAgent, clearAll, replaceAll } = useSavedAgents()
  const chat = useChatPlayground()
  const { addToast } = useToast()

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>('builder')

  // Live chat state
  const [liveChat, setLiveChat] = useState<{ agent: SavedAgent; apiKey?: string } | null>(null)
  const [pendingChatAgent, setPendingChatAgent] = useState<SavedAgent | null>(null)

  // Highlight recently saved card
  const [recentlySavedId, setRecentlySavedId] = useState<string | null>(null)
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ---- Google Auth ----
  const [googleClientId, setGoogleClientId] = useState(resolveInitialClientId)
  const [showSetupModal, setShowSetupModal] = useState(
    !USE_ENV_CREDENTIALS && !resolveInitialClientId()
  )
  const [showConsentModal, setShowConsentModal] = useState(false)

  const { user: googleUser, accessToken, signIn, signOut, isLoading: gLoading, isReady: gReady } =
    useGoogleAuth(googleClientId)

  const { syncToDrive, loadFromDrive, isSyncing, lastSynced } = useGoogleDrive(accessToken)

  // ---- Auto-load from Drive on sign-in ----
  const prevGoogleUserRef = useRef<typeof googleUser>(null)
  useEffect(() => {
    if (googleUser && !prevGoogleUserRef.current) {
      loadFromDrive().then(agents => {
        if (agents !== null && agents.length > 0) {
          replaceAll(agents)
          addToast(`Loaded ${agents.length} agents from Drive.`, 'success')
        }
      })
    }
    prevGoogleUserRef.current = googleUser
  }, [googleUser]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Auto-sync to Drive on any savedAgents change ----
  const isFirstMountRef = useRef(true)
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false
      return
    }
    if (googleUser && accessToken) {
      void syncToDrive(savedAgents)
    }
  }, [savedAgents]) // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Google sign-in (consent modal first) ----
  const handleGoogleSignIn = () => {
    if (!googleClientId && !USE_ENV_CREDENTIALS) {
      setShowSetupModal(true)
      return
    }
    setShowConsentModal(true)
  }

  const handleConsentUnderstood = () => {
    setShowConsentModal(false)
    signIn()
  }

  const handleSetupConnect = (clientId: string) => {
    setGoogleClientId(clientId)
    setShowSetupModal(false)
    setTimeout(() => signIn(), 100)
  }

  // ---- Drive manual buttons ----
  const handleSyncToDrive = async () => {
    const ok = await syncToDrive(savedAgents)
    if (ok) {
      addToast(`${savedAgents.length} agents synced to Drive.`, 'success')
    } else {
      addToast('Failed to sync to Drive. Try signing in again.', 'error')
    }
  }

  const handleLoadFromDrive = async () => {
    const agents = await loadFromDrive()
    if (agents === null) {
      addToast('No saved agents found in Drive.', 'info')
    } else {
      replaceAll(agents)
      addToast(`Loaded ${agents.length} agents from Drive.`, 'success')
    }
  }

  // ---- Agent builder helpers ----
  const currentConfig = {
    name: builder.agentName,
    profileId: builder.selectedProfile,
    skillIds: builder.selectedSkills,
    layerIds: builder.selectedLayers,
    provider: builder.selectedProvider,
  }

  /** Switch to Saved Agents tab and animate the new card. */
  const switchToSavedAndHighlight = (id: string) => {
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current)
    setRecentlySavedId(id)
    highlightTimerRef.current = setTimeout(() => setRecentlySavedId(null), 2700)
    setActiveTab('saved')
    // Scroll to top so the user lands at the card grid
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60)
  }

  // ---- Agent CRUD handlers ----
  const handleSave = (): boolean => {
    if (!builder.agentName.trim()) return false
    const duplicate = savedAgents.some(
      a => a.name.toLowerCase() === builder.agentName.trim().toLowerCase()
    )
    if (duplicate) {
      addToast(`An agent named "${builder.agentName}" already exists.`, 'error')
      return false
    }
    const resolvedProvider = currentConfig.provider || FREE_PROVIDER
    const newAgent = saveAgent({ ...currentConfig, provider: resolvedProvider })
    builder.reset()
    if (!currentConfig.provider) {
      addToast(`Agent "${newAgent.name}" saved! Provider defaulted to OpenRouter (Free).`, 'success')
    } else {
      addToast(`Agent "${newAgent.name}" saved!`, 'success')
    }
    switchToSavedAndHighlight(newAgent.id)
    return true
  }

  const handleUpdate = (): void => {
    if (!builder.loadedAgentId || !builder.agentName.trim()) return
    updateAgent(builder.loadedAgentId, currentConfig)
    addToast(`Agent "${builder.agentName}" updated.`, 'success')
  }

  const handleCreateNew = (): boolean => {
    if (!builder.agentName.trim()) return false
    const loadedAgent = savedAgents.find(a => a.id === builder.loadedAgentId)
    if (loadedAgent?.name.toLowerCase() === builder.agentName.trim().toLowerCase()) {
      addToast('Please use a different name to create a new agent.', 'error')
      return false
    }
    const duplicate = savedAgents.some(
      a => a.name.toLowerCase() === builder.agentName.trim().toLowerCase()
    )
    if (duplicate) {
      addToast(`An agent named "${builder.agentName}" already exists.`, 'error')
      return false
    }
    const newAgent = saveAgent(currentConfig)
    addToast(`New agent "${newAgent.name}" created.`, 'success')
    switchToSavedAndHighlight(newAgent.id)
    return true
  }

  const handleLoadAgent = (agent: SavedAgent) => {
    builder.loadAgent(agent)
    setActiveTab('builder') // switch to builder to edit the loaded config
    addToast(`Loaded agent "${agent.name}"`, 'info')
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60)
  }

  // ---- Chat handlers ----
  const handleOpenChat = (agent: SavedAgent) => {
    if (!data) return
    if (agent.provider === FREE_PROVIDER) {
      setLiveChat({ agent })
    } else if (agent.provider && agent.provider !== '') {
      setPendingChatAgent(agent)
    } else {
      void chat.openChat(agent, data)
    }
  }

  const handleApiKeySubmit = (apiKey: string) => {
    if (!pendingChatAgent) return
    setLiveChat({ agent: pendingChatAgent, apiKey })
    setPendingChatAgent(null)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-5xl mb-4">😵</div>
        <h2 className="text-xl font-semibold text-white/90 mb-2">Failed to load data</h2>
        <p className="text-white/50 mb-4">{error}</p>
        <button onClick={refetch} className="px-6 py-2 btn-neon-violet rounded-lg font-medium">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <AppHeader
        sessionTime={builder.sessionTime}
        googleUser={googleUser}
        isGoogleLoading={gLoading}
        isGoogleReady={gReady}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignOut={signOut}
      />

      {/* ---- Tab switcher ---- */}
      <div className="flex gap-1 p-1 glass rounded-2xl border border-white/[0.07] mb-8 w-full sm:w-auto sm:inline-flex">
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none ${
            activeTab === 'builder'
              ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
              : 'text-white/40 hover:text-white/70 border border-transparent'
          }`}
        >
          <span>⚡</span>
          <span>Agent Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none ${
            activeTab === 'saved'
              ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
              : 'text-white/40 hover:text-white/70 border border-transparent'
          }`}
        >
          <span>🤖</span>
          <span>Saved Agents</span>
          {savedAgents.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
              activeTab === 'saved'
                ? 'bg-violet-500/40 text-violet-200'
                : 'bg-white/[0.08] text-white/40'
            }`}>
              {savedAgents.length}
            </span>
          )}
        </button>
      </div>

      {loading || !data ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* ---- Tab 1: Agent Builder ---- */}
          {activeTab === 'builder' && (
            <AgentBuilderTab
              data={data}
              builder={builder}
              onSave={handleSave}
              onUpdate={handleUpdate}
              onCreateNew={handleCreateNew}
            />
          )}

          {/* ---- Tab 2: Saved Agents ---- */}
          {activeTab === 'saved' && (
            <SavedAgentsList
              agents={savedAgents}
              data={data}
              onLoad={handleLoadAgent}
              onDelete={deleteAgent}
              onClearAll={clearAll}
              onChat={handleOpenChat}
              driveSync={{
                isSignedIn: !!googleUser,
                isSyncing,
                lastSynced,
                onSyncToDrive: handleSyncToDrive,
                onLoadFromDrive: handleLoadFromDrive,
              }}
              recentlySavedId={recentlySavedId}
            />
          )}
        </>
      )}

      {/* Simulated Chat */}
      {chat.isOpen && chat.activeAgent && chat.agentData && (
        <ChatPlayground
          agent={chat.activeAgent}
          data={chat.agentData}
          messages={chat.messages}
          isTyping={chat.isTyping}
          onSendMessage={chat.sendMessage}
          onClose={chat.closeChat}
        />
      )}

      {/* Live Chat */}
      {liveChat && data && (
        <LiveChatPlayground
          agent={liveChat.agent}
          data={data}
          apiKey={liveChat.apiKey}
          onClose={() => setLiveChat(null)}
        />
      )}

      {/* API Key Modal */}
      {pendingChatAgent && (
        <ApiKeyModal
          provider={pendingChatAgent.provider as Provider}
          isOpen={!!pendingChatAgent}
          onSubmit={handleApiKeySubmit}
          onCancel={() => setPendingChatAgent(null)}
        />
      )}

      {/* Drive Consent Modal */}
      <DriveConsentModal
        isOpen={showConsentModal}
        onUnderstood={handleConsentUnderstood}
        onCancel={() => setShowConsentModal(false)}
      />

      {/* Google Drive Setup Modal (VITE_USE_ENV_CREDENTIALS=false path) */}
      <GoogleSetupModal
        isOpen={showSetupModal}
        onConnect={handleSetupConnect}
        onSkip={() => setShowSetupModal(false)}
      />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="cosmic-bg" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="blob blob-4" />
        </div>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App

// #################################################
