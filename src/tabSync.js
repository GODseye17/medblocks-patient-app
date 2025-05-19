// src/tabSync.js
import { triggerPageRefreshAllTabs } from './PageRefresh';

let patientChannel;

const getChannel = () => {
  if (!patientChannel) {
    patientChannel = new BroadcastChannel('patient-updates');
  }
  return patientChannel;
};

export const broadcastPatientUpdate = (type, data) => {
  // Add extensive logging
  console.log(`[tabSync] Broadcasting update: ${type}`, data);
  
  const channel = getChannel();
  channel.postMessage({ type, data });
  
  // Normalize data structure (handle both PatientID and patientId)
  const patientId = data.PatientID || data.patientId || null;
  
  // Add page refresh functionality based on type
  switch (type) {
    case 'PATIENT_ADDED':
      console.log('[tabSync] Patient added - refreshing patient list');
      triggerPageRefreshAllTabs('/patients');
      break;
    case 'PATIENT_DELETED':
      console.log(`[tabSync] Patient deleted (ID: ${patientId}) - refreshing patient list`);
      
      // Force a small delay before triggering refresh to ensure DB operation completes
      setTimeout(() => {
        console.log('[tabSync] Executing delayed refresh for delete operation');
        triggerPageRefreshAllTabs('/patients');
      }, 100);
      break;
    case 'PATIENT_UPDATED':
      console.log('[tabSync] Patient updated - refreshing patient list');
      triggerPageRefreshAllTabs('/patients');
      break;
    default:
      console.warn('[tabSync] Unknown update type for page refresh:', type);
  }
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
  
  // Return cleanup function
  return () => {
    channel.removeEventListener('message', messageHandler);
    console.log('[tabSync] Tab sync cleanup complete');
  };
};