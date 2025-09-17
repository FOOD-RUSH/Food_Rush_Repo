/**
 * Store State Debugger
 * 
 * Utility to help debug store state changes and identify infinite loops
 */

let renderCount = 0;
let lastState: any = {};

export const debugStoreState = (storeName: string, currentState: any) => {
  renderCount++;
  
  // Only log every 10th render to avoid spam, but detect loops
  if (renderCount % 10 === 0 || renderCount > 100) {
    console.log(`🔄 ${storeName} - Render #${renderCount}`, currentState);
    
    // Check for infinite loops
    if (renderCount > 1000) {
      console.error(`❌ INFINITE LOOP detected in ${storeName}! Render count: ${renderCount}`);
      console.error('Last state:', lastState);
      console.error('Current state:', currentState);
      
      // Reset counter to prevent further spam
      renderCount = 0;
    }
  }
  
  lastState = { ...currentState };
  return currentState;
};

export const resetDebugger = () => {
  renderCount = 0;
  lastState = {};
};

// Store state comparison utility
export const compareStates = (oldState: any, newState: any): boolean => {
  if (oldState === newState) return true;
  
  if (typeof oldState !== 'object' || typeof newState !== 'object') {
    return oldState === newState;
  }
  
  if (oldState === null || newState === null) {
    return oldState === newState;
  }
  
  const oldKeys = Object.keys(oldState);
  const newKeys = Object.keys(newState);
  
  if (oldKeys.length !== newKeys.length) return false;
  
  for (let key of oldKeys) {
    if (!newKeys.includes(key)) return false;
    if (oldState[key] !== newState[key]) return false;
  }
  
  return true;
};
