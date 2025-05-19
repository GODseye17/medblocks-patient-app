// src/tabSync.js
let patientChannel;

const getChannel = () => {
  if (!patientChannel) {
    patientChannel = new BroadcastChannel('patient-updates');
  }
  return patientChannel;
};

export const broadcastPatientUpdate = (type, data) => {
  console.log(`[tabSync] Broadcasting update: ${type}`, data);
  const channel = getChannel();
  channel.postMessage({ type, data });
};

export const setupTabSync = (callbacks) => {
  const channel = getChannel();
  
  const messageHandler = (event) => {
    console.log('[tabSync] Received message:', event.data);
    const { type, data } = event.data;
    
    switch (type) {
      case 'PATIENT_ADDED':
        console.log('[tabSync] Handling PATIENT_ADDED event');
        callbacks.onPatientAdded?.(data);
        break;
      case 'PATIENT_DELETED':
        console.log('[tabSync] Handling PATIENT_DELETED event');
        callbacks.onPatientDeleted?.(data);
        break;
      case 'PATIENT_UPDATED':
        console.log('[tabSync] Handling PATIENT_UPDATED event');
        callbacks.onPatientUpdated?.(data);
        break;
      default:
        console.warn('[tabSync] Unknown update type:', type);
    }
  };
  
  channel.addEventListener('message', messageHandler);
  console.log('[tabSync] Tab sync setup complete');
  
  return () => {
    channel.removeEventListener('message', messageHandler);
    console.log('[tabSync] Tab sync cleanup complete');
  };
};