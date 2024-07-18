import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import PostModel from '../model/Post';
import { useNavigation } from '@react-navigation/native';

interface PostBubbleProps {
  post: PostModel;
}

const PostBubble: React.FC<PostBubbleProps> = ({ post }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('DetalhesPost', { post: { ...post, createdAt: post.createdAt.toDate().toISOString() } });
  };

  return (
    <Marker
      coordinate={{ latitude: post.location!.latitude, longitude: post.location!.longitude }}
      onPress={handlePress}
    >
      <View style={styles.postBubble}>
        <Text>{post.content}</Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  postBubble: {
    backgroundColor: 'white', 
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc'
  }
});

export default PostBubble;
