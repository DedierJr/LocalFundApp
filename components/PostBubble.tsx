// LocalFundApp/components/PostBubble.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import PostModel from '../model/Post';
import { useNavigation } from '@react-navigation/native';

interface PostBubbleProps {
  post: PostModel;
  // Adiciona a prop onVoltar
  onVoltar: () => void; 
}

const PostBubble: React.FC<PostBubbleProps> = ({ post, onVoltar }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Verificando se o post está definido antes de navegar
    if (post) { 
      // Navegando para DetalhesPost, passando o post como parâmetro
      navigation.navigate('DetalhesPost', { 
        post, postId: post.id ,
        // Passando a função onVoltar para DetalhesPost
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