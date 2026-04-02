// ################ Classname Utility ##################
// Merges multiple classname strings, filtering out falsy values.
// Lightweight alternative to clsx — sufficient for this project scale.

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

// #################################################
