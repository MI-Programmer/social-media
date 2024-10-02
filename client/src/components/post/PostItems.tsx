import PostItem from "@/components/post/PostItem";
import LoadMorePost from "@/components/post/LoadMorePost";
import { getUser } from "@/actions/user";
import { Post } from "@/types/post";

interface PostItemsProps {
  posts: Post[];
  isUserPosts?: boolean;
}

const PostItems = async ({ posts, isUserPosts }: PostItemsProps) => {
  const user = await getUser();

  return (
    <div className="space-y-6">
      {posts?.length ? (
        posts?.map((post) => <PostItem key={post.id} post={post} user={user} />)
      ) : (
        <p className="font-medium">You don&apos;t have any posts.</p>
      )}

      <LoadMorePost
        user={user}
        isUserPosts={isUserPosts}
        isExistPosts={posts.length}
      />
    </div>
  );
};

export default PostItems;
