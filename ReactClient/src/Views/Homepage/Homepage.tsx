import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, {
  FC, useEffect, useState,
} from 'react';
import { Link } from 'react-router';
import axiosClient from 'src/AxiosClient';
import PostItem from 'src/PostItem';
import PushButton from 'src/PushButton';

const prefetchCategories = [
  { name: 'World', url: 'posts/world' },
  { name: 'Local', url: 'posts/local' },
  { name: 'Business', url: 'posts/business' },
  { name: 'Technology', url: 'posts/technology' },
  { name: 'Sports', url: 'posts/sports' },
  { name: 'Entertainment', url: 'posts/entertainment' },
];

const fetchPosts = async () => {
  const { data } = await axiosClient.get('/api/posts');
  return data;
};

const fetchPostById = async (id) => {
  const { data } = await axiosClient.get(`/api/post/${id}`);
  return data;
};

const fetchCaterogies = async (category) => {
  const { data } = await axiosClient.get(`/api/posts/${category}`);
  return data;
};
  
const HomePage = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
    
  useEffect(() => {
    if (isSuccess && data && data.length > 1) {
      prefetchCategories.forEach(category => {
        queryClient.prefetchQuery({
          queryKey: ['posts', category.name.toLowerCase()],
          queryFn: () => fetchCaterogies(category.name),
        });
      });
    }
  }, [isSuccess, data, queryClient]);
    
  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts</div>;
  if (!data) return <div>No posts found</div>;


  return (
    <div className='container mx-auto px-4 py-6'>
      {data.map((post: any) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};
  
export default HomePage;
  