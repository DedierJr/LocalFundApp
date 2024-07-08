// /LocalFundApp/model/Post.tsx
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
  location?: firebase.firestore.GeoPoint; // Only GeoPoint for location
  userProfilePicture?: string;
  username?: string;
  nickname?: string;
  likes?: string[];
  comments?: Comment[];
}

class PostModel implements Post {
  id?: string;
  userId: string;
  content: string;
  createdAt: Date;
  location?: firebase.firestore.GeoPoint;
  userProfilePicture?: string;
  username?: string;
  nickname?: string;
  likes?: string[];
  comments?: Comment[];

  constructor(data: Partial<Post>) {
    this.id = data.id;
    this.userId = data.userId ?? '';
    this.content = data.content ?? '';
    this.createdAt = data.createdAt ?? new Date();
    this.location = data.location;
    this.userProfilePicture = data.userProfilePicture;
    this.username = data.username;
    this.nickname = data.nickname;
    this.likes = data.likes ?? [];
    this.comments = data.comments ?? [];
  }

  toFirestore() {
    return {
      userId: this.userId,
      content: this.content,
      createdAt: this.createdAt,
      location: this.location, // Only include GeoPoint
      userProfilePicture: this.userProfilePicture,
      username: this.username,
      nickname: this.nickname,
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
      userProfilePicture: data?.userProfilePicture,
      username: data?.username,
      nickname: data?.nickname,
      likes: data?.likes ?? [],
      comments: data?.comments ?? [],
    });
  }
}

export default PostModel;