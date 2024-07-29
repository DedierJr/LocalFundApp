// LocalFundApp/screens/DetalhesPost.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostModel from '../model/Post';
import { updatePost, likePost, unlikePost, addComment } from '../services/postService';
import { getUserById } from '../services/userService';
import { auth } from '../firebase';
import Usuario from '../model/Usuario';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DetalhesPostProps {
  route: {
    params: {
      postId: string;
      post: PostModel; 
      onVoltar: () => void;
    };
  };
}

const DetalhesPost: React.FC<DetalhesPostProps> = ({ route }) => {
  const { postId, post, onVoltar } = route.params;
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post?.content || '');
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const currentUser = auth.currentUser;
  const [commentAuthors, setCommentAuthors] = useState<{ [userId: string]: Usuario }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (post) {
        if (currentUser && post.likes) {
          setIsLiked(post.likes.includes(currentUser.uid));
        }
        if (post.comments) {
          const userIds = new Set(post.comments.map(comment => comment.userId));
          const fetchedUsers: { [userId: string]: Usuario } = {};
          for (const userId of userIds) {
            try {
              const user = await getUserById(userId);
              if (user) {
                fetchedUsers[userId] = user;
              }
            } catch (error) {
              console.error("Error fetching user:", error);
            }
          }
          setCommentAuthors(fetchedUsers);
        }
      }
    };
    fetchData();
  }, [post, currentUser]);

  const irParaPerfil = () => {
    navigation.navigate('UserProfile', { userId: post.userId });
  };

  const handleEditPress = () => {
    setIsEditing(true);
    setEditedContent(post.content);
  };

  const handleSaveEdit = async () => {
    const updatedPost = new PostModel({ ...post, content: editedContent });
    await updatePost(updatedPost);
    setIsEditing(false);
  };

  const handleLikePress = async () => {
    if (isLiked) {
      await unlikePost(postId);
    } else {
      await likePost(postId);
    }
    setIsLiked(!isLiked);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addComment(postId, newComment);
      setNewComment('');
    } else {
      Alert.alert('Erro', 'O comentário não pode estar vazio.');
    }
  };

  const createdAt = post.createdAt instanceof Date ? post.createdAt : post.createdAt.toDate();

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        {post.userId && commentAuthors[post.userId] && (
          <TouchableOpacity onPress={irParaPerfil} style={styles.profileContainer}>
            <Image source={{ uri: commentAuthors[post.userId].profilePicture }} style={styles.profilePicture} />
            <Text style={styles.username}>{commentAuthors[post.userId].username || commentAuthors[post.userId].nickname}</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.postContent}>{post.content}</Text>
        {post.imageUrl ? (
          <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
        ) : null}
        <TouchableOpacity onPress={handleLikePress} style={styles.likeButton}>
          <View style={styles.likes}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color="#C05E3D" />
            <Text style={styles.likeCount}>{post.likes.length}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.createdAt}>Criado em: {createdAt.toLocaleDateString()}</Text>
      </View>
      <View style={styles.commentsContainer}>
        {post.comments?.map((comment, index) => {
          const author = commentAuthors[comment.userId];
          return (
            <View key={index} style={styles.comment}>
              {author && (
                <View style={styles.commentAuthorContainer}>
                  <Image source={{ uri: author.profilePicture }} style={styles.commentAuthorPicture} />
                  <Text style={styles.commentAuthorName}>{author.username || author.nickname}</Text>
                </View>
              )}
              <Text style={styles.commentContent}>{comment.comment}</Text>
            </View>
          );
        })}
        <TextInput
          placeholder="Adicionar comentário"
          value={newComment}
          onChangeText={setNewComment}
          style={styles.commentInput}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.button}>
          <Text style={styles.buttonText}>Comentar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#EFEDE3',
    marginTop: 35,
  },
  postContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F8F6F1',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
    shadowOpacity: 0.1, // Opacidade da sombra
    shadowRadius: 3.84, // Raio da sombra
    elevation: 5, // Elevação para Android
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 16,
    marginBottom: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  likeButton: {
    marginTop: 8,
  },
  likeButtonText: {
    color: '#C05E3D',
    fontSize: 16,
  },
  commentsContainer: {
    marginTop: 16,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F8F6F1',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
    shadowOpacity: 0.1, // Opacidade da sombra
    shadowRadius: 3.84, // Raio da sombra
    elevation: 5, // Elevação para Android
  },
  commentAuthorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthorPicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  commentAuthorName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContent: {
    fontSize: 14,
    marginLeft: 15,
  },
  commentInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 18,
    marginBottom: 8,
  },
  button: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#C05E3D',
    fontSize: 16,
  },
  createdAt: {
    fontSize: 12,
    color: '#888',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
  },
});


export default DetalhesPost;
