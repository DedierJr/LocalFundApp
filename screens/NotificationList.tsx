// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/NotificationList.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { auth, firestore } from '../firebase';
import { Usuario } from '../model/Usuario';
import { fetchNotifications } from '../services/notificationService';

const NotificationList = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        firestore.collection('Usuario').doc(user.uid).get().then(doc => {
          if (doc.exists) {
            const userData = doc.data();
            const usuario = new Usuario(userData);
            setCurrentUser(usuario);
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

  useEffect(() => {
    const fetchUserNotifications = async () => {
      if (currentUser) {
        const fetchedNotifications = await fetchNotifications(currentUser.id);
        setNotifications(fetchedNotifications);
      }
    };

    fetchUserNotifications();
  }, [currentUser]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await firestore.collection('notifications').doc(notificationId).update({ read: true });
      setNotifications(notifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationPress = async (notification: any) => {
    if (notification.type === 'followed') {
      // Get the ID of the user who followed
      const { userId } = notification

      // Navigate to the user profile screen
      navigation.navigate('UserProfile', { userId }); 
    }
  };

  const renderNotificationItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleNotificationPress(item)} style={styles.notificationItem}>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationMessage}>{item.message}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      {currentUser ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.message}>Please login to see your notifications.</Text>
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2
  },
  notificationContent: {
    flex: 1
  },
  notificationMessage: {
    fontSize: 16
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50
  }
});

export default NotificationList;
