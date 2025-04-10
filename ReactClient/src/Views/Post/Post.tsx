import { useQuery } from '@tanstack/react-query';
import { BackIcon } from 'ICONS/BackIcon';
import React, {
  FC, useEffect, useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import axiosClient from 'src/AxiosClient';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const Post = () => {
  const navigate = useNavigate();
  window.scrollTo(0, 0);

  const { state } = useLocation();
  const postItem = state?.post;

  if (!postItem) return <div className='p-4'>No post found.</div>;
  
  return (
    <div className='container mx-auto p-4 px-8'>
      <div className='mb-6'>
        <button onClick={() => navigate(-1)}>
          <BackIcon />
        </button>
      </div>
      <h1 className='text-3xl font-bold mb-4'>{postItem.title}</h1>
      <p className='text-sm text-gray-500 mb-2'>
        Published on: {new Date(postItem.published_at).toLocaleDateString()}
      </p>
      {postItem.img_url && (
        <img
          src={`${baseURL}${postItem.img_url}`}
          alt={postItem.title}
          className='w-full h-auto mb-4 rounded shadow'
          crossOrigin='anonymous'
        />
      )}
      <div className='prose max-w-none'>{postItem.content}</div>
    </div>
  );
};
  
export default Post;
  