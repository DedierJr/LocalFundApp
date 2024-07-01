// model/Post.tsx
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
  }
}

export default PostModel;