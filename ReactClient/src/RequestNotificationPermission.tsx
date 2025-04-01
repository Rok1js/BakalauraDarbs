// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect } from 'react';

const RequestNotificationPermission = () => {
  useEffect(() => {
    console.log('RequestNotificationPermission mounted');
  
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.');
      return;
    }
  
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    } else {
      console.log('Notification permission already set to:', Notification.permission);
    }
  }, []);
  
  return null;
};

export default RequestNotificationPermission;
