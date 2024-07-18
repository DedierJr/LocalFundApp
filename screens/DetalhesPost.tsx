// /LocalFundApp/screens/DetalhesPost.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostModel from '../model/Post'; 
import { updatePost, likePost, unlikePost, addComment } from '../services/postService';
import { getUserById } from '../services/userService';
import { firestore, auth } from '../firebase';
import Usuario from '../model/Usuario';

interface DetalhesPostProps {
  post: PostModel; // Mudando o tipo para PostModel
  onVoltar: () => void;
}

const DetalhesPost: React.FC<DetalhesPostProps> = ({ post, onVoltar }) => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const currentUser = auth.currentUser;
  const [commentAuthors, setCommentAuthors] = useState<{ [userId: string]: Usuario }>({});

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (currentUser && post?.likes) {
        setIsLiked(post.likes.includes(currentUser.uid));
      }
    };

    const fetchCommentAuthors = async () => {
      if (post?.comments) {
        const userIds = new Set(post.comments.map(comment => comment.userId));
        const fetchedUsers: { [userId: string]: Usuario } = {};
        for (const userId of userIds) {
          const user = await getUserById(userId);
          if (user) {
            fetchedUsers[userId] = user;
          }
        }
        setCommentAuthors(fetchedUsers);
      }
    };

    checkLikeStatus();
    fetchCommentAuthors();
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
      await unlikePost(post.id);
    } else {
      await likePost(post.id);
    }
    setIsLiked(!isLiked);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addComment(post.id, newComment);
      setNewComment('');
    } else {
      Alert.alert('Erro', 'O comentário não pode estar vazio.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        <Text style={styles.postContent}>
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={editedContent}
              onChangeText={setEditedContent}
              multiline
            />
          ) : (
            post.content
          )}
        </Text>
        {isEditing ? (
          <TouchableOpacity onPress={handleSaveEdit} style={styles.button}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleEditPress} style={styles.button}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={irParaPerfil} style={styles.profileContainer}>
          <Image source={{ uri: post.userProfilePicture }} style={styles.profilePicture} />
          <Text style={styles.username}>{post.username || post.nickname}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLikePress} style={styles.likeButton}>
          <Text style={styles.likeButtonText}>{isLiked ? 'Descurtir' : 'Curtir'}</Text>
        </TouchableOpacity>
        <Text style={styles.createdAt}>Criado em: {new Date(post.createdAt).toLocaleDateString()}</Text> {/* Exibindo a data em formato legível */}
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
              <Text style={styles.commentContent}>{comment.content}</Text>
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
      <TouchableOpacity onPress={onVoltar} style={styles.button}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  postContainer: {
    marginBottom: 16,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  editInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    marginVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
  },
  likeButton: {
    marginTop: 8,
  },
  likeButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  commentsContainer: {
    marginTop: 16,
  },
  comment: {
    marginBottom: 16,
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
  },
  commentInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  createdAt: {
    fontSize: 12,
    color: '#888'
  }
});

export default DetalhesPost;