import { useQuery } from '@tanstack/react-query';
import React, {
  FC, useEffect, useState,
} from 'react';
import { Link } from 'react-router';
import axiosClient from 'src/AxiosClient';
import PostItem from 'src/PostItem';
import PushButton from 'src/PushButton';

const fetchPosts = async () => {
  const { data } = await axiosClient.get('/api/posts');
  return data;
};
  
const HomePage = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts</div>;
  if (!data) return <div>Loading posts...</div>;

  return (
    <div className='container mx-auto px-4 py-6'>
      {data.map((post: any) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};
  
export default HomePage;
  