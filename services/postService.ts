// /LocalFundApp/services/postService.ts
import { firestore } from '../firebase';
import firebase from 'firebase/compat/app'; // Importando firebase
import PostModel from '../model/Post'; // Import the PostModel class

export const createPost = async (post: PostModel) => { // Use PostModel as parameter type
  const postRef = await firestore.collection('posts').add(post.toFirestore()); // Convert to Firestore object
  const newPostId = postRef.id;

  // Update the post object with the new ID
  const newPost = new PostModel({ ...post, id: newPostId }); // Create new PostModel

  // Update user's "posts" array (assuming users have a "posts" field)
  await firestore.collection('Usuario').doc(post.userId).update({
    posts: firebase.firestore.FieldValue.arrayUnion(newPostId) // Corrigido
  });

  return newPost; // Return the updated post with the ID
};

export const findPostById = async (postId: string): Promise<PostModel | null> => { // Return PostModel type
  const postRef = firestore.collection('posts').doc(postId);
  const postDoc = await postRef.get();

  if (postDoc.exists) {
    return new PostModel({ id: postDoc.id, ...postDoc.data() }); // Create new PostModel
  } else {
    return null;
  }
};

export const findPostsByUserId = async (userId: string): Promise<PostModel[]> => { // Return PostModel array
  const postsQuery = firestore.collection('posts').where('userId', '==', userId);
  const postsSnapshot = await postsQuery.get();

  return postsSnapshot.docs.map(doc => new PostModel({ id: doc.id, ...doc.data() })); // Create new PostModel
};

// Find posts within a specified radius from a given location
export const findPostsNearLocation = async (lat: number, long: number, radius: number): Promise<PostModel[]> => { // Return PostModel array
  const geopoint = new firebase.firestore.GeoPoint(lat, long);

  // Use geohash-based query for efficient distance filtering
  const postsQuery = firestore.collection('posts')
    .where('location', '<', new firebase.firestore.GeoPoint(lat + radius / 111, long + radius / 111))
    .where('location', '>', new firebase.firestore.GeoPoint(lat - radius / 111, long - radius / 111));

  const postsSnapshot = await postsQuery.get();
  return postsSnapshot.docs.map(doc => new PostModel({ id: doc.id, ...doc.data() })); // Create new PostModel
};

export const subscribeToPosts = (userId: string, callback: (posts: PostModel[]) => void) => { // Pass PostModel array to callback
  return firestore.collection('posts').where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      const posts = snapshot.docs.map(doc => new PostModel({ id: doc.id, ...doc.data() })); // Create new PostModel
      callback(posts);
    });
};

export const updatePost = async (post: PostModel) => { // Use PostModel as parameter type
  try {
    await firestore.collection('posts').doc(post.id).update(post.toFirestore());
    return true; // Indicate success
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    return false; // Indicate failure
  }
};

export const deletePost = async (postId: string) => {
  try {
    await firestore.collection('posts').doc(postId).delete();
    return true; // Indicate success
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    return false; // Indicate failure
  }
};

export const likePost = async (postId: string, userId: string) => {
  try {
    const postRef = firestore.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (postDoc.exists) {
      // No need to create a new PostModel here, as you're just updating likes
      if (postDoc.data().likes && !postDoc.data().likes.includes(userId)) {
        await postRef.update({
          likes: firebase.firestore.FieldValue.arrayUnion(userId)
        });
        return true;
      } else {
        console.error('Post já curtido ou não encontrado.');
        return false;
      }
    } else {
      console.error('Post não encontrado.');
      return false;
    }
  } catch (error) {
    console.error('Erro ao curtir post:', error);
    return false;
  }
};

export const unlikePost = async (postId: string, userId: string) => {
  try {
    const postRef = firestore.collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (postDoc.exists) {
      // No need to create a new PostModel here, as you're just updating likes
      if (postDoc.data().likes && postDoc.data().likes.includes(userId)) {
        await postRef.update({
          likes: firebase.firestore.FieldValue.arrayRemove(userId)
        });
        return true;
      } else {
        console.error('Post não curtido ou não encontrado.');
        return false;
      }
    } else {
      console.error('Post não encontrado.');
      return false;
    }
  } catch (error) {
    console.error('Erro ao remover curtida do post:', error);
    return false;
  }
};

export const addComment = async (postId: string, userId: string, comment: string) => {
  try {
    const postRef = firestore.collection('posts').doc(postId);
    await postRef.update({
      comments: firebase.firestore.FieldValue.arrayUnion({ userId, comment })
    });
    return true;
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    return false;
  }
};