export interface JwtPayload {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  googleId: string;
}
