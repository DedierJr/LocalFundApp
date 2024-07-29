// LocalFundApp/components/PostBubble.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import PostModel from '../model/Post';
import styles from '../styles/components/PostBubble';

interface PostBubbleProps {
  post: PostModel;
  onVoltar: () => void;
}

const PostBubble: React.FC<PostBubbleProps> = ({ post, onVoltar }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (post) {
      navigation.navigate('DetalhesPost', {
        post,
        postId: post.id,
        onVoltar
      });
    } else {
      console.error('Post está indefinido');
    }
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

export default PostBubble;
