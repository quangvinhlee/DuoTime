export interface User {
  id: string;
  email: string;
  googleId: string;
  name?: string;
  avatarUrl?: string;
  partnerId?: string;
  partner?: User; // Who is my partner?
  partnerOf?: User; // Who has me as their partner? (only one due to @unique)
}
