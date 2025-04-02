import { useQuery } from '@tanstack/react-query';
import { BackIcon } from 'ICONS/BackIcon';
import React, {
  FC, useEffect, useState,
} from 'react';
import { useNavigate, useParams } from 'react-router';
import axiosClient from 'src/AxiosClient';


const baseURL = import.meta.env.VITE_API_BASE_URL;

const fetchPost = async (id) => {
  const { data } = await axiosClient.get(`/api/post/${id}`);
  return data;
};
  
const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  window.scrollTo(0, 0);

  const { data: post, error, isLoading } = useQuery({
    queryKey: ['post', Number(id)],
    queryFn: () => fetchPost(Number(id)),
  });
  
  if (isLoading) return <div className='p-4'>Loading post...</div>;
  if (error) return <div className='p-4 text-red-500'>Error loading post.</div>;
  if (!post) return <div className='p-4'>No post found.</div>;
  
  return (
    <div className='container mx-auto p-4 px-8'>
      <div className='mb-6'>
        <button onClick={() => navigate(-1)}>
          <BackIcon />
        </button>
      </div>
      <h1 className='text-3xl font-bold mb-4'>{post.title}</h1>
      <p className='text-sm text-gray-500 mb-2'>
        Published on: {new Date(post.published_at).toLocaleDateString()}
      </p>
      {post.img_url && (
        <img
          src={`${baseURL}${post.img_url}`}
          alt={post.title}
          className='w-full h-auto mb-4 rounded shadow'
          crossOrigin='anonymous'
        />
      )}
      <div className='prose max-w-none'>{post.content}</div>
    </div>
  );
};
  
export default Post;
  