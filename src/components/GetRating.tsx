import {View} from 'react-native';
import {Text} from 'react-native-paper';

const GetRating = ({rating}: {rating: number}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      {Array.from({length: rating}, (_, i) => (
        <Text key={i}> ⭐ </Text>
      ))}
    </View>
  );
};

export default GetRating;
