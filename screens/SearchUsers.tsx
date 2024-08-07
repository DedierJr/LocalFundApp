// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/SearchUsers.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { searchUsers, isFollowing, followUser, unfollowUser } from '../services/userService';
import styles from '../styles/layout/SearchUsers';

const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      if (query.length > 2) {
        const users = await searchUsers(query);
        const updatedUsers = await Promise.all(
          users.map(async (user) => {
            const following = await isFollowing(user.id);
            return { ...user, following };
          })
        );
        setResults(updatedUsers);
      } else {
        setResults([]);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, [query]);

  const handleNavigateToProfile = (userId: string) => {
    navigation.navigate('UserProfile', { userId });
  };

  const handleFollow = async (userId: string) => {
    const success = await followUser(userId);
    if (success) {
      const updatedResults = results.map(user => (user.id === userId ? { ...user, following: true } : user));
      setResults(updatedResults);
    }
  };

  const handleUnfollow = async (userId: string) => {
    const success = await unfollowUser(userId);
    if (success) {
      const updatedResults = results.map(user => (user.id === userId ? { ...user, following: false } : user));
      setResults(updatedResults);
    }
  };

  const renderItem = ({ item }) => {
    const isFollowingUser = item.following;
    return (
      <View style={styles.resultContainer}>
        <TouchableOpacity onPress={() => handleNavigateToProfile(item.id)}>
          <Image source={{ uri: item.fotoPerfil }} style={styles.profileImage} />
          <Text style={styles.result}>{item.username}</Text>
        </TouchableOpacity>
        {isFollowingUser ? (
          <TouchableOpacity onPress={() => handleUnfollow(item.id)} style={styles.followButton}>
            <Text style={styles.followButtonText}>Deixar de Seguir</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => handleFollow(item.id)} style={styles.followButton}>
            <Text style={styles.followButtonText}>Seguir</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar usuários..."
        value={query}
        onChangeText={setQuery}
      />
      {isLoading ? (
        <Text style={styles.loading}>Carregando...</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Nenhum usuário encontrado.</Text>
          )}
        />
      )}
    </View>
  );
};

export default SearchUsers;
