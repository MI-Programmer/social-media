export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  friends: Friend[];
}

interface Friend {
  id: number;
  friend: User;
  userId: number;
  friendId: number;
}
