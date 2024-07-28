// LocalFundApp/services/postService.ts
import { firestore } from '../firebase';
import PostModel from '../model/Post';
import firebase from 'firebase/compat/app';

export const findPostsNearLocation = async (
  latitude: number,
  longitude: number,
  radius: number
) => {
  const center = new firebase.firestore.GeoPoint(latitude, longitude);

  // Obtendo posts dentro do raio usando geofirestore
  const posts = await geoFirestore
    .collection("posts")
    .near(center, radius)
    .get()
    .then((querySnapshot) => {
      const posts: PostModel[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // console.log('Dados do post:', data);
        posts.push({ id: doc.id, ...data } as PostModel);
      });
      return posts;
    });
  return posts;
};

export const createPost = async (post: PostModel): Promise<void> => {
  try {
    // Criando um novo post com id automático
    const postRef = firestore.collection("posts").doc();
    await postRef.set({
      ...post.toFirestore(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    throw error; // Re-lançando o erro para que possa ser tratado no componente que chamou a função
  }
};

export const updatePost = async (post: PostModel) => {
  try {
    await firestore.collection('posts').doc(post.id).update(post.toFirestore());
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    throw error; 
  }
};

export const likePost = async (postId: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    return; // Usuário não está logado
  }
  try {
    // Adiciona o ID do usuário ao array de likes do post
    await firestore.collection('posts').doc(postId).update({
      likes: firebase.firestore.FieldValue.arrayUnion(userId)
    });
  } catch (error) {
    console.error("Erro ao curtir post:", error);
    throw error; 
  }
};

export const unlikePost = async (postId: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    return; // Usuário não está logado
  }
  try {
    // Remove o ID do usuário do array de likes do post
    await firestore.collection('posts').doc(postId).update({
      likes: firebase.firestore.FieldValue.arrayRemove(userId)
    });
  } catch (error) {
    console.error("Erro ao descurtir post:", error);
    throw error; 
  }
};

export const addComment = async (postId: string, comment: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    return; // Usuário não está logado
  }
  try {
    // Adiciona o comentário ao array de comentários do post
    await firestore.collection('posts').doc(postId).update({
      comments: firebase.firestore.FieldValue.arrayUnion({ userId, comment })
    });
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    throw error; 
  }
};

export const deletePost = async (postId: string) => {
  try {
    await firestore.collection('posts').doc(postId).delete();
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    throw error; 
  }
};

export const getProfilePictureByUserId = async (userId: string): Promise<string | null> => {
  try {
    const userDoc = await firestore.collection('Usuario').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data() as Usuario;
      return userData.fotoPerfil; // Retorna a URL da foto de perfil
    } else {
      console.error('Usuário não encontrado:', userId);
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter a foto de perfil do usuário:', error);
    return null;
  }
};

export const getNicknameByUserId = async (userId: string): Promise<string | null> => {
  try {
    const userDoc = await firestore.collection('Usuario').doc(userId).get();
    if (userDoc.exists) {
      const userData = userDoc.data() as Usuario;
      return userData.nickname; // Retorna o nickname
    } else {
      console.error('Usuário não encontrado:', userId);
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter o nickname do usuário:', error);
    return null;
  }
};