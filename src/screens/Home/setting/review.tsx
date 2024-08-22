import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useUserStore} from '../../../store/useUserStore';

import useFetch from '../../../hooks/useFetch';
import {UserReview} from '../../../interfaces/apiResponses';
import Empty from '../../../components/Empty';

type ReviewResponse = {
  message: string;
  data: UserReview[];
};

const ReviewScreen = () => {
  const user = useUserStore(state => state.user);

  const [openUserReview, setOpenUserReview] = useState<UserReview | null>(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const {data, error, loading} = useFetch<ReviewResponse>(
    '/user-review',
    'POST',
    {user_id: user?.id?.toString() as string},
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#12CCB7" />;
  }

  if (error || data?.data.length === 0) {
    return <Empty />;
  }

  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
      ]}>
      {data?.data.map(item => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                setOpenUserReview(prev => (prev?.id === item.id ? null : item))
              }
              style={styles.section}>
              <Text
                style={[
                  styles.sectionText,
                  isDarkMode ? styles.darkText : styles.lightText,
                ]}>
                {item.provider.name}
              </Text>
              <Icon
                name={
                  openUserReview?.id === item.id ? 'chevron-down' : 'chevron-up'
                }
                size={wp('4%')}
                style={[
                  styles.chevron,
                  isDarkMode ? styles.darkChevron : styles.lightChevron,
                ]}
              />
            </TouchableOpacity>
            {openUserReview?.id === item.id && (
              <View
                style={[
                  styles.detailsContainer,
                  isDarkMode
                    ? styles.darkDetailsContainer
                    : styles.lightDetailsContainer,
                ]}>
                <Text
                  style={[
                    styles.title,
                    isDarkMode ? styles.darkText : styles.lightText,
                  ]}>
                  Rate
                </Text>
                <View style={styles.ratingContainer}>
                  {Array.from({length: item.rating_stars as number}, (_, i) => (
                    <Icon
                      key={i}
                      name="star"
                      size={24}
                      color="gold"
                      style={styles.star}
                    />
                  ))}
                </View>
                <Text
                  style={[
                    styles.title,
                    isDarkMode ? styles.darkText : styles.lightText,
                  ]}>
                  Review
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    isDarkMode ? styles.darkInput : styles.lightInput,
                  ]}
                  placeholder="What was your experience with this service provider?"
                  placeholderTextColor={isDarkMode ? '#888' : '#555'}
                  value={item.review_message}
                  editable={false}
                  // onChangeText={setReview}
                  multiline
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#f0f0f0',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sectionText: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
  darkText: {
    color: 'white',
  },
  lightText: {
    color: 'black',
  },
  detailsContainer: {
    marginTop: 10,
    borderRadius: wp('5%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('3%'),
  },
  darkDetailsContainer: {
    backgroundColor: '#021114',
  },
  lightDetailsContainer: {
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    marginHorizontal: 10,
  },
  input: {
    padding: 10,
    paddingBottom: 50,
    borderRadius: 5,
    marginBottom: 20,
  },
  input2: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  darkInput: {
    backgroundColor: '#333',
    color: 'white',
  },
  lightInput: {
    backgroundColor: '#ddd',
    color: 'black',
  },
  chevron: {
    alignSelf: 'flex-end',
  },
  darkChevron: {
    color: 'white',
  },
  lightChevron: {
    color: 'black',
  },
});

export default ReviewScreen;
