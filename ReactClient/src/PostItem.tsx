import React from 'react';
import { Link } from 'react-router-dom';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const PostItem = ({ post }) => {
  if(!post) {
    return null;
  }
  return (
    <Link to={`/post/${post.id}`} className=' hover:underline'>
      <div className='border rounded-lg shadow p-4 mb-4 bg-gray-800'>
        <img
          src={`${baseURL}${post.img_url}`}
          alt={post.title}
          className='w-full h-48 object-cover mb-4 rounded-lg'
          crossOrigin='anonymous'
        />
        <h2 className='text-xl font-semibold mb-2'>{post.title}</h2>
        <p className='text-sm text-gray-500 mb-2'>
          Publishedss: {new Date(post.published_at).toLocaleDateString()}
        </p>
        <p className='mb-4'>{post.content.slice(0, 150)}...</p>
        <p className='text-blue-500 hover:underline'>
          Read More
        </p>
      </div>
    </Link>
  );
};

export default PostItem;