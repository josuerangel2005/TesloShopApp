import { User } from "../../../../../modules/auth/domain/model/user";
import { UserResponse } from "../interfaces/user-response";

export const userToResponse = (user: User): UserResponse => ({
  id: user.getId(),
  name: user.getName(),
  email: user.getEmail(),
  role: user.getRole().toString(),
  image: user.getImage(),
  emailVerified: user.getEmailVerified()?.toISOString() ?? null,
});