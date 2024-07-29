// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/FollowersListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { firestore } from '../firebase';
import { Usuario } from '../model/Usuario';
import styles from '../styles/layout/FollowersList';

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
      <View style={styles.resultContainer}>
        <Image source={{ uri: item.fotoPerfil }} style={styles.profileImage} />
        <Text style={styles.result}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seguidores</Text>
      <FlatList
        data={followersList}
        renderItem={renderFollowerItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default FollowersListScreen;
