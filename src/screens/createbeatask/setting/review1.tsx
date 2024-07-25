// Import necessary libraries
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Define the functional component
const ReviewCard = () => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const isDarkMode = colorScheme === 'dark';

    const handlechat = () => {
        navigation.navigate('Chat' as never);
    };
    return (
        <View style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <View style={styles.header}>
                <Image
                    source={require('D:/beatask/src/assets/images/category/user.png')}
                    style={styles.profileImage}
                />
                <View style={styles.headerText}>
                    <Text style={[styles.name, isDarkMode ? styles.darkText : styles.lightText]}>Andrew Fisher</Text>
                    <View style={styles.ratingContainer}>
                        <Icon name="star" type="font-awesome" color="#00f2ea" size={15} />
                        <Text style={[styles.rating, isDarkMode ? styles.darkText : styles.lightText]}>5</Text>
                    </View>
                </View>
            </View>
            <Text style={[styles.review, isDarkMode ? styles.darkText : styles.lightText]}>
                Awesome! This is what I was looking for. He did an excellent job. I recommend him to everyone. ❤️❤️
            </Text>
            <Text style={[styles.date, isDarkMode ? styles.darkText : styles.lightText]}>20/06/2024</Text>
            <TouchableOpacity style={styles.respondButton} onPress={handlechat}>
                <Text style={styles.respondText}>RESPOND</Text>
            </TouchableOpacity>
        </View>
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
