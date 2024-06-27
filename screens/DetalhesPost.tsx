import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Post } from '../model/Post';

interface DetalhesPostProps {
  post: Post | undefined;
  onVoltar: () => void;
}

const DetalhesPost: React.FC<DetalhesPostProps> = ({ post, onVoltar }) => {
  const navigation = useNavigation();

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
      <Text style={styles.content}>{post.content}</Text>
      {post.lat && post.long && (
        <Text style={styles.coordinates}>
          Coordenadas: ({post.lat}, {post.long})
        </Text>
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
});

export default DetalhesPost;
