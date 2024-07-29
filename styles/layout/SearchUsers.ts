// LocalFundApp\styles\layout\SearchUsers.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#EFEDE3',
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#F8F6F1',
    borderRadius: 5,
  },
  resultContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    backgroundColor: '#F8F6F1',
    borderRadius: 10,
    marginVertical: 4,
    marginLeft: 20,
    width: "90%",
    shadowColor: '#000', // Cor da sombra
    shadowOffset: { width: 0, height: 2 }, // Deslocamento da sombra
    shadowOpacity: 0.15, // Opacidade da sombra
    shadowRadius: 3.84, // Raio da sombra
    elevation: 5, // Elevação para Android
  },
  result: {
    fontSize: 16,
    flex: 1,
  },
  followButton: {
    backgroundColor: "#C05E3D",
    padding: 8,
    borderRadius: 5,
  },
  followButtonText: {
    color: "white",
    fontSize: 14,
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  empty: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default styles;
