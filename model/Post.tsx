// /LocalFundApp/services/postService.ts
import { firestore, geoFirestore } from "../firebase";
import PostModel from "../model/Post";
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

export const createPost = async (post: PostModel) => {
  await firestore.collection('posts').doc().set(post.toFirestore());
};

export const updatePost = async (post: PostModel) => {
  await firestore.collection('posts').doc(post.id).update(post.toFirestore());
};

export const likePost = async (postId: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    return; // Usuário não está logado
  }
  await firestore.collection('posts').doc(postId).update({
    likes: firebase.firestore.FieldValue.arrayUnion(userId)
  });
};

export const unlikePost = async (postId: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    return; // Usuário não está logado
  }
  await firestore.collection('posts').doc(postId).update({
    likes: firebase.firestore.FieldValue.arrayRemove(userId)
  });
};

export const addComment = async (postId: string, comment: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    return; // Usuário não está logado
  }
  await firestore.collection('posts').doc(postId).update({
    comments: firebase.firestore.FieldValue.arrayUnion({ userId, comment })
  });
};