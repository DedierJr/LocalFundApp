// /LocalFundApp/styles/layout/Login.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0', // Tom claro
  },
  h1: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 32, // Aumentando o tamanho do h1
    marginBottom: 20,
    textAlign: 'center',
    color: '#333', // Texto mais escuro para melhor contraste
  },
  form: {
    width: '100%',
    marginBottom: 20,
  },
  formField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#ffffff', // Tom mais claro
    borderRadius: 5,
    padding: 10,
    borderColor: '#ccc', // Adicionando uma borda leve
    borderWidth: 1,
  },
  input: {
    flex: 1,
    color: '#333', // Texto mais escuro
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#13262F', // Nova cor do botão
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
