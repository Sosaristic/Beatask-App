import React, {useEffect, useState} from 'react';
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
import {RouteProp, useNavigation} from '@react-navigation/native'; // Import useNavigation hook if using React Navigation
import {RootStackParamList} from '../../../../App';
import {
  ServiceType,
  SingleServicePayload,
} from '../../../interfaces/apiResponses';
import useFetch from '../../../hooks/useFetch';
import {ActivityIndicator} from 'react-native';
import {GetRating} from '../../../components';
import {StackNavigationProp} from '@react-navigation/stack';
import {makeApiRequest} from '../../../utils/helpers';
import Empty from '../../../components/Empty';
import {SortFilter} from '../../../interfaces/apiResponses';
import FilterModal from '../../../components/FilterModal';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';

interface Item {
  id: string;
  name: string;
  description: string;
  email: string;
  image: any;
  rating: number;
  reviews: number;
  price: number;
  highlyRated?: boolean;
}

type Props = {
  route: RouteProp<RootStackParamList, 'Homeimp'>;
  navigation: StackNavigationProp<RootStackParamList, 'Homeimp'>;
};

export type FilterPayload = {
  price_min?: string;
  price_max?: string;
  rating_min?: string;
  rating_max?: string;
  date?: string;
  category_name: string;
  services?: string;
};

type SortFilterRes = {
  message: string;
  services: SortFilter[];
};

interface mixed extends ServiceType {
  providerName: string;
  category_name: string;
  sub_category: string;
}

const HomeScreen: React.FC<Props> = ({route, navigation}) => {
  const [sortVisible, setSortVisible] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  let routeData = route.params || {};
  const [data, setData] = useState<SortFilter[] | null>(null);
  const [filterPayload, setFilterPayload] = useState<FilterPayload>(routeData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [openFilterModal, setOpenFilterModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: routeData.category_name.toUpperCase(),
      headerTitleStyle: {textTransform: 'capitalize'},
    });
  }, [routeData.category_name]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const {data, error} = await makeApiRequest<SortFilterRes>(
        '/sorting-and-filter',
        'POST',

        filterPayload,
      );
      if (data) {
        setData(data.services);
      }
      if (error) {
        setError(error);
      }
      setLoading(false);
    };

    fetchData();
  }, [filterPayload, routeData]);

  const handleSortChange = (value: string) => {
    setFilterPayload({...filterPayload, services: value});
    setSortVisible(false);
    // Add sorting logic here
  };
  const handleFilterChange = (payload: FilterPayload) => {
    setFilterPayload({...filterPayload, ...payload});
    setOpenFilterModal(false);
    // Add sorting logic here
  };

  const handleView = (payload: SortFilter) => {
    const payloadData: SingleServicePayload = {
      category_name: payload.category,
      service_image: payload.service_image,
      service_name: payload.service_name,
      real_price: payload.real_price,
      service_id: payload.id,
      category_id: payload.category_id,
      provider_id: payload.provider_id,
      provider_name: payload.provider.name,
      sub_category_name: payload.sub_category,
      service_description: payload.service_description,
    };
    console.log('payload', data);

    navigation.navigate('singleservice', {data: payloadData});
  };

  const renderItem = ({item}: {item: SortFilter}) => {
    const providerDetail = data?.find(
      provider => provider.service_id == item.id,
    );

    return (
      <View style={[styles.card, isDarkMode && styles.cardDark]}>
        <View style={{height: 150, width: 150, position: 'relative'}}>
          <Image source={{uri: item.service_image}} style={styles.image} />
        </View>
        <Text style={[styles.name, isDarkMode && styles.textDark]}>
          {`${item.provider.name}`}
        </Text>
        <Text
          numberOfLines={3}
          ellipsizeMode="tail"
          style={[styles.description, isDarkMode && styles.textDark]}>
          {item?.service_description}
        </Text>
        <View style={styles.ratingContainer}>
          {/* <Text style={[styles.rating, isDarkMode && styles.textDark]}>
          <GetRating rating={item.review_rating} />
        </Text> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}>
            <GetRating rating={item.review_rating} />
          </View>
          {/* <Text style={[styles.reviews, isDarkMode && styles.textDark]}>
          ( {item?.})
        </Text> */}
        </View>
        {/* <Text style={[styles.price, isDarkMode && styles.textDark1]}>
        ${item?.real_price}
      </Text> */}
        <TouchableOpacity
          style={[
            styles.button,
            isDarkMode && styles.buttonDark,
            {marginTop: 'auto'},
          ]}
          onPress={() => handleView(item)}>
          <Text style={styles.buttonText}>VIEW</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <ActivityIndicator style={{flex: 1}} size={'large'} color={'#12CCB7'} />
    );
  }
  if (error) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>There was an error fetch providers</Text>
      </View>
    );
  }

  if (data && data.length === 0) {
    return <Empty />;
  }
  console.log(data);

  return (
    <SafeAreaViewContainer edges={['right', 'bottom', 'left']}>
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <FlatList
          data={data || []}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setSortVisible(!sortVisible)}>
            <Icon name="sort" size={24} color="#fff" />
            <Text style={styles.footerButtonText}>SORT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setOpenFilterModal(true)}>
            <Icon name="filter-variant" size={24} color="#fff" />
            <Text style={styles.footerButtonText}>FILTERS</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={sortVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeading}>
                <Text style={styles.modalHeadingText}>Sort by</Text>
                <TouchableOpacity onPress={() => setSortVisible(false)}>
                  <Icon name="close" size={24} color="#010A0C" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => handleSortChange('newest_listing')}
                style={styles.modalOption}>
                <Text style={styles.modalOptionText}>Newest listing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSortChange('most_jobs_completed')}
                style={styles.modalOption}>
                <Text style={styles.modalOptionText}>Most jobs completed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSortChange('best_reviews')}
                style={styles.modalOption}>
                <Text style={styles.modalOptionText}>Best reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSortChange('high_to_low_price')}
                style={styles.modalOption}>
                <Text style={styles.modalOptionText}>High to low price</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSortChange('low_to_high_price')}
                style={styles.modalOption}>
                <Text style={styles.modalOptionText}>Low to high price</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <FilterModal
          open={openFilterModal}
          onClose={() => setOpenFilterModal(false)}
          category_name={routeData.category_name}
          handleFilterChange={handleFilterChange}
        />
      </View>
    </SafeAreaViewContainer>
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
    width: wp('45%'),
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
    borderRadius: 10,
    height: '100%',
    width: '100%',
    objectFit: 'cover',
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
    textAlign: 'center',
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
    borderRadius: 5,
  },
  buttonDark: {
    backgroundColor: '#008b8b',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#00ced1',
    marginHorizontal: 35,
    marginVertical: 15,
    borderRadius: 15,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: 'center',
  },
  modalHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  modalHeadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#010A0C',
  },
  modalOption: {
    paddingVertical: 15,
  },
  modalOptionText: {
    fontSize: 18,
    color: '#010A0C',
  },
  modalCancel: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default HomeScreen;
