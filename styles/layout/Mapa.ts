// LocalFundApp\styles\layout\Mapa.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: 'transparent',
    borderWidth: 3,
    borderBottomColor: '#C05E3D',
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
