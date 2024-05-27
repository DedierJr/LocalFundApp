interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  marcadorId?: string;  // Adicionado campo opcional marcadorId
}
