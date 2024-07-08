import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostModel from '../model/Post'; 
import { updatePost, likePost, unlikePost, addComment } from '../services/postService';
import { getUserById } from '../services/userService';
import { firestore, auth } from '../firebase';
import Usuario from '../model/Usuario';

interface DetalhesPostProps {
  post: PostModel | undefined; 
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

  if (!post) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onVoltar} style={styles.button}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const irParaPerfil = () => {
    navigation.navigate('UserProfile', { userId: post.userId });
  };

  const handleEditPress = () => {
    setIsEditing(true);
    setEditedContent(post.content);
  };

  const handleSaveEdit = async () => {
    const updatedPost = new PostModel({ ...post, content: editedContent });
    const success = await updatePost(updatedPost);
    if (success) {
      setIsEditing(false);
      Alert.alert('Sucesso', 'Post atualizado com sucesso!');
    } else {
      Alert.alert('Erro', 'Erro ao atualizar post.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleLike = async () => {
    if (currentUser) {
      const success = await likePost(post.id, currentUser.uid);
      if (success) {
        setIsLiked(true);
      } else {
        Alert.alert('Erro', 'Erro ao curtir post.');
      }
    }
  };

  const handleUnlike = async () => {
    if (currentUser) {
      const success = await unlikePost(post.id, currentUser.uid);
      if (success) {
        setIsLiked(false);
      } else {
        Alert.alert('Erro', 'Erro ao remover curtida.');
      }
    }
  };

  const handleAddComment = async () => {
    if (currentUser && newComment.trim() !== '') {
      const success = await addComment(post.id, currentUser.uid, newComment);
      if (success) {
        setNewComment('');
        Alert.alert('Sucesso', 'Comentário adicionado!');
      } else {
        Alert.alert('Erro', 'Erro ao adicionar comentário.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {post.userProfilePicture && (
        <Image source={{ uri: post.userProfilePicture }} style={styles.profilePicture} />
      )}
      <TouchableOpacity onPress={irParaPerfil}>
        <Text style={styles.username}>{post.username}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={irParaPerfil}>
        <Text style={styles.nickname}>@{post.nickname}</Text>
      </TouchableOpacity>
      {isEditing ? (
        <>
          <TextInput
            style={styles.textInput}
            value={editedContent}
            onChangeText={setEditedContent}
          />
          <TouchableOpacity onPress={handleSaveEdit} style={styles.button}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancelEdit} style={styles.button}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.content}>{post.content}</Text>
          <TouchableOpacity onPress={handleEditPress} style={styles.button}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        </>
      )}
      {post.location && (
        <Text style={styles.coordinates}>
          Coordenadas: ({post.location.latitude}, {post.location.longitude})
        </Text>
      )}
      <View style={styles.likeCommentContainer}>
        <TouchableOpacity onPress={isLiked ? handleUnlike : handleLike} style={styles.likeButton}>
          <Text style={styles.likeButtonText}>{isLiked ? 'Descurtir' : 'Curtir'}</Text>
        </TouchableOpacity>
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Adicionar comentário..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <Button title="Comentar" onPress={handleAddComment} />
        </View>
      </View>
      {post.comments?.length > 0 && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsTitle}>Comentários:</Text>
          {post.comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <Text style={styles.commentAuthor}>
                {commentAuthors[comment.userId]?.nickname || comment.userId}
              </Text>
              <Text style={styles.commentText}>{comment.comment}</Text>
            </View>
          ))}
        </View>
      )}
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
    backgroundColor: '#fff',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  username: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nickname: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
  },
  coordinates: {
    fontSize: 14,
    color: 'gray',
    marginTop: 8,
  },
  button: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  likeCommentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  likeButton: {
    padding: 8,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  likeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginRight: 8,
  },
  commentsContainer: {
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  commentText: {
    fontSize: 14,
  },
});

export default DetalhesPost;