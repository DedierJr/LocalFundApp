// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/FollowingListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { firestore } from '../firebase';
import { Usuario } from '../model/Usuario';

const FollowingListScreen = ({ route, navigation }: any) => {
  const { userId } = route.params; // Get the user's ID for which to fetch following
  const [followingList, setFollowingList] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const userRef = firestore.collection('Usuario').doc(userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          const user = userDoc.data() as Usuario;
          const followingIds = user.following;

          const followingData = await Promise.all(followingIds.map(async (followingId: string) => {
            const doc = await firestore.collection('Usuario').doc(followingId).get();
            if (doc.exists) {
              return new Usuario(doc.data());
            }
            return null;
          }));

          setFollowingList(followingData.filter(Boolean) as Usuario[]);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching following:', error);
      }
    };

    fetchFollowing();
  }, [userId]);

  const renderFollowingItem = ({ item }: { item: Usuario }) => (
    <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: item.id })}>
      <View style={styles.followingItem}>
        <Text style={styles.followingName}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Following</Text>
      <FlatList
        data={followingList}
        renderItem={renderFollowingItem}
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

export default FollowingListScreen;