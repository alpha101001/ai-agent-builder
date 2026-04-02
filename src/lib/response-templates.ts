// ################ Response Templates for Chat Simulation ##################
// Profile-keyed response templates that the simulation engine selects from
// based on the active agent's profile. Each profile has greeting messages,
// domain-specific responses, and fallback generic replies. The user's
// message is keyword-matched to find the best template fit.

interface ResponseTemplate {
  keywords: string[]
  responses: string[]
}

interface ProfileTemplates {
  greeting: string[]
  templates: ResponseTemplate[]
  fallback: string[]
}

export const PROFILE_RESPONSES: Record<string, ProfileTemplates> = {
  profile_1: {
    greeting: [
      "Hi there! I'm your Customer Support agent. How can I help you today?",
      "Welcome! I'm ready to assist you with any questions or issues.",
      "Hello! I'm here to make sure your experience is smooth. What do you need?",
    ],
    templates: [
      {
        keywords: ['refund', 'return', 'money back'],
        responses: [
          "I'd be happy to help with your refund request. To process this, I'll need your order number. Our refund policy allows returns within 30 days of purchase. Once approved, refunds typically appear in 5-7 business days.",
          "Let me look into that for you. Refunds are processed within our standard 30-day window. Could you share your order ID so I can check the status?",
        ],
      },
      {
        keywords: ['shipping', 'delivery', 'track', 'order'],
        responses: [
          "I can help you track your order! Standard shipping takes 3-5 business days. If you provide your order number, I can pull up the real-time tracking info.",
          "Let me check on your delivery status. Our standard shipping window is 3-5 business days. Express orders arrive within 1-2 days.",
        ],
      },
      {
        keywords: ['bug', 'error', 'broken', 'not working', 'issue', 'problem'],
        responses: [
          "I'm sorry to hear you're experiencing an issue. Let me help troubleshoot. Could you describe what's happening and any error messages you see?",
          "That sounds frustrating! Let's get this resolved. Can you walk me through the steps that led to the issue?",
        ],
      },
      {
        keywords: ['price', 'cost', 'discount', 'promo', 'coupon'],
        responses: [
          "Great question about pricing! We currently have a 15% discount available for new customers. Let me check if there are any additional promotions active right now.",
          "I'd love to help you find the best deal. Let me look up our current promotions and available discount codes for you.",
        ],
      },
    ],
    fallback: [
      "Thank you for reaching out! I'd like to help with that. Could you provide a few more details so I can assist you better?",
      "I appreciate your patience. Let me look into this for you. Is there anything specific you'd like me to focus on?",
      "That's a great question! Let me check our resources and get back to you with the most accurate answer.",
    ],
  },

  profile_2: {
    greeting: [
      "Hey! I'm your Code Assistant. Ready to write, review, or debug some code?",
      "Welcome, developer! What are we building today?",
      "Hello! I'm here to help with coding tasks. What language are we working in?",
    ],
    templates: [
      {
        keywords: ['react', 'component', 'hook', 'jsx', 'tsx'],
        responses: [
          "For React, I'd suggest using a functional component with hooks. Here's the pattern:\n\n```tsx\nfunction MyComponent({ data }: Props) {\n  const [state, setState] = useState(initial)\n  \n  useEffect(() => {\n    // side effect\n  }, [dependency])\n  \n  return <div>{state}</div>\n}\n```\n\nWant me to customize this for your specific use case?",
          "Great choice working with React! Let me help you structure that. Are you using TypeScript? I'd recommend strict types for all props and state.",
        ],
      },
      {
        keywords: ['bug', 'error', 'debug', 'fix', 'crash', 'undefined'],
        responses: [
          "Let's debug this systematically. The most common causes are:\n1. Undefined/null references — check your data exists before accessing nested properties\n2. Stale closures — make sure dependencies are in your useEffect arrays\n3. State mutations — always create new objects/arrays instead of mutating\n\nCan you share the error message?",
          "I'll help you track down that bug. First, let's check the browser console for error details. What does the stack trace show?",
        ],
      },
      {
        keywords: ['api', 'fetch', 'request', 'endpoint', 'rest'],
        responses: [
          "Here's a robust pattern for API calls with error handling:\n\n```typescript\nasync function fetchData<T>(url: string): Promise<T> {\n  const response = await fetch(url)\n  if (!response.ok) {\n    throw new Error(`HTTP ${response.status}`)\n  }\n  return response.json()\n}\n```\n\nShall I add retry logic or caching?",
        ],
      },
      {
        keywords: ['python', 'django', 'flask', 'pip'],
        responses: [
          "For Python, let me help you with that. Are you using a virtual environment? Best practice is:\n\n```bash\npython -m venv .venv\nsource .venv/bin/activate\npip install -r requirements.txt\n```\n\nWhat specific Python task are you working on?",
        ],
      },
    ],
    fallback: [
      "I can help with that coding task. Could you share a code snippet or describe the expected behavior vs. what's happening?",
      "Let me think about the best approach for this. What language/framework are you using? I'll tailor my solution accordingly.",
      "Interesting problem! Let me break it down into steps and we can tackle it together.",
    ],
  },

  profile_3: {
    greeting: [
      "Hi! I'm your Data Analyst agent. Ready to crunch some numbers?",
      "Welcome! Let's turn your raw data into actionable insights.",
      "Hello! I'm here to help with data analysis, visualization, and reporting.",
    ],
    templates: [
      {
        keywords: ['chart', 'graph', 'visualize', 'plot', 'dashboard'],
        responses: [
          "For that dataset, I'd recommend:\n- **Bar chart** for categorical comparisons\n- **Line chart** for time-series trends\n- **Scatter plot** for correlation analysis\n\nThe key metrics to highlight would be the mean, median, and any outliers beyond 2 standard deviations.",
          "Great question about visualization! The best chart type depends on your data. Let me analyze the distribution first and suggest the optimal visualization approach.",
        ],
      },
      {
        keywords: ['sql', 'query', 'database', 'table', 'select'],
        responses: [
          "Here's an optimized query approach:\n\n```sql\nSELECT category, \n       COUNT(*) as total,\n       AVG(value) as avg_value\nFROM analytics_data\nWHERE created_at >= NOW() - INTERVAL '30 days'\nGROUP BY category\nORDER BY total DESC;\n```\n\nWant me to add filters or joins?",
        ],
      },
      {
        keywords: ['trend', 'pattern', 'growth', 'decline', 'forecast'],
        responses: [
          "Based on the data patterns, I can see a clear upward trend with seasonal fluctuations. Key observations:\n\n📈 **Growth rate**: ~12% month-over-month\n📊 **Peak periods**: Q4 consistently outperforms\n⚠️ **Anomaly detected**: Unexpected dip in March — worth investigating\n\nWould you like me to run a more detailed forecast?",
        ],
      },
    ],
    fallback: [
      "Interesting data question! Let me analyze this. Could you share the dataset or describe the columns/metrics you're working with?",
      "I'd love to help with that analysis. What format is your data in, and what insights are you looking to extract?",
    ],
  },

  profile_4: {
    greeting: [
      "Hello, creative soul! I'm your Creative Writer. What shall we create today?",
      "Welcome to the writer's studio! Ready to craft something amazing?",
      "Hi there! Whether it's stories, copy, or content — I'm here to help you write.",
    ],
    templates: [
      {
        keywords: ['blog', 'article', 'post', 'content'],
        responses: [
          "I'd structure the blog post like this:\n\n**Hook** — Start with a surprising statistic or question\n**Problem** — Address the reader's pain point\n**Solution** — Present your unique angle\n**Examples** — 2-3 concrete case studies\n**CTA** — Clear next step for the reader\n\nWhat topic should we write about?",
        ],
      },
      {
        keywords: ['story', 'fiction', 'character', 'plot', 'narrative'],
        responses: [
          "Let's build a compelling narrative! Every great story needs:\n\n🎭 **Protagonist** with a clear desire\n⚡ **Conflict** that challenges their world\n🔄 **Transformation** as they grow\n🎯 **Resolution** that satisfies the theme\n\nWhat genre are you thinking? I can draft an opening scene.",
        ],
      },
      {
        keywords: ['email', 'subject', 'newsletter', 'copy'],
        responses: [
          "For email copy, the subject line is everything! Here are some approaches:\n\n- **Curiosity gap**: \"The one thing you're missing about...\"\n- **Urgency**: \"Last chance to...\"\n- **Value-first**: \"Here's your free guide to...\"\n\nWhat's the goal of this email — conversion, engagement, or awareness?",
        ],
      },
    ],
    fallback: [
      "What a creative challenge! Let me brainstorm some ideas. Tell me about your audience and the tone you're going for.",
      "I love this creative direction! Let me draft something. What style resonates with you — conversational, formal, playful?",
    ],
  },

  profile_5: {
    greeting: [
      "Hey! I'm your Sales Rep agent. Let's close some deals!",
      "Welcome! Ready to boost your sales pipeline?",
    ],
    templates: [
      {
        keywords: ['pitch', 'proposal', 'present', 'demo'],
        responses: [
          "For a winning pitch, follow the SPIN framework:\n\n**Situation** — Understand their current setup\n**Problem** — Identify pain points\n**Implication** — Show the cost of inaction\n**Need-payoff** — Present your solution's ROI\n\nWho's the target audience for this pitch?",
        ],
      },
      {
        keywords: ['lead', 'prospect', 'outreach', 'cold'],
        responses: [
          "Here's a proven outreach sequence:\n\n📧 Day 1: Personalized email with value hook\n📞 Day 3: Follow-up call (reference email)\n💼 Day 5: LinkedIn connection + message\n📧 Day 7: Case study email\n📞 Day 10: Final call with urgency\n\nWant me to draft the email templates?",
        ],
      },
    ],
    fallback: [
      "Great sales question! The key is always understanding your customer's needs first. Tell me about your target market.",
      "Let me help you strategize on that. What's your current conversion rate, and where are leads dropping off?",
    ],
  },

  profile_6: {
    greeting: [
      "Hello! I'm your Financial Advisor. Let's talk about your financial goals.",
      "Welcome! Ready to optimize your financial strategy?",
    ],
    templates: [
      {
        keywords: ['invest', 'portfolio', 'stock', 'fund', 'market'],
        responses: [
          "For a balanced portfolio, consider the classic allocation:\n\n📊 **60% Equities** — Growth engine (mix of index funds + select stocks)\n📊 **30% Bonds** — Stability buffer\n📊 **10% Alternatives** — Real estate, commodities\n\n⚠️ *Note: This is educational, not personalized financial advice.* What's your risk tolerance?",
        ],
      },
      {
        keywords: ['budget', 'save', 'expense', 'spending'],
        responses: [
          "The 50/30/20 budgeting rule is a great starting point:\n\n💰 **50% Needs** — Rent, utilities, groceries\n🎮 **30% Wants** — Entertainment, dining out\n🏦 **20% Savings** — Emergency fund, investments\n\nWould you like me to help create a detailed budget breakdown?",
        ],
      },
    ],
    fallback: [
      "That's an important financial consideration. Let me provide some analysis — what's your time horizon for this goal?",
    ],
  },

  profile_7: {
    greeting: [
      "Hi! I'm your HR Assistant. How can I help with your HR needs?",
      "Welcome! Whether it's hiring, policies, or onboarding — I'm here to help.",
    ],
    templates: [
      {
        keywords: ['hire', 'recruit', 'candidate', 'interview', 'job'],
        responses: [
          "For effective recruitment, here's my recommended process:\n\n1. **Define** the role with clear must-haves vs. nice-to-haves\n2. **Source** through multiple channels (LinkedIn, referrals, job boards)\n3. **Screen** with a structured scorecard\n4. **Interview** using behavioral questions (STAR method)\n5. **Close** with a competitive offer + culture pitch\n\nWhat role are you hiring for?",
        ],
      },
      {
        keywords: ['policy', 'leave', 'vacation', 'pto', 'benefit'],
        responses: [
          "Regarding company policies, I can help you draft or review:\n\n📋 PTO and leave policies\n🏥 Benefits enrollment guides\n📐 Remote work agreements\n⚖️ Anti-harassment policies\n\nWhich policy area do you need help with?",
        ],
      },
    ],
    fallback: [
      "I'd be happy to help with that HR matter. Could you share more context about the situation?",
    ],
  },

  profile_8: {
    greeting: [
      "Hey! I'm your DevOps Engineer. Let's automate everything!",
      "Welcome! Ready to streamline your deployment pipeline?",
    ],
    templates: [
      {
        keywords: ['deploy', 'ci', 'cd', 'pipeline', 'github actions'],
        responses: [
          "Here's a solid CI/CD pipeline structure:\n\n```yaml\n# .github/workflows/deploy.yml\nstages:\n  - lint & type-check\n  - unit tests (parallel)\n  - build\n  - deploy to staging\n  - e2e tests\n  - deploy to production\n```\n\nKey principles: fail fast, cache dependencies, parallel where possible. What's your current setup?",
        ],
      },
      {
        keywords: ['docker', 'container', 'kubernetes', 'k8s'],
        responses: [
          "For containerization, follow these best practices:\n\n🐳 Use multi-stage builds to keep images small\n📦 Pin dependency versions\n🔒 Run as non-root user\n💾 Use .dockerignore to exclude unnecessary files\n\nWhat application are you containerizing?",
        ],
      },
    ],
    fallback: [
      "Good DevOps question! Let me think about the best infrastructure approach. What cloud provider are you using?",
    ],
  },

  profile_9: {
    greeting: [
      "Hello! I'm your Legal Consultant agent. How can I assist with legal matters?",
      "Welcome! I can help review documents, explain terms, and provide legal guidance.",
    ],
    templates: [
      {
        keywords: ['contract', 'agreement', 'terms', 'clause'],
        responses: [
          "When reviewing contracts, always check these critical sections:\n\n⚖️ **Liability caps** — Is your exposure limited?\n📅 **Termination clauses** — Can you exit cleanly?\n🔒 **IP ownership** — Who owns work product?\n💰 **Payment terms** — Net 30? Net 60?\n⚠️ **Non-compete scope** — Is it reasonable?\n\nWould you like me to review a specific section?",
        ],
      },
    ],
    fallback: [
      "That's an important legal consideration. Let me provide some guidance — note that this is informational, not legal advice. Please consult a licensed attorney for binding decisions.",
    ],
  },

  profile_10: {
    greeting: [
      "Hi! I'm your UI/UX Designer agent. Let's make beautiful, usable interfaces!",
      "Welcome! Ready to improve your user experience?",
    ],
    templates: [
      {
        keywords: ['design', 'ui', 'layout', 'interface', 'component'],
        responses: [
          "For a great UI, follow these principles:\n\n🎨 **Visual hierarchy** — Guide the eye with size, color, contrast\n📐 **Consistency** — Use a design system (spacing, colors, typography)\n♿ **Accessibility** — WCAG AA minimum (4.5:1 contrast, keyboard nav)\n📱 **Responsive** — Mobile-first, breakpoints at content needs\n\nWhat are you designing? I can suggest specific layout patterns.",
        ],
      },
      {
        keywords: ['color', 'palette', 'theme', 'brand'],
        responses: [
          "For color selection, I recommend:\n\n🎯 **Primary**: 1 brand color (used for CTAs, links)\n🖤 **Neutral**: Slate/gray scale for text and backgrounds\n✅ **Semantic**: Green=success, Red=error, Yellow=warning\n📐 **60-30-10 rule**: 60% neutral, 30% primary, 10% accent\n\nWhat's your brand's primary color?",
        ],
      },
    ],
    fallback: [
      "Interesting design challenge! Let me think about the best UX approach. Can you describe the user flow or share a screenshot?",
    ],
  },
}

// ################ Suggested Prompts ##################
// Profile-specific conversation starters shown in the chat interface
// to help users understand what the agent can do.

export const SUGGESTED_PROMPTS: Record<string, string[]> = {
  profile_1: ['How do I get a refund?', 'Track my order #12345', 'Is there a discount available?', 'My account is locked'],
  profile_2: ['Help me build a React component', 'Debug this error message', 'Write a REST API endpoint', 'Optimize my database query'],
  profile_3: ['Analyze sales trends for Q4', 'Create a dashboard visualization', 'Write a SQL query for user metrics', 'Forecast next month revenue'],
  profile_4: ['Write a blog post about AI', 'Create a product description', 'Draft a newsletter intro', 'Help me with a story opening'],
  profile_5: ['Draft a cold outreach email', 'Help me prepare a demo pitch', 'How to handle objections?', 'Improve my follow-up sequence'],
  profile_6: ['Review my investment portfolio', 'Help me create a budget plan', 'Explain compound interest', 'What are index funds?'],
  profile_7: ['Draft a job posting', 'Onboarding checklist template', 'How to handle PTO requests?', 'Interview question ideas'],
  profile_8: ['Set up a CI/CD pipeline', 'Dockerize my Node.js app', 'Monitor server performance', 'Automate database backups'],
  profile_9: ['Review these contract terms', 'Explain an NDA clause', 'What is fair use?', 'Draft terms of service'],
  profile_10: ['Review my landing page design', 'Choose a color palette', 'Improve form UX', 'Mobile navigation patterns'],
}

// ################ Skill Action Templates ##################
// When the agent has specific skills, it produces rich action cards
// in chat. These templates define what each skill "does" visually.

export const SKILL_ACTION_TEMPLATES: Record<string, { type: string; getResult: (query: string) => { title: string; content: string } }> = {
  sk_search: {
    type: 'search',
    getResult: (query: string) => ({
      title: 'Web Search Results',
      content: `Found 3 relevant results for "${query}":\n\n1. **Official Documentation** — Comprehensive guide covering the topic\n2. **Stack Overflow Answer** — Community-verified solution with 234 upvotes\n3. **Blog Tutorial** — Step-by-step walkthrough with examples`,
    }),
  },
  sk_code: {
    type: 'code',
    getResult: (_query: string) => ({
      title: 'Code Execution Result',
      content: '```\n✓ Code executed successfully\n  Runtime: 0.023s\n  Output: [Result computed]\n  Memory: 2.4MB peak\n```',
    }),
  },
  sk_db: {
    type: 'data',
    getResult: (query: string) => ({
      title: 'Database Query Result',
      content: `Query executed for "${query}":\n\n| ID | Name | Value | Status |\n|-----|------|-------|--------|\n| 1 | Alpha | 94.2 | Active |\n| 2 | Beta | 87.5 | Active |\n| 3 | Gamma | 72.1 | Paused |\n\n*3 rows returned in 0.012s*`,
    }),
  },
  sk_email: {
    type: 'email',
    getResult: (_query: string) => ({
      title: 'Email Draft Ready',
      content: '📧 Email draft prepared and ready for review.\n\n**To:** recipient@example.com\n**Subject:** Following up on our conversation\n**Status:** Draft saved — click Send when ready',
    }),
  },
  sk_calendar: {
    type: 'calendar',
    getResult: (_query: string) => ({
      title: 'Calendar Update',
      content: '📅 Calendar checked:\n\n• Today: 2 meetings (10am, 2pm)\n• Tomorrow: 1 meeting (11am), rest is free\n• This week: 5 open slots available for scheduling',
    }),
  },
  sk_pdf_parse: {
    type: 'generic',
    getResult: (_query: string) => ({
      title: 'PDF Analysis Complete',
      content: '📄 Document parsed successfully:\n\n• Pages: 12\n• Tables found: 3\n• Images: 7\n• Text extracted: 4,200 words\n\nKey sections identified and ready for analysis.',
    }),
  },
  sk_image_gen: {
    type: 'image',
    getResult: (query: string) => ({
      title: 'Image Generated',
      content: `🎨 Image generated based on: "${query}"\n\n*[Simulated image placeholder]*\n\nResolution: 1024×1024\nStyle: Photorealistic\nGeneration time: 3.2s`,
    }),
  },
  sk_data_analysis: {
    type: 'data',
    getResult: (_query: string) => ({
      title: 'Data Analysis Summary',
      content: '📊 Analysis complete:\n\n• **Mean:** 847.3\n• **Median:** 812.0\n• **Std Dev:** 124.5\n• **Trend:** ↗ +12.3% MoM\n• **Outliers:** 2 detected (IDs: 47, 183)\n\nStatistical significance confirmed (p < 0.05).',
    }),
  },
  sk_translate: {
    type: 'translation',
    getResult: (query: string) => ({
      title: 'Translation Complete',
      content: `🌐 Translated text:\n\n**Original:** "${query.slice(0, 50)}..."\n**Spanish:** "Texto traducido de ejemplo..."\n**French:** "Exemple de texte traduit..."\n**Japanese:** "翻訳されたテキストの例..."`,
    }),
  },
  sk_web_scrape: {
    type: 'data',
    getResult: (query: string) => ({
      title: 'Web Scrape Results',
      content: `🕸 Scraped data from target page:\n\n• URL: ${query.includes('http') ? query.slice(0, 40) : 'example.com'}\n• Records extracted: 47\n• Format: Structured JSON\n• Fields: title, price, rating, description\n\nData exported and ready for processing.`,
    }),
  },
  sk_git: {
    type: 'code',
    getResult: (_query: string) => ({
      title: 'Git Operation Complete',
      content: '```\n$ git status\n  On branch: feature/update\n  Changes: 3 modified, 1 new\n  Ahead of origin by 2 commits\n\n✓ Changes committed successfully\n```',
    }),
  },
  sk_social: {
    type: 'generic',
    getResult: (_query: string) => ({
      title: 'Social Media Update',
      content: '📱 Post scheduled:\n\n• Platform: Twitter, LinkedIn\n• Scheduled: Today at 2:00 PM EST\n• Estimated reach: ~2,400 impressions\n• Hashtags: 3 suggested\n\nDraft ready for review.',
    }),
  },
}

// #################################################
