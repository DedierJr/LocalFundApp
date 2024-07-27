// /home/aluno/Documentos/DedierJr/LocalFundApp/styles/layout/ListarPosts.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  postContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postContent: {
    fontSize: 16,
    marginBottom: 5,
    flex: 1,
  },
  postAuthorNickname: {
    fontWeight: 'bold',
    color: 'black',
  },
  deleteButton: {
    color: 'red',
  },
  followingButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginBottom: 10,
  },
  followingButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default styles;
