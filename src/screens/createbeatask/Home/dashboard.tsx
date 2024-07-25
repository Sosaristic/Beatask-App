import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

type CardProps = {
    children: React.ReactNode;
    style?: any; // Change this to a more specific type if needed
};


const Card: React.FC<CardProps> = ({ children, style }) => {
    return <View style={[styles.card, style]}>{children}</View>;
};


const HomeScreen: React.FC = () => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const navigation = useNavigation();

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
            <View style={styles.header}>
                <Image
                    source={require('D:/beatask/src/assets/images/category/user.png')}
                    style={styles.profileImage}
                />
                <Text style={[styles.greeting, isDarkMode ? styles.darkText : styles.lightText]}>Good morning Maryland</Text>
                <TouchableOpacity style={styles.settingsIcon} onPress={handlesetting}>
                <Ionicons name="settings-outline" size={wp('6%')} color={isDarkMode ? 'white' : 'black'}  /></TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}>Upcoming bookings</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[...Array(5)].map((_, index) => (
                    <Card key={index} style={[styles.bookingCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
                        <View style={styles.bookingCardContent}>
                            <Text style={[styles.cardTitle, isDarkMode ? styles.darkText : styles.lightText]}>Home improvement</Text>
                            <TouchableOpacity onPress={handleChat}>
                                <Icon name="chat-processing-outline" size={wp('5%')} color={isDarkMode ? 'white' : 'black'} style={styles.chatIcon} />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.cardSubtitle, isDarkMode ? styles.darkSubtitle : styles.lightSubtitle]}>Residential cleaning services</Text>
                        <View style={styles.bookingCardContent}>
                            <Text style={[styles.cardInfo, isDarkMode ? styles.darkText : styles.lightText]}>Date & Time: </Text>
                            <Text style={[styles.cardInfo, isDarkMode ? styles.darkText : styles.lightText]}>Today 10:00 - 12:00 AM</Text>
                        </View>
                        <View style={styles.bookingCardContent}>
                            <Text style={[styles.cardInfo, isDarkMode ? styles.darkText : styles.lightText]}>Specific info:</Text>
                            <Text style={[styles.cardInfo, isDarkMode ? styles.darkText : styles.lightText]}> Bring your toolbox</Text>
                        </View>
                        <View style={styles.bookingCardContent}>
                            <Text style={[styles.cardInfo, isDarkMode ? styles.darkText : styles.lightText]}>Location:</Text>
                            <Text style={[styles.cardInfo, isDarkMode ? styles.darkText : styles.lightText]}> 267 New Avenue Park, New York</Text>
                        </View>
                        <TouchableOpacity >
                            <Text style={styles.mapLink}>View map location</Text>
                        </TouchableOpacity>
                        <View style={styles.cardFooter}>
                            <Text style={[styles.totalCostLabel, isDarkMode ? styles.darkSubtitle : styles.lightSubtitle]}>Total cost</Text>
                            <Text style={[styles.totalCost, isDarkMode ? styles.darkText : styles.lightText]}>$2,000</Text>
                        </View>
                    </Card>
                ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, isDarkMode ? styles.darkText : styles.lightText]}>Pending tasks</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[...Array(5)].map((_, index) => (
                    <Card key={index} style={[styles.taskCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
                        <Text style={[styles.cardTitle, isDarkMode ? styles.darkText : styles.lightText]}>Home management</Text>
                        <Text style={[styles.cardTitle, isDarkMode ? styles.darkText : styles.lightText]}>June 19</Text>
                        <Text style={[styles.cardInfo, isDarkMode ? styles.darkText : styles.lightText]}>9:00am</Text>
                        <Text style={[styles.cardInfo, isDarkMode ? styles.darkText : styles.lightText]}> - </Text>
                        <Text style={[styles.cardInfo, isDarkMode ? styles.darkText : styles.lightText]}>4:00pm</Text>
                    </Card>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        marginBottom: hp('2%'),
        paddingTop: hp('2%'),
    },
    profileImage: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
    },
    greeting: {
        fontSize: wp('4%'),
        marginLeft: wp('3%'),
    },
    settingsIcon: {
        marginLeft: 'auto',
    },
    sectionTitle: {
        fontSize: wp('4%'),
        paddingHorizontal: wp('5%'),
        marginBottom: hp('1%'),
    },
    card: {
        borderRadius: wp('2%'),
        padding: wp('3%'),
        marginLeft: wp('5%'),
        marginRight: wp('3%'),
    },
    darkCard: {
        backgroundColor: '#1E1E1E',
    },
    lightCard: {
        backgroundColor: '#F5F5F5',
    },
    bookingCard: {
        width: wp('85%'),
        height: hp('40%'),
    },
    taskCard: {
        width: wp('40%'),
        height: hp('20%'),
        marginRight: wp('2%'),
    },
    bookingCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: hp('2.5%'),
    },
    chatIcon: {
        marginLeft: wp('2%'),
    },
    cardTitle: {
        fontSize: wp('3.5%'),
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    darkText: {
        color: 'white',
    },
    lightText: {
        color: 'black',
    },
    cardSubtitle: {
        fontSize: wp('3%'),
        marginBottom: hp('0.5%'),
        color: 'grey',
    },
    darkSubtitle: {
        color: 'grey',
    },
    lightSubtitle: {
        color: 'grey',
    },
    cardInfo: {
        fontSize: wp('3%'),
        marginBottom: hp('0.5%'),
        alignSelf: 'center',
    },
    mapLink: {
        fontSize: wp('3%'),
        paddingTop: hp('1%'),
        marginBottom: hp('1%'),
        color: '#00BCD4',
        alignSelf: 'flex-end',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: wp('0.2%'),
        paddingTop: hp('1%'),
        marginTop: hp('4%'),
    },
    totalCostLabel: {
        fontSize: wp('3%'),
    },
    totalCost: {
        fontSize: wp('3.5%'),
        fontWeight: 'bold',
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

export default HomeScreen;
