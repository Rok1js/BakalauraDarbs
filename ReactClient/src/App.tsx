import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './App.css'
import HomePage from 'VIEWS/Homepage/Homepage';
import Post from 'VIEWS/Post/Post';
import Layout from './Layout';
import UpdateNotification from './UpdateNotification';
import { SidebarProvider } from './SidebarContext';
import { useFakeBackgroundSync } from 'HOOKS/useFakeBackgroundSync';
import PostsCategory from 'VIEWS/PostsCategory.tsx/PostsCategory';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

const Router = () => {
  useFakeBackgroundSync();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/post/:id' element={<Post />} />
        <Route path='/posts/:category' element={<PostsCategory />} />
      </Route>
    </Routes>
  );
}



const App = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [ready, setReady] = useState(false);

  // Wait until service worker is ready before rendering app (for iOS/Offline support)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setReady(true);
      });
    } else {
      setReady(true); // fallback for unsupported browsers
    }
  }, []);

  // Listen for service worker update messages
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NEW_VERSION_AVAILABLE') {
          setShowUpdate(true);
        }
      });
    }
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const handleClose = () => {
    setShowUpdate(false);
  };

  if (!ready) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-900 text-white'>
        Loading...
      </div>
    );
  }

  return (
    <React.Suspense 
      fallback={<div className='flex items-center justify-center h-screen bg-gray-900 text-white'>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <SidebarProvider>
          <BrowserRouter>
            <Router />
            {showUpdate && (
              <UpdateNotification onReload={handleReload} onClose={handleClose} />
            )}
          </BrowserRouter>
        </SidebarProvider>
      </QueryClientProvider>
    </React.Suspense>
  );
};

export default App;
