// /home/aluno/Documentos/DedierJr/LocalFundApp/styles/layout/FollowingList.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#EFEDE3',
    marginTop: 35,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
    textAlign: 'center',
  },
  resultContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    backgroundColor: '#F8F6F1',
    borderRadius: 10,
    marginVertical: 4,
    marginLeft: 20,
    width: "90%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  result: {
    fontSize: 16,
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default styles;
