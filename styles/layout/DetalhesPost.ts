// LocalFundApp\styles\layout\DetalhesPost.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  postContainer: {
    marginBottom: 0,
    marginTop: 80,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  editInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    marginVertical: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
  },
  likeButton: {
    marginTop: 8,
  },
  likeButtonText: {
    color: "#007bff",
    fontSize: 16,
  },
  commentsContainer: {
    marginTop: 16,
  },
  comment: {
    marginBottom: 16,
  },
  commentAuthorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthorPicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  commentAuthorName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  commentContent: {
    fontSize: 14,
  },
  commentInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
  },
  createdAt: {
    fontSize: 12,
    color: "#888",
  },
});

export default styles;
