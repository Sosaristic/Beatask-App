import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SubscriptionScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const isDarkMode = colorScheme === 'dark';


    const handleprofile = () => {
        navigation.navigate('ProfileSetup' as never);
    };
    const handlesetting = () => {
        navigation.navigate('Setting' as never);
    };
    const handleHome = () => {
        navigation.navigate('dashboard' as never);
    };
    const handleChat = () => {
        navigation.navigate('masglist1' as never);
    };
    const handlebooked = () => {
        navigation.navigate('booked1' as never);
    };
    const handlebid = () => {
        navigation.navigate('Bid' as never);
    };
    return (
        <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
        <ScrollView style={isDarkMode ? styles.containerDark : styles.containerLight}>
            <Text style={[styles.header, isDarkMode ? styles.textDark : styles.textLight]}>Get quote credits</Text>
            <Text style={[styles.subHeader, isDarkMode ? styles.textDark : styles.textLight]}>
                Before you can access the bid section, you have to subscribe to a package in order to send quotes to clients.
            </Text>

            {[
                {
                    title: 'Introductory Unlimited Plan',
                    price: '$29.99',
                    duration: 'for two months',
                    description: 'You are able to send Unlimited quotes for two months at a discounted rate.',
                    buttonLabel: 'SUBSCRIBE',
                },
                {
                    title: 'Premium Access Plan',
                    price: '$49.00',
                    duration: 'per month',
                    description: 'You can send Unlimited quotes, priority listing, advanced analytics such as being able to see when their quote was opened, reasons for rejection (consumer behavior), early access to leads, priority support.',
                    buttonLabel: 'SUBSCRIBE',
                },
            ].map((plan, index) => (
                <View key={index} style={[styles.planCard, isDarkMode ? styles.planCardDark : styles.planCardLight]}>
                    <Text style={[styles.planTitle, isDarkMode ? styles.textDark : styles.textLight]}>{plan.title}</Text>
                    <Text style={[styles.planPrice, isDarkMode ? styles.textDark : styles.textLight]}>{plan.price}</Text>
                    <Text style={[styles.planDuration, isDarkMode ? styles.textDark : styles.textLight]}>{plan.duration}</Text>
                    <Text style={[styles.planDescription, isDarkMode ? styles.textDark : styles.textLight]}>{plan.description}</Text>
                    <TouchableOpacity style={styles.subscribeButton}>
                        <Text style={styles.subscribeButtonText}>{plan.buttonLabel}</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
        
             <View style={[styles.footer, { backgroundColor: isDarkMode ? '#021114' : '#FFF' }]}>
         <TouchableOpacity style={styles.footerItem}onPress={handleHome} >
             <Icon name="home-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
             <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText]}>HOME</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.footerItem} onPress={handlebooked}>
             <Icon name="calendar-check-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
             <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText]}>BOOKED</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.footerItem} onPress={handleChat} >
             <Icon name="chat-processing-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
             <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText]}>MESSAGE</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.footerItem} onPress={handlebid} >
             <Icon name="briefcase-variant-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
             <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText]}>BID</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.footerItem} onPress={handleprofile} >
             <Icon name="account-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
             <Text style={[styles.footerText, isDarkMode ? styles.darkText : styles.lightText]}>PROFILE</Text>
         </TouchableOpacity>
     </View>
        </View>
    );
};

const styles = StyleSheet.create({
     containerLight: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: wp('5%'),
    },
    containerDark: {
        flex: 1,
        backgroundColor: '#000000',
        padding: wp('5%'),
    },
    container: {
        flex: 1,
    },
    darkContainer: {
        backgroundColor: '#121212',
    },
    lightContainer: {
        backgroundColor: '#FFFFFF',
    },
    header: {
        fontSize: wp('6%'),
        fontWeight: 'bold',
        marginBottom: wp('2%'),
    },
    subHeader: {
        fontSize: wp('4%'),
        marginBottom: wp('5%'),
    },
    planCard: {
        borderRadius: 15,
        padding: wp('5%'),
        marginBottom: wp('5%'),
    },
    planCardLight: {
        backgroundColor: '#F0F0F0',
    },
    planCardDark: {
        backgroundColor: '#333333',
    },
    planTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        marginBottom: wp('2%'),
    },
    planPrice: {
        fontSize: wp('8%'),
        fontWeight: 'bold',
        marginBottom: wp('2%'),
    },
    planDuration: {
        fontSize: wp('4%'),
        marginBottom: wp('2%'),
    },
    planDescription: {
        fontSize: wp('4%'),
        marginBottom: wp('5%'),
    },
    subscribeButton: {
        backgroundColor: '#00f2ea',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('10%'),
        borderRadius: 30,
        alignSelf: 'center',
    },
    subscribeButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: wp('4%'),
    },
    textLight: {
        color: '#000',
    },
    textDark: {
        color: '#fff',
    },
    darkText: {
        color: 'white',
    },
    lightText: {
        color: 'black',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Default light mode background color
        paddingVertical: hp('1%'),
    },
    footerItem: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: wp('3%'),
        color: '#000', // Default light mode text color
    },
});



export default SubscriptionScreen;
