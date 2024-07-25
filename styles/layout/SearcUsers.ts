import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  resultContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  result: {
    fontSize: 16,
    flex: 1,
  },
  followButton: {
    backgroundColor: "#007bff",
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
