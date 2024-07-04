// /home/aluno/Documentos/DedierJr/LocalFundApp/screens/SearchUsers.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from '../firebase';
import firebase from 'firebase/compat/app'; // Certifique-se de importar firebase compat
import 'firebase/compat/firestore'; // Certifique-se de importar firestore compat

const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser && query.length > 2) {
      handleSearch(query, currentUser.uid);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = async (text, currentUserId) => {
    const usersRef = firestore.collection('Usuario');
    const snapshot = await usersRef
      .where('username', '>=', text)
      .where('username', '<=', text + '\uf8ff')
      .get();

    const users = snapshot.docs
      .filter(doc => doc.id !== currentUserId) // Exclui o usuário atual dos resultados
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    setResults(users);
  };

  const handleAddFriend = async (userId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = firestore.collection('Usuario').doc(currentUser.uid);
      await userRef.update({
        friends: firebase.firestore.FieldValue.arrayUnion(userId)
      });
      // Notifique o usuário adicionado se necessário
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar usuários..."
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultContainer}>
            <Text style={styles.result}>{item.username}</Text>
            <TouchableOpacity onPress={() => handleAddFriend(item.id)}>
              <Text style={styles.addFriendBtn}>Seguir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
    padding: 8,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  result: {
    fontSize: 16,
  },
  addFriendBtn: {
    color: 'blue',
    fontSize: 16,
  },
});

export default SearchUsers;
