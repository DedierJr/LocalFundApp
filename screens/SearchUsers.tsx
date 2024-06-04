import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore, auth } from '../firebase';

const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async (text) => {
    setQuery(text);
    if (text.length > 2) {
      const usersRef = firestore.collection('Usuario');
      const snapshot = await usersRef
        .where('username', '>=', text)
        .where('username', '<=', text + '\uf8ff')
        .get();
      
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log("Users found:", users); // Adicione esta linha para verificar os usuários encontrados

      setResults(users);
    } else {
      console.log("Query too short"); // Adicione esta linha para verificar quando a consulta é muito curta
      setResults([]); // Limpa a lista de resultados se o texto de pesquisa for menor que 3 caracteres
    }
  };

  const handleAddFriend = async (userId) => {
    const currentUser = auth.currentUser;
    const userRef = firestore.collection('Usuario').doc(currentUser.uid);

    await userRef.update({
      friends: firebase.firestore.FieldValue.arrayUnion(userId)
    });
    // Notifique o usuário adicionado se necessário
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Pesquisar usuários..."
        value={query}
        onChangeText={handleSearch}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultContainer}>
            <Text style={styles.result}>{item.username}</Text>
            <TouchableOpacity onPress={() => handleAddFriend(item.id)}>
              <Text style={styles.addFriendBtn}>Adicionar</Text>
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
