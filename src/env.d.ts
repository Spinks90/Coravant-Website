declare global {
  interface Window {
    /** Defined by Analytics.astro. Loads GA4 when granted, and remembers the choice. */
    coravantConsent?: (granted: boolean) => void;
  }
}

export {};
