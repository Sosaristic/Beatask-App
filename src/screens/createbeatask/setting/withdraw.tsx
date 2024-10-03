import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';
import useFetch from '../../../hooks/useFetch';
import {Transaction} from '../../../interfaces/apiResponses';
import {customTheme} from '../../../custom_theme/customTheme';
import Refresh from '../../../components/Refresh';
import {Text} from 'react-native-paper';
import {Text as FText} from 'react-native-paper';
import useCustomQuery from '../../../hooks/useCustomQuery';
import Entypo from 'react-native-vector-icons/Entypo';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../../App';
import {useUserStore} from '../../../store/useUserStore';

interface TransactionCardProps {
  type: 'Withdrawal' | 'Received' | 'Payed' | 'Fee';
  amount: string;
  status: 'Successfull' | 'Unsuccessful';
  date: string;
  purpose: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  type,
  amount,
  status,
  date,
  purpose,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  let icon: string;
  let iconColor: string;
  let iconBackgroundColor: string;

  switch (type) {
    case 'Payed':
      icon = 'arrow-up';
      iconColor = '#ff0000';
      iconBackgroundColor = '#ffbaba';
      break;
    case 'Withdrawal':
      icon = 'chart-line';
      iconColor = '#808080';
      iconBackgroundColor = '#d3d3d3';
      break;
    case 'Received':
      icon = 'arrow-down';
      iconColor = '#00ff00';
      iconBackgroundColor = '#c2f0c2';
      break;
    default:
      icon = 'help';
      iconColor = '#808080';
      iconBackgroundColor = '#d3d3d3';
      break;
  }

  return (
    <View
      style={[
        styles.transactionCard,
        isDarkMode ? styles.transactionCardDark : styles.transactionCardLight,
      ]}>
      <View
        style={[styles.iconContainer, {backgroundColor: iconBackgroundColor}]}>
        <Icon name={icon} color={iconColor} size={20} />
      </View>
      <View style={[styles.transactionTextContainer, {gap: 4}]}>
        <Text
          style={[
            styles.transactionType,
            isDarkMode ? styles.textDark : styles.textLight1,
          ]}>
          {type}
        </Text>
        <Text
          variant="bodySmall"
          style={[isDarkMode ? styles.textDark : styles.textLight1]}>
          {date}
        </Text>
      </View>
      <View style={styles.amountStatusContainer}>
        <Text
          variant="bodyLarge"
          style={[{color: status === 'Successfull' ? 'green' : '#FF0000'}]}>
          {`$${amount}`}
        </Text>
        <Text
          variant="bodySmall"
          style={[{color: status === 'Successfull' ? 'green' : '#FF0000'}]}>
          {status}
        </Text>
      </View>
    </View>
  );
};

type WithdrawRes = {
  message: string;
  data: Transaction[];
  total_amount: number;
};

type ScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'withdraw'>;
};

const TransactionScreen: React.FC<ScreenProps> = ({navigation}) => {
  const colorScheme = useColorScheme();
  const {user} = useUserStore(state => state);
  const isDarkMode = colorScheme === 'dark';
  const [balanceVisible, setBalanceVisible] = useState(true);

  const {data, error, isLoading, isFetching} = useCustomQuery<WithdrawRes>(
    ['list-transactions-history'],
    '/list-transactions-history',
    'POST',
    {provider_id: user?.id},
  );

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  const handlewithdraw1 = () => {
    navigation.navigate('withdraw1' as never);
  };

  console.log('is fetching', isFetching);

  return (
    <SafeAreaViewContainer edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={
          isDarkMode ? styles.containerDark : styles.containerLight
        }>
        <ImageBackground
          source={{
            uri: 'https://ik.imagekit.io/onj3o7rvm/beatask/bg.webp?updatedAt=1725550269784',
          }}
          style={styles.balanceCard}
          imageStyle={styles.image}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>Available balance</Text>
            <TouchableOpacity onPress={toggleBalanceVisibility}>
              <Icon
                name={balanceVisible ? 'eye-off' : 'eye'}
                color="#12CCB7"
                size={20}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginLeft: 'auto',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
              }}
              onPress={() => navigation.navigate('provider_accounts')}>
              <FText
                style={{
                  color: 'white',
                  marginLeft: 'auto',
                }}>
                Accounts
              </FText>
              <Entypo name="chevron-small-right" color="white" size={20} />
            </TouchableOpacity>
          </View>
          <View>
            {isLoading ? (
              <ActivityIndicator color={customTheme.primaryColor} />
            ) : error || !data ? (
              <Refresh onRefresh={() => {}} />
            ) : (
              <Text style={styles.balanceAmount}>
                {balanceVisible ? `$${data?.total_amount || '0.00'}` : '****'}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={handlewithdraw1}>
            <Text style={styles.withdrawText}>WITHDRAW</Text>
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.transactionHistory}>
          <Text
            style={[
              styles.historyTitle,
              isDarkMode ? styles.textDark : styles.textLight,
            ]}>
            Transaction history
          </Text>

          {isLoading ? (
            <ActivityIndicator
              color={customTheme.primaryColor}
              size={'small'}
            />
          ) : error || !data ? (
            <Refresh onRefresh={() => {}} />
          ) : data?.data.length === 0 ? (
            <Text style={styles.textLight}>No transaction history</Text>
          ) : (
            <>
              {data?.data.map((transaction, index) => (
                <TransactionCard
                  key={index}
                  purpose={transaction.purpose}
                  type={transaction.type}
                  amount={transaction.amount as string}
                  status={transaction.transaction}
                  date={new Date(transaction.created_at).toLocaleString()}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaViewContainer>
  );
};

const styles = StyleSheet.create({
  containerLight: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: wp('5%'),
  },
  containerDark: {
    flexGrow: 1,
    backgroundColor: '#000000',
    padding: wp('5%'),
  },
  balanceCard: {
    width: '100%',
    padding: wp('5%'),
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: wp('5%'),
  },
  image: {
    resizeMode: 'cover',
    width: wp('90%'),
  },
  balanceText: {
    color: '#fff',
    fontSize: wp('4%'),
    marginBottom: wp('1%'),
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAmount: {
    color: '#fff',
    fontSize: wp('8%'),
    fontWeight: 'bold',
    marginBottom: wp('5%'),
  },
  eyeIcon: {
    marginLeft: wp('2%'),
  },
  withdrawButton: {
    backgroundColor: '#00f2ea',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('10%'),
    borderRadius: 30,
    alignSelf: 'flex-start',
    marginTop: hp('3%'),
  },
  withdrawText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: wp('4%'),
  },
  transactionHistory: {
    backgroundColor: '#101010',
    padding: wp('5%'),
    borderRadius: 15,
  },
  historyTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: wp('2%'),
  },
  historySubtitle: {
    fontSize: wp('4%'),
    marginBottom: wp('1%'),
  },
  historyInOut: {
    fontSize: wp('4%'),
    marginBottom: wp('2%'),
  },
  arrowButton: {
    position: 'absolute',
    top: wp('5%'),
    right: wp('5%'),
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    marginVertical: wp('1%'),
    borderWidth: 1,
    borderRadius: 10,
  },
  transactionCardLight: {
    borderColor: '#d3d3d3',
    backgroundColor: '#FFFFFF',
  },
  transactionCardDark: {
    borderColor: '#333333',
    backgroundColor: '#1C1C1C',
  },
  iconContainer: {
    padding: wp('2%'),
    borderRadius: 10,
  },
  transactionTextContainer: {
    flex: 1,
    marginLeft: wp('4%'),
  },
  transactionType: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: wp('3.5%'),
  },
  amountStatusContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  textLight: {
    color: '#fff',
  },
  textLight1: {
    color: '#000',
  },
  textDark: {
    color: '#FFFFFF',
  },
});

export default TransactionScreen;
