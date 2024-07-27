// /home/aluno/Documentos/DedierJr/LocalFundApp/styles/layout/ListarPosts.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  postContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  postContent: {
    fontSize: 16,
    marginBottom: 5,
  },
  postAuthorNickname: {
    fontSize: 14,
    color: '#555',
  },
});

export default styles;
