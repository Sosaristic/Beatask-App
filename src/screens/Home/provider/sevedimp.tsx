import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useColorScheme} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation hook if using React Navigation
import useFetch from '../../../hooks/useFetch';
import {useUserStore} from '../../../store/useUserStore';
import {
  Provider,
  SavedProviderData,
  SavedProvidersResponse,
} from '../../../interfaces/apiResponses';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../App';
import Empty from '../../../components/Empty';
import {ActivityIndicator} from 'react-native';
import {customTheme} from '../../../custom_theme/customTheme';

interface Item {
  id: string;
  name: string;
  description: string;
  image: any;
  rating: number;
  reviews: number;
  price: number;
  highlyRated?: boolean;
}

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'seved'>;
};

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const [sortVisible, setSortVisible] = useState(false);
  const [sortValue, setSortValue] = useState('rating');
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const {user} = useUserStore(state => state);
  const {
    data: providersData,
    error,
    loading,
  } = useFetch<SavedProvidersResponse>('/list-saved-provider', 'POST', {
    user_id: `${user?.id}`,
  });

  const renderItem = ({item}: {item: SavedProviderData}) => (
    <View style={[styles.card, isDarkMode && styles.cardDark]}>
      <Image
        source={{uri: item.provider_information.profile_image}}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={[styles.name, isDarkMode && styles.textDark]}>
          {`${item.provider_information.first_legal_name} ${item.provider_information.last_legal_name}`}
        </Text>
        <Text style={[styles.description, isDarkMode && styles.textDark]}>
          {item.provider_information.description}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={[styles.rating, isDarkMode && styles.textDark]}>
            {4.5}
          </Text>
          <Icon name="star" size={20} color="#ffd700" />
          <Text style={[styles.reviews, isDarkMode && styles.textDark]}>
            ({20})
          </Text>
        </View>
        {/* <Text style={[styles.price, isDarkMode && styles.textDark1]}>${item.price}</Text> */}
        <TouchableOpacity
          style={[styles.button, isDarkMode && styles.buttonDark]}
          onPress={() =>
            navigation.navigate('Service', {id: item.saved_provider_id})
          }>
          <Text style={styles.buttonText}>VIEW</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleItemPress = (item: Item) => {
    // Navigate or handle item press action
  };

  const handleView = () => {
    navigation.navigate('Service' as never);
  };

  const handleFilterPress = () => {
    navigation.navigate('Filter' as never);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#12CCB7" />;
  }

  if (error) {
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>There was an error getting saved providers</Text>
    </View>;
  }

  if (providersData?.data.length === 0) {
    return <Empty />;
  }

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <FlatList
        data={providersData?.data || []}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={1} // Set to 1 to display one item per row
        key={'1'} // Unique key to force re-render when changing numColumns
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#010A0C',
  },
  list: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    margin: 5,
    padding: 10,
    backgroundColor: '#51514C',
    borderRadius: 10,
    alignItems: 'center',
  },
  cardDark: {
    backgroundColor: '#fff',
  },
  image: {
    width: wp('40%'),
    height: wp('50%'),
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff',
  },
  textDark: {
    color: '#010A0C',
  },
  textDark1: {
    color: '#12CCB7',
  },
  description: {
    textAlign: 'left',
    marginVertical: 10,
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: wp('4%'),
    marginRight: 5,
    color: '#fff',
  },
  reviews: {
    fontSize: wp('4%'),
    color: '#fff',
  },
  price: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#12CCB7',
  },
  button: {
    backgroundColor: '#00ced1',
    padding: 10,
    borderRadius: wp('4%'),
    marginTop: wp('4%'),
    marginHorizontal: wp('10%'),
  },
  buttonDark: {
    backgroundColor: '#008b8b',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default HomeScreen;
