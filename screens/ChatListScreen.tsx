import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { auth, firestore } from '../firebase'; // Import firebase config
import { Usuario } from '../model/Usuario'; // Import your Usuario class

const ChatListScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [friendRequests, setFriendRequests] = useState<{ senderId: string, status: string }[]>([]);

  useEffect(() => {
    // Get the currently logged-in user
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // Fetch the user data from Firestore
        firestore.collection('users').doc(user.uid).get().then(doc => {
          if (doc.exists) {
            const userData = doc.data();
            setCurrentUser(new Usuario(userData));
          } else {
            console.error("No such user document!");
          }
        });
      } else {
        // Handle case where user is not logged in (e.g., navigate to login)
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Fetch friend requests for the current user from Firestore
      setFriendRequests(currentUser.friendRequests); 
    }
  }, [currentUser]);

  const handleAcceptRequest = async (senderId: string) => {
    try {
      // Update the friend request status in Firestore
      await firestore.collection('users').doc(currentUser!.id).update({
        friendRequests: currentUser!.friendRequests.map(request => {
          if (request.senderId === senderId) {
            return { ...request, status: 'accepted' };
          }
          return request;
        })
      });

      // Also add the sender to the user's friends list (optional)
      await firestore.collection('users').doc(currentUser!.id).update({
        friends: [...currentUser!.friends, senderId]
      });

      // Update the local state
      setFriendRequests(currentUser!.friendRequests.filter(request => request.senderId !== senderId));
      setCurrentUser(new Usuario({ ...currentUser, friendRequests: currentUser!.friendRequests.filter(request => request.senderId !== senderId), friends: [...currentUser!.friends, senderId] }));
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (senderId: string) => {
    try {
      // Update the friend request status in Firestore
      await firestore.collection('users').doc(currentUser!.id).update({
        friendRequests: currentUser!.friendRequests.filter(request => request.senderId !== senderId)
      });

      // Update the local state
      setFriendRequests(currentUser!.friendRequests.filter(request => request.senderId !== senderId));
      setCurrentUser(new Usuario({ ...currentUser, friendRequests: currentUser!.friendRequests.filter(request => request.senderId !== senderId) }));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const renderFriendRequestItem = ({ item }) => {
    return (
      <View style={styles.requestItem}>
        <Image source={{ uri: item.fotoPerfil }} style={styles.profileImage} />
        <View style={styles.requestInfo}>
          <Text style={styles.requestUsername}>{item.username}</Text>
          <Text style={styles.requestNickname}>{item.nickname}</Text>
          <View style={styles.requestButtons}>
            <TouchableOpacity onPress={() => handleAcceptRequest(item.senderId)} style={styles.acceptButton}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRejectRequest(item.senderId)} style={styles.rejectButton}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Friend Requests</Text>
      </View>
      {currentUser ? (
        <FlatList
          data={friendRequests}
          renderItem={renderFriendRequestItem}
          keyExtractor={(item) => item.senderId}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.message}>Please login to see your friend requests.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20
  },
  header: {
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  requestInfo: {
    flex: 1
  },
  requestUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  requestNickname: {
    fontSize: 14,
    marginBottom: 10
  },
  requestButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginRight: 10
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50
  }
});

export default ChatListScreen;