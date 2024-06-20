// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/FriendsListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase';
import { Usuario } from '../model/Usuario';

const FriendsListScreen = ({ route, navigation }: any) => {
  const { friends } = route.params;
  const [friendsList, setFriendsList] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friendsData = await Promise.all(friends.map(async (friendId: string) => {
          const doc = await firestore.collection('Usuario').doc(friendId).get();
          if (doc.exists) {
            return new Usuario(doc.data());
          }
          return null;
        }));

        setFriendsList(friendsData.filter(Boolean) as Usuario[]);
      } catch (error) {
        console.error('Erro ao buscar amigos:', error);
      }
    };

    fetchFriends();
  }, [friends]);

  const renderFriendItem = ({ item }: { item: Usuario }) => (
    <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: item.id })}>
      <View style={styles.friendItem}>
        <Text style={styles.friendName}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Amigos</Text>
      <FlatList
        data={friendsList}
        renderItem={renderFriendItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  friendItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  friendName: {
    fontSize: 18,
  },
});

export default FriendsListScreen;
