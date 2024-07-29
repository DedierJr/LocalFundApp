import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EFEDE3',
    marginTop: 34,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    color: '#C05E3D',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    marginTop: 30,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
  },
  uploadButton: {
    backgroundColor: '#C05E3D',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  nickname: {
    fontSize: 22,
  },
  username: {
    fontSize: 17,
    color: '#C05E3D',
    textAlign: 'center',
  },
  bio: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  profile: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    marginVertical: 5,
  },
  icon: {
    marginLeft: 15,
  },
});

export default styles;
