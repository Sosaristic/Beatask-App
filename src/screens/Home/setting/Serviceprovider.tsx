import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Modal, useColorScheme, Dimensions } from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
    const colorScheme = useColorScheme() || 'light';
    const screenWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    const [BookVisible, setBookVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setBookVisible(false);
            return () => setBookVisible(false);
        }, [])
    );

    const styles = getStyles(colorScheme, screenWidth);
    const [likedReviews, setLikedReviews] = useState<{ [key: string]: boolean }>({
        'review-0': true,
        'review-1': false,
        'review-2': false,
    });

    const handlemasg = () => {
        navigation.navigate('Masg' as never);
    };
    const handlepayment = () => {
        navigation.navigate('payment' as never);
    };
    const handlecalenderpayment = () => {
        navigation.navigate('calenderbook' as never);
    };
    const handleSortChange = (value: string) => {
        // Add sorting logic here
    };

    const toggleLike = (reviewKey: string) => {
        setLikedReviews(prevState => ({
            ...prevState,
            [reviewKey]: !prevState[reviewKey],
        }));
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image
                    source={require('D:/beatask/src/assets/images/category/booked.png')}
                    style={styles.image}
                />
                <View style={styles.content}>
                    <Text style={styles.title}>Home management</Text>
                    <Text style={styles.description}>
                        Expert in residential cleaning services, lawn care and
                        trimming, interior decorating and design.
                    </Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>$20</Text>
                        <View style={styles.ratingContainer}>
                            <Icon name="shield-star-outline" size={24} color="gold" style={{ marginRight: -2 }} />
                            <View style={styles.singleStar}>
                                <Text style={styles.ratingText}>Highly rated</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.availableButton}>
                            <Text style={styles.availableButtonText}>Available</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rating}>
                        <Text style={styles.reviewTitle}>Rating & review</Text>
                        <View style={styles.reviewContainer}>
                            <Icon name="star-half-full" size={24} color="gold" style={{ marginRight: -2 }} />
                            <Text style={styles.ratingCount}>4.8 (4,479 reviews)</Text>
                            <TouchableOpacity style={styles.seeAllButton}>
                                <Text style={styles.seeAllButtonText}>SEE ALL</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.reviews}>
                            {reviews.map((review, index) => (
                                <View key={index}>
                                    <View style={[styles.reviewContainer, index === reviews.length - 1 && styles.lastReviewContainer]}>
                                        <Image
                                            source={require('D:/beatask/src/assets/images/category/booked.png')}
                                            style={styles.userImage}
                                        />
                                        <View style={styles.reviewTextContainer}>
                                            <Text style={styles.userName}>{review.name}</Text>
                                            <Text style={styles.reviewText}>{review.text}</Text>
                                            <View style={styles.reviewLikes}>
                                                <TouchableOpacity onPress={() => toggleLike(`review-${index}`)}>
                                                    <Icon name={likedReviews[`review-${index}`] ? 'cards-heart' : 'cards-heart-outline'} size={24} color={likedReviews[`review-${index}`] ? 'red' : '#12CCB7'} />
                                                </TouchableOpacity>
                                                <Text style={styles.reviewLikesText}>{review.likes}</Text>
                                                <Text style={styles.reviewDate}>{review.date}</Text>
                                            </View>
                                        </View>
                                        <AirbnbRating
                                            count={5}
                                            defaultRating={5}
                                            size={15}
                                            isDisabled
                                            showRating={false}
                                        />
                                    </View>
                                    {index !== reviews.length - 1 && <View style={styles.divider} />}
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.messageButton} onPress={handlemasg}>
                    <Text style={styles.buttonText1}>MESSAGE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookNowButton} onPress={() => setBookVisible(!BookVisible)}>
                    <Text style={styles.buttonText}>BOOK NOW</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={BookVisible}
                transparent={true}
                animationType="fade"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeading}>
                            <Text style={styles.modalHeadingText}>Booking system</Text>
                            <TouchableOpacity onPress={() => setBookVisible(false)}>
                                <Icon name="close" size={24} color="#010A0C" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={handlepayment} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>Instant booking </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlecalenderpayment} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>Recurring booking</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handlecalenderpayment} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>Calendar booking</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const reviews = [
    {
        name: 'Lauralee Quintero',
        text: 'Awesome! this is what I was looking for, I recommend them to everyone ❤️❤️❤️',
        likes: '724',
        date: '20/06/2024'
    },
    {
        name: 'Lauralee Quintero',
        text: 'The workers are very professional and the results are very satisfying! I like it! 👍👍👍',
        likes: '724',
        date: '16/06/2024'
    },
    {
        name: 'Lauralee Quintero',
        text: "This is the first time I've used his services, and the results were amazing!",
        likes: '724',
        date: '30/05/2024'
    }
];

const getStyles = (colorScheme: 'light' | 'dark', screenWidth: number) => {
    const isDarkMode = colorScheme === 'dark';

    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#1c1c1c' : '#fff',
        },
        scrollContent: {
            flexGrow: 1,
        },
        image: {
            width: wp('100%'),
            height: hp('40%'),
            resizeMode: 'cover',
        },
        content: {
            padding:wp('4%'),
        },
        title: {
            fontSize: wp('6.5%'),
            fontWeight: 'bold',
            color: isDarkMode ? '#fff' : '#000',
            marginBottom: hp('2%'),
        },
        description: {
            fontSize: wp('4%'),
            color: isDarkMode ? '#fff' : '#000',
            marginBottom: hp('4%'),
        },
        priceContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: hp('4%'),
        },
        rating: {
            backgroundColor: isDarkMode ? '#021114' : '#f0f0f0',
            padding: wp('3%'),
            borderRadius: wp('4%'),
        },
        price: {
            fontSize: wp('7%'),
            fontWeight: 'bold',
            color: '#12CCB7',
            marginRight: wp('4%'),
        },
        ratingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: wp('12%'),
        },
        singleStar: {
            flexDirection: 'row',
            backgroundColor: '#12CCB7',
            padding: wp('1.5%'),
            borderRadius: wp('4%'),
        },
        ratingText: {
            fontSize: wp('4%'),
            color: '#1c1c1c',
        },
        availableButton: {
            borderWidth: wp('0.5%'),
            borderColor: isDarkMode ? '#fff' : '#000',
            padding: wp('2%'),
            borderRadius: wp('8%'),
            marginLeft: wp('10%'),
        },
        availableButtonText: {
            color: isDarkMode ? '#fff' : '#1c1c1c',
            fontSize: wp('3.5%'),
            textAlign: 'center',
        },
        reviewTitle: {
            fontSize: wp('5.5%'),
            fontWeight: 'bold',
            color: isDarkMode ? '#fff' : '#000',
            marginBottom: hp('2%'),
        },
        reviewContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#021114' : '#f0f0f0',
            borderTopLeftRadius: wp('4%'),
            borderTopRightRadius: wp('4%'),
            paddingHorizontal: wp('4%'),
            paddingVertical: hp('0.5%'),
            marginBottom:wp('2%'),
            justifyContent: 'flex-start',
        },
        lastReviewContainer: {
            backgroundColor: isDarkMode ? '#021114' : '#f0f0f0',
            borderRadius: wp('4%'),
            paddingHorizontal: wp('4%'),
            paddingVertical: wp('4%'),
            marginBottom: wp('4%'),
            justifyContent: 'center',
        },
        ratingCount: {
            fontSize: wp('4%'),
            fontWeight: '500',
            color: isDarkMode ? '#fff' : '#000',
        },
        seeAllButton: {
            marginLeft: wp('18%'),
            padding: wp('4%'),
            borderRadius: wp('4%'),
        },
        seeAllButtonText: {
            color: '#12CCB7',
            fontSize: wp('4%'),
            fontWeight: '500',
        },
        reviews: {
            marginBottom: hp('4%'),
        },
        userImage: {
            width: wp('11%'),
            height: hp('6%'),
            borderRadius: wp('9%'),
            marginRight: wp('2%'),
        },
        reviewTextContainer: {
            flex: 1,
        },
        userName: {
            fontSize: wp('4%'),
            fontWeight: 'bold',
            color: isDarkMode ? '#fff' : '#000',
        },
        reviewText: {
            fontSize: wp('3%'),
            color: isDarkMode ? '#fff' : '#000',
            marginBottom: wp('4%') ,
        },
        reviewLikes: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        reviewLikesText: {
            fontSize: 12,
            color: isDarkMode ? '#fff' : '#000',
            marginRight: wp('4%'),
        },
        reviewDate: {
            fontSize: wp('3.5%'),
            color: isDarkMode ? '#fff' : '#000',
        },
        divider: {
            height: 1,
            backgroundColor: isDarkMode ? '#444' : '#ccc',
            marginVertical: wp('4%'),
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: isDarkMode ? '#021114' : '#f0f0f0',
            padding: wp('4%'),
            borderRadius: 10,
        },
        messageButton: {
            borderWidth: 1,
            padding: wp('3.5%'),
            borderRadius: wp('24%'),
            borderColor: '#12CCB7',
            flex: 1,
            margin: wp('1%'),
        },
        bookNowButton: {
            backgroundColor: '#12CCB7',
            padding: wp('3.5%'),
            borderRadius: wp('24%'),
            flex: 1,
            margin: wp('1%'),
        },
        buttonText: {
            color: '#1c1c1c',
            textAlign: 'center',
            fontSize: wp('4%'),
            fontWeight: '500',
        },
        buttonText1: {
            color: '#12CCB7',
            fontSize: wp('4%'),
            fontWeight: '500',
            textAlign: 'center',
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: '#fff',
            padding: wp('4%'),
            borderTopLeftRadius: wp('8%'),
            borderTopRightRadius: wp('8%'),
            alignItems: 'center',
        },
        modalHeading: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: wp('90%'),
            alignItems: 'center',
        },
        modalHeadingText: {
            fontSize: wp('5%'),
            fontWeight: 'bold',
            marginBottom: wp('4%'),
            color: '#010A0C',
        },
        modalOption: {
            paddingVertical: wp('4%'),
        },
        modalOptionText: {
            fontSize: wp('5%'),
            color: '#010A0C',
            fontWeight:'400'
        },

    });
};

export default HomeScreen;
