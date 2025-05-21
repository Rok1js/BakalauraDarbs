import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';


export function useFakeBackgroundSync() {
  const queryClient = useQueryClient();
  // Periodic fetching every X minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('[Sync] Fetching latest posts...');
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    }, 1 * 60 * 1000); // every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Refetch when app becomes active again (after background)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[Sync] App resumed, fetching posts...');
        queryClient.invalidateQueries({
          queryKey: ['posts'],
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
