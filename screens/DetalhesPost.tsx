import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Post } from '../model/Post';

interface DetalhesPostProps {
  post: Post | undefined;
  onVoltar: () => void;
}

const DetalhesPost: React.FC<DetalhesPostProps> = ({ post, onVoltar }) => {
  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Post não encontrado</Text>
        <TouchableOpacity onPress={onVoltar} style={styles.button}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>{post.content}</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
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
