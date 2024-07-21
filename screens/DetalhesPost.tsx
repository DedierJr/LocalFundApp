// LocalFundApp\screens\DetalhesPost.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PostModel from '../model/Post';
import { updatePost, likePost, unlikePost, addComment } from '../services/postService';
import { getUserById } from '../services/userService';
import { auth } from '../firebase';
import Usuario from '../model/Usuario';

interface DetalhesPostProps {
  post: PostModel;
  onVoltar: () => void;
}

const DetalhesPost: React.FC<DetalhesPostProps> = ({ post, onVoltar }) => {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post?.content || '');
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

  // Convertendo o timestamp para Date se necessário
  const createdAt = post.createdAt instanceof Date ? post.createdAt : post.createdAt.toDate();

  useEffect(() => {
    // Defina a função onVoltar usando navigation.setOptions
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={onVoltar}> // Acessando a função onVoltar aqui
          <Text>Voltar</Text>
        </TouchableOpacity>
      ),
    });
  }, [onVoltar]); // Passando onVoltar como dependência para o useEffect

  return (
    <View>
      <Text>{post.content}</Text>
      {post.userId && commentAuthors[post.userId] && (
        <TouchableOpacity onPress={irParaPerfil}>
          <Text>{commentAuthors[post.userId].username || commentAuthors[post.userId].nickname}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={handleLikePress}>
        <Text>{isLiked ? 'Descurtir' : 'Curtir'}</Text>
      </TouchableOpacity>
      <Text>Criado em: {createdAt.toLocaleDateString()}</Text>
      <TextInput
        placeholder="Adicionar comentário"
        value={newComment}
        onChangeText={setNewComment}
      />
      <TouchableOpacity onPress={handleAddComment}>
        <Text>Comentar</Text>
      </TouchableOpacity>
      </View>
  );
};

export default DetalhesPost;