import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: "#F3F1EA",
  },
  message: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    paddingTop: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
    marginRight: 10,
  },
});

export default styles;
