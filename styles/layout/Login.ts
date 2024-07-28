// /LocalFundApp/styles/layout/Login.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  },
  h1: {
    position: 'absolute',
    top: 60,
    left: 35,
    fontFamily: 'Poppins_400Regular',
    fontSize: 32, // Aumentando o tamanho do h1
    color: '#000', // Texto mais escuro para melhor contraste
  },
  h2: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000', // Texto um pouco mais claro
    width: '90%',
    textAlign: 'left',
  },
  form: {
    width: '100%',
    marginBottom: 20,
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
});

export default styles;