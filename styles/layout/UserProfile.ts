import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profile: {
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
  },
  nickname: {
    fontSize: 16,
    color: "grey",
  },
  bio: {
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
  },
});

export default styles;
