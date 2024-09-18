// Import necessary libraries
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import useFetch from '../../../hooks/useFetch';
import {useUserStore} from '../../../store/useUserStore';
import {GetRating, Loader} from '../../../components';
import Empty from '../../../components/Empty';
import {ListReviewsType} from '../../../interfaces/apiResponses';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../App';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';

type ListReviewRes = {
  message: string;
  data: ListReviewsType[];
};

type ReviewCardProps = {
  navigation: StackNavigationProp<RootStackParamList, 'review1'>;
};

// Define the functional component
const ReviewCard: React.FC<ReviewCardProps> = ({navigation}) => {
  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';
  const {user} = useUserStore(state => state);

  const {data, loading, error} = useFetch<ListReviewRes>(
    '/list-reviews',
    'POST',
    {
      provider_id: 42,
    },
  );

  const handlechat = () => {
    navigation.navigate('Chat' as never);
  };

  if (loading) return <Loader />;
  if (error) return <Text>Something went wrong trying to fetch reviews.</Text>;
  if (data === null || data.data.length === 0) return <Empty />;

  return (
    <SafeAreaViewContainer edges={['right', 'bottom', 'left']}>
      <>
        {data.data.map(item => {
          return (
            <View
              key={item.id}
              style={[
                styles.card,
                isDarkMode ? styles.darkCard : styles.lightCard,
              ]}>
              <View style={styles.header}>
                <Image
                  source={
                    item.user.profile_image
                      ? {uri: item.user.profile_image}
                      : require('../../../assets/images/profile-svgrepo-com.svg')
                  }
                  style={styles.profileImage}
                />
                <View style={styles.headerText}>
                  <Text
                    style={[
                      styles.name,
                      isDarkMode ? styles.darkText : styles.lightText,
                    ]}>
                    {item.user.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <GetRating rating={1} />
                    <Text
                      style={[
                        styles.rating,
                        isDarkMode ? styles.darkText : styles.lightText,
                      ]}>
                      {item.rating_stars}
                    </Text>
                  </View>
                </View>
              </View>
              <Text
                style={[
                  styles.review,
                  isDarkMode ? styles.darkText : styles.lightText,
                ]}>
                {item.review_message}
              </Text>
              <Text
                style={[
                  styles.date,
                  isDarkMode ? styles.darkText : styles.lightText,
                ]}>
                {item.created_at
                  ? new Date(item.created_at).toDateString()
                  : ''}
              </Text>
              <TouchableOpacity
                style={styles.respondButton}
                onPress={() =>
                  navigation.navigate('Chat', {
                    chatId: '',
                    providerId: user?.email || '',
                    providerName: user?.name || '',
                    providerAvatar: user?.profile_image || '',
                    customerId: item.user.email || '',
                    customerName: item.user.name || '',
                    customerAvatar: item.user.profile_image || '',
                  })
                }>
                <Text style={styles.respondText}>RESPOND</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </>
    </SafeAreaViewContainer>
  );
};

// Define the styles
const styles = StyleSheet.create({
  card: {
    padding: wp('5%'),
    borderRadius: 10,
    margin: wp('2.5%'),
  },
  darkCard: {
    backgroundColor: '#101010',
  },
  lightCard: {
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
  },
  headerText: {
    marginLeft: wp('2.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  name: {
    fontSize: wp('4.2%'),
    fontWeight: 'bold',
    flex: 1,
  },
  darkText: {
    color: '#fff',
  },
  lightText: {
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#12CCB7',
    paddingHorizontal: wp('1%'),
  },
  rating: {
    fontSize: wp('3.5%'),
    marginLeft: wp('1%'),
  },
  review: {
    fontSize: wp('3.8%'),
    marginVertical: wp('2.5%'),
  },
  date: {
    fontSize: wp('3.5%'),
    marginBottom: wp('2.5%'),
  },
  respondButton: {
    backgroundColor: '#00f2ea',
    paddingVertical: wp('2.5%'),
    paddingHorizontal: wp('5%'),
    alignSelf: 'flex-end',
    borderRadius: 5,
    alignItems: 'center',
  },
  respondText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: wp('3%'),
  },
});

// Export the component
export default ReviewCard;
