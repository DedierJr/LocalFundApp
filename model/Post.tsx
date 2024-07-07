// /LocalFundApp/model/Post.tsx
import firebase from 'firebase/compat/app';

interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  lat?: number;
  long?: number;
  userProfilePicture?: string;
  username?: string;
  nickname?: string;
  location?: firebase.firestore.GeoPoint;
  likes?: string[];
  comments?: { userId: string; comment: string }[];
}

class PostModel implements Post {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  lat?: number;
  long?: number;
  userProfilePicture?: string;
  username?: string;
  nickname?: string;
  location?: firebase.firestore.GeoPoint;
  likes?: string[];
  comments?: { userId: string; comment: string }[];

  constructor(data: Partial<Post>) {
    this.id = data.id || '';
    this.userId = data.userId || '';
    this.content = data.content || '';
    this.createdAt = data.createdAt || new Date();
    this.lat = data.lat;
    this.long = data.long;
    this.userProfilePicture = data.userProfilePicture;
    this.username = data.username;
    this.nickname = data.nickname;
    this.location = data.location;
    this.likes = data.likes;
    this.comments = data.comments;
  }

  toFirestore() {
    return {
      id: this.id,
      userId: this.userId,
      content: this.content,
      createdAt: this.createdAt,
      lat: this.lat,
      long: this.long,
      userProfilePicture: this.userProfilePicture,
      username: this.username,
      nickname: this.nickname,
      location: this.location,
      likes: this.likes,
      comments: this.comments,
    };
  }
}

export default PostModel;