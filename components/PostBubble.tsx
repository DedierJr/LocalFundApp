// LocalFundApp/components/PostBubble.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';
import PostModel from '../model/Post';
import { useNavigation } from '@react-navigation/native';

interface PostBubbleProps {
  post: PostModel;
}

const PostBubble: React.FC<PostBubbleProps> = ({ post }) => {
  const navigation = useNavigation();

  return (
    <Marker
      coordinate={{ latitude: post.location!.latitude, longitude: post.location!.longitude }}
      onPress={() => navigation.navigate('DetalhesPost', { postId: post.id })}
    >
      <View> 
        <Text>{post.content}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DetalhesPost', { postId: post.id })}>
          <Text style={{ color: 'blue' }}>Ver mais</Text>
        </TouchableOpacity>
      </View>
    </Marker>
  );
};

export default PostBubble;