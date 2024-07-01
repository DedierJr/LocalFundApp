// /home/aluno/Documentos/DedierJr/LocalFundApp/services/postService.ts
import { firestore } from '../firebase';
import firebase from 'firebase/compat/app'; // Importando firebase
import Post from '../model/Post';

export const createPost = async (post: Post) => {
  const postRef = await firestore.collection('posts').add(post);
  const newPostId = postRef.id;

  // Update user's "posts" array (assuming users have a "posts" field)
  await firestore.collection('Usuario').doc(post.userId).update({
    posts: firebase.firestore.FieldValue.arrayUnion(newPostId) // Corrigido
  });

  return newPostId;
};

export const findPostById = async (postId: string): Promise<Post | null> => {
  const postRef = firestore.collection('posts').doc(postId);
  const postDoc = await postRef.get();

  if (postDoc.exists) {
    return new Post({ id: postDoc.id, ...postDoc.data() });
  } else {
    return null;
  }
};

export const findPostsByUserId = async (userId: string): Promise<Post[]> => {
  const postsQuery = firestore.collection('posts').where('userId', '==', userId);
  const postsSnapshot = await postsQuery.get();

  return postsSnapshot.docs.map(doc => new Post({ id: doc.id, ...doc.data() }));
};

// Find posts within a specified radius from a given location
export const findPostsNearLocation = async (lat: number, long: number, radius: number): Promise<Post[]> => {
  const geopoint = new firebase.firestore.GeoPoint(lat, long);

  // Use geohash-based query for efficient distance filtering
  const postsQuery = firestore.collection('posts')
    .where('location', '<', new firebase.firestore.GeoPoint(lat + radius / 111, long + radius / 111))
    .where('location', '>', new firebase.firestore.GeoPoint(lat - radius / 111, long - radius / 111));

  const postsSnapshot = await postsQuery.get();
  return postsSnapshot.docs.map(doc => new Post({ id: doc.id, ...doc.data() }));
};

export const subscribeToPosts = (userId: string, callback: (posts: Post[]) => void) => {
  return firestore.collection('posts').where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      const posts = snapshot.docs.map(doc => new Post({ id: doc.id, ...doc.data() }));
      callback(posts);
    });
};
