import React, {
  useState,
} from 'react';
import { Link } from 'react-router';

const categories = [
  { name: 'World', url: 'posts/world' },
  { name: 'Local', url: 'posts/local' },
  { name: 'Business', url: 'posts/business' },
  { name: 'Technology', url: 'posts/technology' },
  { name: 'Sports', url: 'posts/sports' },
  { name: 'Entertainment', url: 'posts/entertainment' },
];
  
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleNavbar = () => setIsOpen((prev) => !prev);
  
  return (
    <div className='w-full h-[80px]'>
      <div className='fixed flex items-center justify-center w-full  h-[80px]  bg-gray-900'>
        {/* Hamburger Button (positioned fixed outside the flow) */}
        {!isOpen && (
          <button
            onClick={toggleNavbar}
            className='absolute top-4 left-4 z-50 text-3xl text-orange-50 focus:outline-none'
          >
            ☰
          </button>
        )}

        {/* Centered Title */}
        <h1 className='text-center mt-0 font-bold uppercase tracking-wider'>Ziņotājs</h1>
      </div>
      
  
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={toggleNavbar}
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
            onClick={toggleNavbar}
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
                  onClick={toggleNavbar}
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
  