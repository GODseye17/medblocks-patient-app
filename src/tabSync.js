let patientChannel;

const getChannel = () => {
  if (!patientChannel) {
    patientChannel = new BroadcastChannel('patient-updates');
  }
  return patientChannel;
};

export const broadcastPatientUpdate = (type, data) => {
  const channel = getChannel();
  channel.postMessage({ type, data });
};

export const setupTabSync = (callbacks) => {
  const channel = getChannel();
  
  const messageHandler = (event) => {
    const { type, data } = event.data;
    
    switch (type) {
      case 'PATIENT_ADDED':
        callbacks.onPatientAdded?.(data);
        break;
      case 'PATIENT_DELETED':
        callbacks.onPatientDeleted?.(data);
        break;
      case 'PATIENT_UPDATED':
        callbacks.onPatientUpdated?.(data);
        break;
      default:
        console.warn('Unknown update type:', type);
    }
  };

  channel.addEventListener('message', messageHandler);

  // Return cleanup function
  return () => {
    channel.removeEventListener('message', messageHandler);
  };
};