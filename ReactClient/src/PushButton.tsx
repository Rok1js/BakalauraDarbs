import { NotificationOff } from 'ICONS/NotificationOff';
import { NotificationOn } from 'ICONS/NotificationOn';
import React, { useEffect, useState } from 'react';

const PushButton = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setIsSupported(false);
      setError('Service workers are not supported in this browser');
      return;
    }

    if (!('PushManager' in window)) {
      setIsSupported(false);
      setError('Push notifications are not supported in this browser');
      return;
    }

    navigator.serviceWorker.ready
      .then((reg: ServiceWorkerRegistration) => {
        setRegistration(reg);
        return reg.pushManager.getSubscription();
      })
      .then(subscription => {
        setIsSubscribed(!!subscription);
      })
      .catch((err: Error) => {
        console.error('Error checking subscription:', err);
        setError('Failed to check subscription status');
      });
  }, []);

  const handleSubscribe = async () => {
    try {
      if (!registration) {
        setError('Service worker not ready');
        return;
      }
  
      // Validate VAPID key configuration
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey || typeof vapidPublicKey !== 'string') {
        throw new Error('Missing or invalid VAPID public key configuration');
      }
  
      // Convert VAPID key to Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
  
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }
  
      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });
  
      // Send subscription to backend
      const response = await fetch('https://admin.gofinanceapp.lv/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Handle successful subscription
      setIsSubscribed(true);
      setError(null);
      console.log('Successfully subscribed:', subscription);
  
    } catch (err) {
      // Handle errors
      console.error('Subscription failed:', err);
      
      // Reset subscription state on failure
      setIsSubscribed(false);
      
      // Set user-friendly error message
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe to notifications';
      setError(errorMessage);
  
      // Optional: Unsubscribe if partially completed
      if (err instanceof Error && err.message.includes('already subscribed') && null !== registration) {
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
          await existingSubscription.unsubscribe();
        }
      }
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    try {
      // Convert URL-safe base64 to standard base64
      const standardBase64 = base64String
        .replace(/-/g, '+')
        .replace(/_/g, '/');
  
      // Add padding if needed
      const padding = '='.repeat((4 - (standardBase64.length % 4)) % 4);
      const paddedBase64 = standardBase64 + padding;
  
      // Decode and convert to Uint8Array
      const rawData = atob(paddedBase64);
      const outputArray = new Uint8Array(rawData.length);
      
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    } catch (error) {
      console.error('Error converting VAPID key:', error);
      throw new Error('Invalid VAPID public key format');
    }
  };

  const handleUnsubscribe = async () => {
    try {
      if (!registration) {
        setError('Service worker not ready');
        return;
      }

      // Get existing subscription
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      // Unsubscribe from browser push
      await subscription.unsubscribe();

      // Delete from backend
      const response = await fetch('https://admin.gofinanceapp.lv/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      if (!response.ok) throw new Error('Failed to remove subscription');

      setIsSubscribed(false);
      setError(null);
    } catch (err) {
      console.error('Unsubscribe failed:', err);
      setError(err.message || 'Failed to unsubscribe');
    }
  };

  if (!isSupported) {
    return (
      <div className='p-4 bg-red-100 text-red-700 rounded-lg'>
        {error || 'Push notifications not supported'}
      </div>
    );
  }

  const confirmUnsubscribe = () => {
    if (window.confirm('Are you sure you want to disable notifications?')) {
      handleUnsubscribe();
    }
  };

  return (
    <div className='space-y-4'>
      {isSubscribed ? (
        <button
          onClick={confirmUnsubscribe}
          className='px-2 py-2'
        >
          <NotificationOn />
        </button>
      ) : (
        <button
          onClick={handleSubscribe}
          className='px-2 py-2'
        >
          <NotificationOff />
        </button>
      )}

      {/* {error && (
        <div className='p-3 bg-red-100 text-red-700 rounded-lg'>
          Error: {error}
        </div>
      )}

      {isSubscribed && (
        <div className='p-3 bg-green-100 text-green-700 rounded-lg'>
          You'll receive notifications even when the app is closed!
        </div>
      )} */}
    </div>
  );
};

export default PushButton;