// /LocalFundApp/styles/layout/ListarPosts.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#EFEDE3',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    margin: 5,
  },
  filterButtonText: {
    fontSize: 16,
    color: '#C05E3D',
  },
  activeButton: {
    borderColor: 'transparent',
    borderWidth: 3,
    borderBottomColor: '#C05E3D',
  },
  postContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F8F6F1',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 5,
  },
  postAuthorNickname: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  postAuthorProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
});

export default styles;
