import React, {
  useEffect,
  useState,
} from 'react';
import { Link, useLocation } from 'react-router';
import { useSidebar } from './SidebarContext';
import PushButton from './PushButton';

const categories = [
  { name: 'Home', url: '' },
  { name: 'World', url: 'posts/world' },
  { name: 'Local', url: 'posts/local' },
  { name: 'Business', url: 'posts/business' },
  { name: 'Technology', url: 'posts/technology' },
  { name: 'Sports', url: 'posts/sports' },
  { name: 'Entertainment', url: 'posts/entertainment' },
];
  
const Navigation = () => {

  const { isOpen, toggleSidebar, closeSidebar } = useSidebar();
  
  return (
    <div className='w-full h-[80px]'>
      <div className='fixed flex items-center justify-between w-full h-[80px] px-4 bg-gray-900'>
        {/* Left: Hamburger Button */}
        <div className='flex items-center w-[40px] h-[40px]'>
          {!isOpen && (
            <button
              onClick={toggleSidebar}
              className='text-3xl text-orange-50 focus:outline-none'
            >
              ☰
            </button>
          )}
        </div>

        {/* Center: Title */}
        <div className='flex-1 text-center'>
          <h1 className='font-bold uppercase tracking-wider text-white'>Ziņotājs</h1>
        </div>

        {/* Right: Push Button */}
        <div className='flex items-center w-[40px] h-[40px]'>
          <PushButton />
        </div>
      </div>
      
  
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className='fixed inset-0 bg-black opacity-50 z-40'
        ></div>
      )}
  
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='p-6 relative'>
          {/* Close Icon */}
          <button
            onClick={toggleSidebar}
            className='absolute top-4 right-4 text-3xl focus:outline-none'
          >
            ×
          </button>
          <h2 className='text-2xl font-bold mb-4'>Kategorijas</h2>
          <ul>
            {categories.map((cat) => (
              <li key={cat.name} className='mb-4'>
                <Link
                  to={`/${cat.url}`}
                  onClick={closeSidebar}
                  className='block text-lg'
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
  
export default Navigation;
  