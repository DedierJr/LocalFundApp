// /home/aluno/Documentos/DedierJr/LocalFundApp/model/Post.tsx
interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  lat?: number;  // Adicionado campo opcional lat
  long?: number; // Adicionado campo opcional long
  userProfilePicture?: string; // Add user profile picture URL
  username?: string;  // Add user username
  nickname?: string;  // Add user nickname
}