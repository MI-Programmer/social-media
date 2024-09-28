import PostItem from "@/components/post/PostItem";
import { getUser } from "@/actions/user";
import { Post } from "@/types/post";

interface PostItemsProps {
  posts: Post[];
}

const PostItems = async ({ posts }: PostItemsProps) => {
  const user = await getUser();

  return (
    <div className="space-y-6">
      {posts?.length ? (
        posts?.map((post) => <PostItem key={post.id} post={post} user={user} />)
      ) : (
        <p className="font-medium">You don&apos;t have any posts.</p>
      )}
    </div>
  );
};

export default PostItems;
