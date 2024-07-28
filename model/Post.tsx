// LocalFundApp/model/Post.tsx
import firebase from 'firebase/compat/app';

interface Comment {
  userId: string;
  comment: string;
}

interface Post {
  id?: string;
  userId: string; 
  content: string;
  createdAt: Date;
  location?: firebase.firestore.GeoPoint; 
  likes?: string[];
  comments?: Comment[];
  imageUrl?: string; // Adicionando a propriedade imageUrl
}

class PostModel implements Post {
  id?: string;
  userId: string;
  content: string;
  createdAt: Date;
  location?: firebase.firestore.GeoPoint;
  likes?: string[];
  comments?: Comment[];
  imageUrl?: string;

  constructor(data: Partial<Post>) {
    this.id = data.id;
    this.userId = data.userId ?? '';
    this.content = data.content ?? '';
    this.createdAt = data.createdAt ?? new Date();
    this.location = data.location;
    this.likes = data.likes ?? [];
    this.comments = data.comments ?? [];
    this.imageUrl = data.imageUrl; // Inicializando imageUrl 
  }

  toFirestore() {
    const firestoreData: any = {
      userId: this.userId,
      content: this.content,
      createdAt: this.createdAt,
      likes: this.likes,
      comments: this.comments,
    };
    if (this.location) {
      firestoreData.location = this.location; 
    }
    if (this.imageUrl) { // Adicionando imageUrl ao objeto Firestore
      firestoreData.imageUrl = this.imageUrl;
    }
    return firestoreData;
  }

  static fromFirestore(snapshot: firebase.firestore.DocumentSnapshot): PostModel {
    const data = snapshot.data();
    return new PostModel({
      id: snapshot.id, 
      userId: data?.userId ?? '',
      content: data?.content ?? '',
      createdAt: data?.createdAt?.toDate() ?? new Date(),
      location: data?.location,  
      likes: data?.likes ?? [],
      comments: data?.comments ?? [],
      imageUrl: data?.imageUrl, // Obtendo imageUrl do Firestore
    });
  }
}

export default PostModel;