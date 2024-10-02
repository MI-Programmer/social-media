"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

import PostItem from "@/components/post/PostItem";
import { getPosts, getUserPosts } from "@/actions/post";
import { Post } from "@/types/post";
import { User } from "@/types/user";

const PAGE_SIZE = 5;
let page = 2;

interface LoadMorePostProps {
  user: User;
  isUserPosts?: boolean;
  isExistPosts: number;
}

const LoadMorePost = ({
  user,
  isUserPosts,
  isExistPosts,
}: LoadMorePostProps) => {
  const [ref, inView] = useInView();
  const [posts, setPosts] = useState<Post[] | []>([]);

  useEffect(() => {
    const fetchDataPost = async () => {
      const action = () => (isUserPosts ? getUserPosts(page) : getPosts(page));
      const data = await action();
      if (data.length) page++;
      else page = 0;
      setPosts((curr) => [...curr, ...data]);
    };

    if (inView && page) {
      fetchDataPost();
    }
  }, [inView, isUserPosts]);

  return (
    <>
      {posts?.length
        ? posts?.map((post) => (
            <PostItem key={post.id} post={post} user={user} />
          ))
        : null}

      {isExistPosts === PAGE_SIZE && (
        <div className="flex justify-center text-gray-600">
          {page ? (
            <Loader2 ref={ref} className="mr-2 h-8 w-8 animate-spin" />
          ) : (
            "You've reached the end."
          )}
        </div>
      )}
    </>
  );
};

export default LoadMorePost;
