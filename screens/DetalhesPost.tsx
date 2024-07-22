// LocalFundApp/screens/DetalhesPost.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostModel from '../model/Post';
import { updatePost, likePost, unlikePost, addComment } from '../services/postService';
import { getUserById } from '../services/userService';
import { auth } from '../firebase';
import Usuario from '../model/Usuario';

interface DetalhesPostProps {
  route: {
    params: {
      postId: string; // Include the postId
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
    // Função assíncrona para buscar dados
    const fetchData = async () => {
      // Make sure the post is defined before accessing its properties
      if (post) {
        // Check if the user has liked the post
        if (currentUser && post.likes) {
          setIsLiked(post.likes.includes(currentUser.uid));
        }

        // Fetch the authors of the comments
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
              // Handle the error appropriately (e.g., display an error message)
            }
          }
          setCommentAuthors(fetchedUsers);
        }
      }
    };

    // Chama a função assíncrona dentro do useEffect
    fetchData(); 
  }, [post, currentUser]); // Dependências do efeito

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
      await unlikePost(postId); // Use postId da rota
    } else {
      await likePost(postId); // Use postId da rota
    }
    setIsLiked(!isLiked);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await addComment(postId, newComment); // Use postId da rota
      setNewComment('');
    } else {
      Alert.alert('Erro', 'O comentário não pode estar vazio.');
    }
  };

  // Convertendo o timestamp para Date se necessário
  const createdAt = post.createdAt instanceof Date ? post.createdAt : post.createdAt.toDate();

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        {post && (
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
        )}
        {isEditing ? (
          <TouchableOpacity onPress={handleSaveEdit} style={styles.button}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleEditPress} style={styles.button}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        )}
        {post.userId && commentAuthors[post.userId] && (
          <TouchableOpacity onPress={irParaPerfil} style={styles.profileContainer}>
            <Image source={{ uri: commentAuthors[post.userId].profilePicture }} style={styles.profilePicture} />
            <Text style={styles.username}>{commentAuthors[post.userId].username || commentAuthors[post.userId].nickname}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleLikePress} style={styles.likeButton}>
          <Text style={styles.likeButtonText}>{isLiked ? 'Descurtir' : 'Curtir'}</Text>
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
    color: '#888',
  },
});

export default DetalhesPost;