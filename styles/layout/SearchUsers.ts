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
    borderRadius: 5,
    marginVertical: 4,
  },
  result: {
    fontSize: 16,
    flex: 1,
  },
  followButton: {
    backgroundColor: "#C05E3D", // Cor do botão seguir
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
});

export default styles;