// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/SearchUsers.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from '../firebase';
import { searchUsers, isFollowing, followUser, unfollowUser } from '../services/userService';

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
        setResults(users);
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
      // Atualizar o estado local para refletir a mudança de seguindo/não seguindo
      const updatedResults = results.map(user => (user.id === userId ? { ...user, following: true } : user));
      setResults(updatedResults);
    }
  };

  const handleUnfollow = async (userId: string) => {
    const success = await unfollowUser(userId);
    if (success) {
      // Atualizar o estado local para refletir a mudança de seguindo/não seguindo
      const updatedResults = results.map(user => (user.id === userId ? { ...user, following: false } : user));
      setResults(updatedResults);
    }
  };

  const renderItem = ({ item }) => {
    const isFollowingUser = item.following;
    return (
      <TouchableOpacity onPress={() => handleNavigateToProfile(item.id)} style={styles.resultContainer}>
        <Text style={styles.result}>{item.username}</Text>
        {isFollowingUser ? (
          <TouchableOpacity onPress={() => handleUnfollow(item.id)} style={styles.followButton}>
            <Text style={styles.followButtonText}>Deixar de Seguir</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => handleFollow(item.id)} style={styles.followButton}>
            <Text style={styles.followButtonText}>Seguir</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  result: {
    fontSize: 16,
    flex: 1,
  },
  followButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
  },
  followButtonText: {
    color: 'white',
    fontSize: 14,
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  empty: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});

export default SearchUsers;