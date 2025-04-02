import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, {
  FC, useEffect, useState,
} from 'react';
import { Link, useParams } from 'react-router';
import axiosClient from 'src/AxiosClient';
import PostItem from 'src/PostItem';

const fetchCategoryPosts = async (category) => {
  const { data } = await axiosClient.get(`/api/posts/${category}`);
  return data;
};

const fetchPostById = async (id) => {
  const { data } = await axiosClient.get(`/api/post/${id}`);
  return data;
};
  
const PostsCategory = () => {
  const queryClient = useQueryClient();
  const { category } = useParams();
  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: ['posts', category],
    queryFn: () => fetchCategoryPosts(category),
  });
    
  useEffect(() => {
    if (isSuccess && data && data.length > 1) {
      data.forEach(post => {
        queryClient.prefetchQuery({
          queryKey: ['post', post.id],
          queryFn: () => fetchPostById(post.id),
        });
      });
    }
  }, [isSuccess, data, queryClient]);
    
  if (isLoading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts</div>;
  if (!data) return <div>No posts found</div>;


  return (
    <div className='container mx-auto px-4 py-6'>
      <h1 className='text-[18px] text-center capitalize font-semibold mb-6'>{category}</h1>
      {data.map((post: any) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};
  
export default PostsCategory;
  