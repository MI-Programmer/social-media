interface Like {
  id: number;
  user: { id: number; firstName: string; lastName: string };
}

interface Comment {
  id: number;
  content: string;
  author: Author;
}

interface Tag {
  id: number;
}

interface Author {
  id: number;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

export interface Post {
  id: number;
  content: string;
  imageUrl: string;
  likes: Like[] | [];
  comments: Comment[] | [];
  tags: Tag[] | [];
  author: Author;
  createdAt: string;
  updatedAt: string;
}
