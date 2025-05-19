// src/pageRefreshManager.js
const PAGE_REFRESH_KEY = 'page_refresh_trigger';
const PAGE_REFRESH_TIMESTAMP = 'page_refresh_timestamp';
const PAGE_REFRESH_TARGET = 'page_refresh_target';

// Initialize the page-specific refresh manager
const initPageRefreshManager = (currentPagePath) => {
  // Listen for refresh events from other tabs
  window.addEventListener('storage', (event) => {
    if (event.key === PAGE_REFRESH_KEY) {
      const timestamp = parseInt(localStorage.getItem(PAGE_REFRESH_TIMESTAMP), 10);
      const targetPage = localStorage.getItem(PAGE_REFRESH_TARGET);
      const currentTime = new Date().getTime();
      const currentPath = window.location.pathname;
      
      // Only refresh if:
      // 1. The trigger is recent (within last 3 seconds)
      // 2. The current page matches the target page
      if (timestamp && currentTime - timestamp < 3000 && currentPath === targetPage) {
        console.log(`Refreshing specific page: ${targetPage}`);
        window.location.reload();
      }
    }
  });
};

// Function to trigger refresh of a specific page across all tabs
const triggerPageRefreshAllTabs = (pagePath) => {
  // Set the target page
  localStorage.setItem(PAGE_REFRESH_TARGET, pagePath);
  // Set timestamp
  localStorage.setItem(PAGE_REFRESH_TIMESTAMP, new Date().getTime().toString());
  // Set the trigger with a random value
  localStorage.setItem(PAGE_REFRESH_KEY, Math.random().toString());
  
  // If current page matches target page, refresh this tab too
  if (window.location.pathname === pagePath) {
    window.location.reload();
  }
};

export { initPageRefreshManager, triggerPageRefreshAllTabs };