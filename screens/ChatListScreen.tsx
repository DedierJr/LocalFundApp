import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { auth, firestore } from '../firebase'; // Import firebase config

const ChatListScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    // Get the currently logged-in user
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        // Handle case where user is not logged in (e.g., navigate to login)
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Fetch friend requests for the current user from Firestore
      const unsubscribe = firestore.collection('users')
        .doc(currentUser.uid)
        .collection('friendRequests')
        .onSnapshot(snapshot => {
          const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() 
          }));
          setFriendRequests(requests);
        });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleAcceptRequest = async (requestId) => {
    try {
      // Update the friend request status in Firestore
      await firestore.collection('users')
        .doc(currentUser.uid)
        .collection('friendRequests')
        .doc(requestId)
        .update({ status: 'accepted' });

      // Also add the sender to the user's friends list (optional)
      await firestore.collection('users')
        .doc(currentUser.uid)
        .collection('friends')
        .doc(friendRequests.find(r => r.id === requestId).senderId)
        .set({
          // Any additional data you want to store about the friend
        });

      // Update the user's friends list (optional)
      // ...

      // Refresh friend requests
      setFriendRequests(friendRequests.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      // Delete the friend request from Firestore
      await firestore.collection('users')
        .doc(currentUser.uid)
        .collection('friendRequests')
        .doc(requestId)
        .delete();
      // Refresh friend requests
      setFriendRequests(friendRequests.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const renderFriendRequestItem = ({ item }) => {
    const senderRef = firestore.collection('users').doc(item.senderId);
    const [senderData, setSenderData] = useState(null);

    useEffect(() => {
      const unsubscribe = senderRef.onSnapshot(snapshot => {
        setSenderData(snapshot.data());
      });

      return () => unsubscribe();
    }, []);

    if (!senderData) {
      return <View style={styles.requestItem}>
        <Text>Loading sender data...</Text>
      </View>;
    }

    return (
      <View style={styles.requestItem}>
        <Image source={{ uri: senderData.fotoPerfil }} style={styles.profileImage} />
        <View style={styles.requestInfo}>
          <Text style={styles.requestUsername}>{senderData.username}</Text>
          <Text style={styles.requestNickname}>{senderData.nickname}</Text>
          <View style={styles.requestButtons}>
            <TouchableOpacity onPress={() => handleAcceptRequest(item.id)} style={styles.acceptButton}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRejectRequest(item.id)} style={styles.rejectButton}>
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
          keyExtractor={(item) => item.id}
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