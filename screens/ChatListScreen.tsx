// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/ChatListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { auth, firestore } from '../firebase';
import { Usuario } from '../model/Usuario';

const ChatListScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [friendRequests, setFriendRequests] = useState<{ senderId: string, status: string, username: string, nickname: string, fotoPerfil: string }[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        firestore.collection('Usuario').doc(user.uid).get().then(doc => {
          if (doc.exists) {
            const userData = doc.data();
            const usuario = new Usuario(userData);
            setCurrentUser(usuario);

            const requestsWithDetails = usuario.friendRequests.map(async request => {
              const senderDoc = await firestore.collection('Usuario').doc(request.senderId).get();
              if (senderDoc.exists) {
                const senderData = senderDoc.data() as Usuario;
                return {
                  senderId: request.senderId,
                  status: request.status,
                  username: senderData.username,
                  nickname: senderData.nickname,
                  fotoPerfil: senderData.fotoPerfil
                };
              } else {
                console.error(`No such user document for senderId: ${request.senderId}`);
                return { senderId: request.senderId, status: request.status, username: 'Unknown', nickname: 'Unknown', fotoPerfil: '' };
              }
            });

            Promise.all(requestsWithDetails).then(setFriendRequests);
          } else {
            console.error("No such user document!");
          }
        }).catch(error => console.error("Error getting user document:", error));
      } else {
        console.error("User not logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAcceptRequest = async (senderId: string) => {
    try {
      const updatedRequests = currentUser!.friendRequests.map(request => {
        if (request.senderId === senderId) {
          return { ...request, status: 'accepted' };
        }
        return request;
      });

      await firestore.collection('Usuario').doc(currentUser!.id).update({
        friendRequests: updatedRequests,
        friends: [...currentUser!.friends, senderId]
      });

      setFriendRequests(friendRequests.filter(request => request.senderId !== senderId));
      setCurrentUser(new Usuario({ ...currentUser, friendRequests: updatedRequests, friends: [...currentUser!.friends, senderId] }));
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRejectRequest = async (senderId: string) => {
    try {
      const updatedRequests = currentUser!.friendRequests.filter(request => request.senderId !== senderId);

      await firestore.collection('Usuario').doc(currentUser!.id).update({
        friendRequests: updatedRequests
      });

      setFriendRequests(friendRequests.filter(request => request.senderId !== senderId));
      setCurrentUser(new Usuario({ ...currentUser, friendRequests: updatedRequests }));
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
