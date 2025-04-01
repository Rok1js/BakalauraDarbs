import React from 'react';

const UpdateNotification = ({ onReload, onClose }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
      <div className='bg-white p-6 rounded-md shadow-md max-w-sm w-full'>
        <h2 className='text-xl font-bold mb-2'>Update Available</h2>
        <p className='mb-4 text-gray-900'>
          A new version of the app is available. Please reload to update.
        </p>
        <div className='flex justify-end space-x-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400'
          >
            Dismiss
          </button>
          <button
            onClick={onReload}
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;
