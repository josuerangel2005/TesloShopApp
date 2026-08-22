export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  emailVerified: string | null;
}