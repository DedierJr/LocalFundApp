// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/FriendsListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase';
import { Usuario } from '../model/Usuario';

const FollowersListScreen = ({ route, navigation }: any) => {
  const { userId } = route.params; // Get the user's ID for which to fetch followers
  const [followersList, setFollowersList] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const userRef = firestore.collection('Usuario').doc(userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          const user = userDoc.data() as Usuario;
          const followerIds = user.followers;

          const followersData = await Promise.all(followerIds.map(async (followerId: string) => {
            const doc = await firestore.collection('Usuario').doc(followerId).get();
            if (doc.exists) {
              return new Usuario(doc.data());
            }
            return null;
          }));

          setFollowersList(followersData.filter(Boolean) as Usuario[]);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching followers:', error);
      }
    };

    fetchFollowers();
  }, [userId]);

  const renderFollowerItem = ({ item }: { item: Usuario }) => (
    <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: item.id })}>
      <View style={styles.followerItem}>
        <Text style={styles.followerName}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Followers</Text>
      <FlatList
        data={followersList}
        renderItem={renderFollowerItem}
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

export default FollowersListScreen;
