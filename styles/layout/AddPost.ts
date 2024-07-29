// \LocalFundApp\styles\layout\Registro.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Altera para alinhar o conteúdo no topo
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EFEDE3', // Tom claro
  },
  main: {
    width: '90%',
    padding: 20,
    backgroundColor: '#F3F1EA',
    borderRadius: 10,
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
    shadowOpacity: 0.25, // Opacidade da sombra
    shadowRadius: 3.84, // Raio da sombra
    elevation: 5, // Elevação para Android
    marginTop: 100
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#C05E3D',
  },
  form: {
    width: '100%',
    marginBottom: 0,
  },
  formField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#EFEDE3', // Tom mais claro
    borderRadius: 5,
    padding: 10,
    borderColor: '#ccc', // Adicionando uma borda leve
    borderWidth: 1,
  },
  input: {
    flex: 1,
    color: '#000', // Texto mais escuro
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#C05E3D', // Nova cor do botão
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  datePicker: {
    backgroundColor: '#EFEDE3',
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
  },
  dateText: {
    color: '#000',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#C05E3D',
    padding: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  postContentInput: {
    flex: 1,
    color: '#000', 
    marginLeft: 10,
    fontSize: 16,
    padding: 10, 
    marginBottom: 15, 
    minHeight: 80, 
    textAlignVertical: 'top' 
  },
  criarPost: {
    color: '#C05E3D',
  },
});

export default styles;