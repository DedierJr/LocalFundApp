// /LocalFundApp/model/Post.tsx
import firebase from 'firebase/compat/app';

interface Comment {
  userId: string;
  comment: string;
}

interface Post {
  id?: string;
  userId: string; // Mantendo userId como a única informação do usuário
  content: string;
  createdAt: Date;
  location?: firebase.firestore.GeoPoint; // Only GeoPoint for location
  likes?: string[];
  comments?: Comment[];
}

class PostModel implements Post {
  id?: string;
  userId: string;
  content: string;
  createdAt: Date;
  location?: firebase.firestore.GeoPoint;
  likes?: string[];
  comments?: Comment[];

  constructor(data: Partial<Post>) {
    this.id = data.id;
    this.userId = data.userId ?? '';
    this.content = data.content ?? '';
    this.createdAt = data.createdAt ?? new Date();
    this.location = data.location;
    this.likes = data.likes ?? [];
    this.comments = data.comments ?? [];
  }

  toFirestore() {
    return {
      userId: this.userId,
      content: this.content,
      createdAt: this.createdAt,
      location: this.location, // Only include GeoPoint
      likes: this.likes,
      comments: this.comments,
    };
  }

  static fromFirestore(snapshot: firebase.firestore.DocumentSnapshot): PostModel {
    const data = snapshot.data();
    return new PostModel({
      id: snapshot.id, 
      userId: data?.userId ?? '',
      content: data?.content ?? '',
      createdAt: data?.createdAt?.toDate() ?? new Date(),
      location: data?.location,  // Get GeoPoint from Firestore data
      likes: data?.likes ?? [],
      comments: data?.comments ?? [],
    });
  }
}

export default PostModel;