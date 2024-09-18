import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import SafeAreaViewContainer from '../../../components/SafeAreaViewContainer';

interface TransactionCardProps {
  type: 'withdrawal' | 'fee' | 'received';
  amount: string;
  status: 'Successful' | 'Unsuccessful';
  date: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  type,
  amount,
  status,
  date,
}) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  let icon: string;
  let iconColor: string;
  let iconBackgroundColor: string;

  switch (type) {
    case 'withdrawal':
      icon = 'arrow-up';
      iconColor = '#ff0000';
      iconBackgroundColor = '#ffbaba';
      break;
    case 'fee':
      icon = 'chart-line';
      iconColor = '#808080';
      iconBackgroundColor = '#d3d3d3';
      break;
    case 'received':
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
      <View style={styles.transactionTextContainer}>
        <Text
          style={[
            styles.transactionType,
            isDarkMode ? styles.textDark : styles.textLight1,
          ]}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
        <Text
          style={[
            styles.transactionDate,
            isDarkMode ? styles.textDark : styles.textLight1,
          ]}>
          {date}
        </Text>
      </View>
      <View style={styles.amountStatusContainer}>
        <Text style={[styles.transactionAmount, {color: iconColor}]}>
          {`$${amount}`}
        </Text>
        <Text
          style={[
            styles.transactionStatus,
            {color: status === 'Successful' ? '#00FF00' : '#FF0000'},
          ]}>
          {status}
        </Text>
      </View>
    </View>
  );
};

const TransactionScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [balanceVisible, setBalanceVisible] = useState(true);
  const navigation = useNavigation();

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  const handlewithdraw1 = () => {
    navigation.navigate('withdraw1' as never);
  };
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
          </View>
          <View>
            <Text style={styles.balanceAmount}>
              {balanceVisible ? '$3,578' : '****'}
            </Text>
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
          <Text
            style={[
              styles.historySubtitle,
              isDarkMode ? styles.textDark : styles.textLight,
            ]}>
            June 2024
          </Text>
          <Text
            style={[
              styles.historyInOut,
              isDarkMode ? styles.textDark : styles.textLight,
            ]}>
            In: $5,178 Out: $1,600
          </Text>
          <TouchableOpacity style={styles.arrowButton}>
            <Icon name="chevron-right" color="#00f2ea" size={20} />
          </TouchableOpacity>
          <TransactionCard
            type="withdrawal"
            amount="-1,600"
            status="Successful"
            date="Jul 2nd, 11:30:16"
          />
          <TransactionCard
            type="withdrawal"
            amount="-1,600"
            status="Unsuccessful"
            date="Jul 2nd, 11:30:16"
          />
          <TransactionCard
            type="fee"
            amount="20"
            status="Successful"
            date="Jul 2nd, 11:30:16"
          />
          <TransactionCard
            type="received"
            amount="2,000"
            status="Successful"
            date="Jul 2nd, 11:30:16"
          />
          <TransactionCard
            type="received"
            amount="3,178"
            status="Successful"
            date="Jul 2nd, 11:30:16"
          />
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
  transactionAmount: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  transactionStatus: {
    fontSize: wp('4%'),
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
