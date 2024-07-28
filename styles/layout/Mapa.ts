import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEDE3',
  },
  main: {
    position: 'absolute',
    top: '50',
    width: '90%',
    padding: 20,
    backgroundColor: '#F3F1EA',
    borderRadius: 10,
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
    shadowOpacity: 0.25, // Opacidade da sombra
    shadowRadius: 3.84, // Raio da sombra
    elevation: 5, // Elevação para Android
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: "#F3F1EA", // Glassmorphism
  },
  topButton: {
    paddingHorizontal: 20,
    marginHorizontal: 5,
    backgroundColor: 'transparent',
  },
  topButtonText: {
    fontSize: 16,
    color: '#333',
  },
  activeButton: {
    backgroundColor: '#F3F1EA', // Glassmorphism for active button
    borderColor: '#F3F1EA',
    color: '#C05E3D',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 10,
    padding: 8,
  },
  button: {
    padding: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonOutline: {
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonOutlineText: {
    color: '#fff',
  },
  map: {
    flex: 1,
  },
});

export default styles;
