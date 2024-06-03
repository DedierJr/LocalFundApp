// /home/aluno/Documentos/DedierJr/LocalFundApp/model/Post.tsx
interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  lat?: number;  // Adicionado campo opcional lat
  long?: number; // Adicionado campo opcional long
}
