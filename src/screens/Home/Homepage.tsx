import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TextInput, useColorScheme, TouchableOpacity, Modal, TouchableWithoutFeedback, useWindowDimensions, } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this package
import Icons from 'react-native-vector-icons/Feather' // Make sure to install this package



const HomeScreen = () => {
    const { width, height } = useWindowDimensions();
    const [searchText, setSearchText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [options, setOptions] = useState(['Home Improvement', 'Business', 'IT and Graphic Design']);
    const [filteredOptions, setFilteredOptions] = useState(options);

    const handleOptionRemove = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleClearAll = () => {
        setOptions([]);
    };

    const openSearchModal = () => {
        setShowModal(true);
    };

    const closeSearchModal = () => {
        setShowModal(false);
    };
    const filterOptions = (text: string) => {
        setSearchText(text); // Update search text state
        const filtered = options.filter(option =>
            option.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredOptions(filtered); // Update filtered options state
    };

    const handlesearchPress = (category: string) => {
        switch (category) {
            case 'Home Improvement':
                // Navigate to Home Improvement screen or perform action
                // Example navigation:
                navigation.navigate('Homeimp'as never);
                break;
            case 'Business':
                // Navigate to Business screen or perform action
                // Example navigation:
                navigation.navigate('BusinessScreen'as never);
                break;
            case 'IT and Graphic Design':
                // Navigate to IT and Graphic Design screen or perform action
                // Example navigation:
                navigation.navigate('ITGraphicDesignScreen'as never);
                break;
            default:
                break;
        }
    };
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';

    const styles = getStyles(isDarkMode);
    const navigation = useNavigation();


    const handleCategoryPress = (category: string) => {
        console.log(`Category pressed: ${category}`);
    };
    const [likedProviders, setLikedProviders] = useState<{ [key: string]: boolean }>({
        benjaminWilson: false,
        finaBenjamin: false,
    });

    const handleprofile = () => {
        navigation.navigate('Profile' as never);
    };
    const handleHome = () => {
        navigation.navigate('Home' as never);
    };
    const handleChat = () => {
        navigation.navigate('masglist' as never);
    };
    const handlebooked = () => {
        navigation.navigate('Booked' as never);
    };
     const handleFABPress = () => {
        navigation.navigate('Request' as never);
    };
    const handleCategory = () => {
        navigation.navigate('Homeimp' as never);
    };
    const handleprovider = () => {
        navigation.navigate('Service' as never);
    };

    // Function to toggle like based on provider
    const toggleLike = (provider: string) => {
        setLikedProviders(prevState => ({
            ...prevState,
            [provider]: !prevState[provider as keyof typeof likedProviders], // Ensure 'provider' is a valid key
        }));
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.header}>
                    <Image source={require('D:/beatask/src/assets/images/category/Frame.png')} style={styles.profileImage} />

                    <Text style={styles.greeting}>Good morning Andrew</Text>
                </View>
                <View style={styles.searchContainer}>
                    <Icon name="magnify" size={wp('6%')} color={isDarkMode ? '#CCC' : '#51514C'} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchBar, { color: isDarkMode ? '#FFF' : '#000' }]}
                        placeholder="Search services"
                        placeholderTextColor={isDarkMode ? '#CCC' : '#666'}
                        value={searchText}
                        onChangeText={filterOptions} // Call filterOptions on text change
                        onFocus={openSearchModal}
                    />
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={closeSearchModal}
                >
                    <TouchableWithoutFeedback onPress={closeSearchModal}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>
                    <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#333' : '#FFF', top: hp('20%') }]}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={closeSearchModal}>
                                <Icon name="arrow-left" size={24} color={isDarkMode ? '#FFF' : '#000'} />
                            </TouchableOpacity>
                            <TextInput
                                style={[styles.modalSearchInput, { color: isDarkMode ? '#FFF' : '#000' }]}
                                placeholder="Search services"
                                placeholderTextColor={isDarkMode ? '#CCC' : '#666'}
                                value={searchText}
                                onChangeText={filterOptions} // Call filterOptions on text change
                            />
                        </View>
                        <View style={styles.optionsContainer}>
                            <View style={styles.optionsHeader}>
                                <Text style={[styles.recentText, { color: isDarkMode ? '#FFF' : '#000' }]}>Recent</Text>
                                <TouchableOpacity onPress={handleClearAll}>
                                    <Text style={styles.clearAllText}>CLEAR ALL</Text>
                                </TouchableOpacity>
                            </View>
                            {filteredOptions.map((option, index) => (
                                <TouchableOpacity key={index} onPress={() => handlesearchPress(option)}>
                                    <View style={styles.optionItem}>
                                        <Text style={[styles.optionText, { color: isDarkMode ? '#FFF' : '#000' }]}>{option}</Text>
                                        <TouchableOpacity onPress={() => handleOptionRemove(index)}>
                                            <Icon name="close" size={20} color={isDarkMode ? '#FFF' : '#000'} />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Modal>
                <Swiper style={styles.swiper} showsButtons={false} autoplay={true}>
                    <View style={styles.slide}>
                        <Text style={styles.slideText}>Slide 1</Text>
                    </View>
                    <View style={styles.slide}>
                        <Text style={styles.slideText}>Slide 2</Text>
                    </View>
                    <View style={styles.slide}>
                        <Text style={styles.slideText}>Slide 3</Text>
                    </View>
                </Swiper>
                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryHeader1}>Beatask service categories</Text>
                    <View style={styles.categories}>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <View style={styles.backgroundImage}>
                                    <Image source={require('D:/beatask/src/assets/images/category/Home1.jpg')} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                                    <Text style={styles.categoryText}>Home Improvement</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/BUSINESS.jpg')} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                                <Text style={styles.categoryText}>Business</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/It.jpg')} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                                <Text style={styles.categoryText}>IT and Graphic Design</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/WELLNESS.jpg')} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                                <Text style={styles.categoryText}>Wellness</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/PETS.jpg')} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                                <Text style={styles.categoryText}>Pets</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/Events.jpg')} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                                <Text style={styles.categoryText}>Events</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/Troubleshooting.jpg')} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                                <Text style={styles.categoryText}>Troubleshooting and Repair</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/Lessons.jpg')} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                                <Text style={styles.categoryText}>Lessons</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category}onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/Personal.jpg')} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                                <Text style={styles.categoryText}>Personal</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/Legal.jpg')} style={{ width: '100%', height: '100%', position: 'absolute' }} />
                                <Text style={styles.categoryText}>Legal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Text style={styles.featuredHeader}>Featured service providers</Text>
                <Swiper style={styles.providerSwiper} showsButtons={false} autoplay={false} showsPagination={false}>
                    <View style={styles.providerWrapper}>
                        <TouchableOpacity style={styles.providerCard} onPress={handleprovider}>
                            <TouchableOpacity style={styles.heartIcon} onPress={() => toggleLike('benjaminWilson')}>
                                <Icon name={likedProviders.benjaminWilson ? 'cards-heart' : 'cards-heart-outline'} size={wp('7%')} color={likedProviders.benjaminWilson ? 'red' : '#12CCB7'} />
                            </TouchableOpacity>
                            <View style={styles.providerImageWrapper}>
                                <Image source={require('D:/beatask/src/assets/images/category/Image1.png')} style={styles.fullImage} />
                            </View>
                            <Text style={styles.providerName}>Benjamin Wilson</Text>
                            <Text style={styles.providerDescription}>Creative event planner with{'\n'} six (6) years of expertise.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.providerCard} onPress={handleprovider}>
                            <TouchableOpacity style={styles.heartIcon} onPress={() => toggleLike('finaBenjamin')}>
                                <Icon name={likedProviders.finaBenjamin ? 'cards-heart' : 'cards-heart-outline'} size={wp('7%')} color={likedProviders.finaBenjamin ? 'red' : '#12CCB7'} />
                            </TouchableOpacity>
                            <View style={styles.providerImageWrapper}>
                                <Image source={require('D:/beatask/src/assets/images/category/Image1.png')} style={styles.fullImage} />
                            </View>
                            <Text style={styles.providerName}>Fina Benjamin</Text>
                            <Text style={styles.providerDescription}>Creative Graphic Designer with{'\n'} six (6) years of expertise.</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.providerWrapper}>
                        <TouchableOpacity style={styles.providerCard} onPress={handleprovider}>
                            <TouchableOpacity style={styles.heartIcon} onPress={() => toggleLike('benjaminWilson')}>
                                <Icon name={likedProviders.benjaminWilson ? 'cards-heart' : 'cards-heart-outline'} size={wp('7%')} color={likedProviders.benjaminWilson ? 'red' : '#12CCB7'} />
                            </TouchableOpacity>
                            <View style={styles.providerImageWrapper}>
                                <Image source={require('D:/beatask/src/assets/images/category/Image1.png')} style={styles.fullImage} />
                            </View>
                            <Text style={styles.providerName}>Benjamin Wilson</Text>
                            <Text style={styles.providerDescription}>Creative event planner with{'\n'} six (6) years of expertise.</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.providerCard} onPress={handleprovider}>
                            <TouchableOpacity style={styles.heartIcon} onPress={() => toggleLike('finaBenjamin')}>
                                <Icon name={likedProviders.finaBenjamin ? 'cards-heart' : 'cards-heart-outline'} size={wp('7%')} color={likedProviders.finaBenjamin ? 'red' : '#12CCB7'} />
                            </TouchableOpacity>
                            <View style={styles.providerImageWrapper}>
                                <Image source={require('D:/beatask/src/assets/images/category/Image1.png')} style={styles.fullImage} />
                            </View>
                            <Text style={styles.providerName}>Fina Benjamin</Text>
                            <Text style={styles.providerDescription}>Creative Graphic Designer with{'\n'} six (6) years of expertise.</Text>
                        </TouchableOpacity>
                    </View>
                </Swiper>
                <Text style={styles.featuredHeader}>Most booked services</Text>
                <Swiper style={styles.providerSwiper} showsButtons={false} autoplay={true} showsPagination={false} loop={true}>
                    <View style={styles.providerWrapper}>
                        <TouchableOpacity style={styles.providerCard1} >
                            <View style={styles.providerImageWrapper1}>
                                <Image source={require('D:/beatask/src/assets/images/category/Legal.jpg')} style={styles.fullImage1} />
                            </View>
                            <Text style={styles.providerName1}>Intellectual property attorney</Text>
                            <Text style={styles.providerDescription1}>⭐ 4.8 (3k) <Text style={styles.chooseText}> $100 </Text></Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.providerCard1} onPress={handleprovider}>
                            <View style={styles.providerImageWrapper1}>
                                <Image source={require('D:/beatask/src/assets/images/category/Personal.jpg')} style={styles.fullImage1} />
                            </View>
                            <Text style={styles.providerName1}>Personal development coaching</Text>
                            <Text style={styles.providerDescription1}>⭐ 4.8 (3k) <Text style={styles.chooseText}> $100 </Text></Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.providerWrapper}>
                        <TouchableOpacity style={styles.providerCard1} onPress={handleprovider}>

                            <View style={styles.providerImageWrapper1}>
                                <Image source={require('D:/beatask/src/assets/images/category/It.jpg')} style={styles.fullImage1} />
                            </View>
                            <Text style={styles.providerName1}>Mathematics Tutoring</Text>
                            <Text style={styles.providerDescription1}>⭐ 4.8 (3k) <Text style={styles.chooseText}> $100 </Text></Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.providerCard1} onPress={handleprovider}>
                            <View style={styles.providerImageWrapper1}>
                                <Image source={require('D:/beatask/src/assets/images/category/Events.jpg')} style={styles.fullImage1} />
                            </View>
                            <Text style={styles.providerName1}>Wedding planning</Text>
                            <Text style={styles.providerDescription1}>⭐ 4.8 (3k) <Text style={styles.chooseText}> $100 </Text></Text>

                        </TouchableOpacity>
                    </View>
                </Swiper>
                <Swiper style={styles.providerSwiper} showsButtons={false} autoplay={true} showsPagination={false} loop={true} autoplayTimeout={6}>

                    <View style={styles.providerWrapper}>
                        <View style={styles.slide}>
                            <View style={styles.providerImageWrapper1}>
                            <Image source={require('D:/beatask/src/assets/images/category/advert.jpg')} style={styles.slideimage} />
                            </View>
                        </View>
                        <View style={styles.slide}>
                            <View style={styles.providerImageWrapper1}>
                            <Image source={require('D:/beatask/src/assets/images/category/advert.jpg')} style={styles.slideimage} />

                            </View>
                        </View>
                    </View>
                    <View style={styles.providerWrapper}>
                        <View style={styles.slide}>
                            <View style={styles.providerImageWrapper1}>
                            <Image source={require('D:/beatask/src/assets/images/category/advert.jpg')} style={styles.slideimage} />

                            </View>
                        </View>
                        <View style={[styles.slide]}>
                            <View style={styles.providerImageWrapper1}>
                            <Image source={require('D:/beatask/src/assets/images/category/advert.jpg')} style={styles.slideimage} />

                            </View>
                        </View>
                    </View>
                </Swiper>

                <Text style={styles.categoryHeader}>Featured services for women</Text>
                <View style={styles.categoryContainer}>
                    <View style={styles.categories}>
                        <View style={styles.categoryWrapper} >
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/Troubleshooting.jpg')} style={styles.image} />
                                <Text style={styles.categoryText}>Fitness coaching</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper} >
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/Troubleshooting.jpg')} style={styles.image} />
                                <Text style={styles.categoryText}>Yoga session</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/Troubleshooting.jpg')} style={styles.image} />
                                <Text style={styles.categoryText}>Hair styling</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/Troubleshooting.jpg')} style={styles.image} />
                                <Text style={styles.categoryText}>Wedding cake</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category}onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/Troubleshooting.jpg')} style={styles.image} />
                                <Text style={styles.categoryText}>Marriage therapy</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoryWrapper}>
                            <TouchableOpacity style={styles.category} onPress={handleCategory}>
                                <Image source={require('D:/beatask/src/assets/images/category/Troubleshooting.jpg')} style={styles.image} />
                                <Text style={styles.categoryText}>Event makeup</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Text style={styles.categoryHeader}>Half price deals</Text>
                <Swiper style={styles.providerSwiper} showsButtons={false} autoplay={true} showsPagination={false} loop={true}>
                    <View style={styles.providerWrapper}>
                        <TouchableOpacity style={styles.providerCard1} onPress={handleprovider}>
                            <TouchableOpacity
                                style={[
                                    styles.heartIcon,

                                ]}
                                onPress={() => toggleLike('benjaminWilson')}
                            >
                                <Text style={styles.text}>
                                    {likedProviders.benjaminWilson ? '-12%' : '-12%'}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.providerImageWrapper1}>
                                <Image source={require('D:/beatask/src/assets/images/category/Legal.jpg')} style={styles.fullImage1} />
                            </View>
                            <Text style={styles.providerName1}>Intellectual property attorney</Text>
                            <Text style={styles.providerDescription1}>⭐ 4.8 (3k) <Text style={styles.chooseText}></Text></Text>
                            <Text style={styles.providerDescription1}><Text style={styles.chooseText}> $88 </Text><Text style={styles.providerDescription2}>100$</Text></Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.providerCard1} onPress={handleprovider}>
                            <TouchableOpacity
                                style={[
                                    styles.heartIcon,

                                ]}
                                onPress={() => toggleLike('benjaminWilson')}
                            >
                                <Text style={styles.text}>
                                    {likedProviders.benjaminWilson ? '-12%' : '-12%'}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.providerImageWrapper1}>
                                <Image source={require('D:/beatask/src/assets/images/category/Personal.jpg')} style={styles.fullImage1} />
                            </View>
                            <Text style={styles.providerName1}>Personal development coaching</Text>
                            <Text style={styles.providerDescription1}>⭐ 4.8 (3k) <Text style={styles.chooseText}></Text></Text>
                            <Text style={styles.providerDescription1}><Text style={styles.chooseText}> $88 </Text><Text style={styles.providerDescription2}>100$</Text></Text>



                        </TouchableOpacity>
                    </View>
                    <View style={styles.providerWrapper}>
                        <TouchableOpacity style={styles.providerCard1} onPress={handleprovider}>
                            <TouchableOpacity
                                style={[
                                    styles.heartIcon,

                                ]}
                                onPress={() => toggleLike('benjaminWilson')}
                            >
                                <Text style={styles.text}>
                                    {likedProviders.benjaminWilson ? '-12%' : '-12%'}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.providerImageWrapper1}>
                                <Image source={require('D:/beatask/src/assets/images/category/It.jpg')} style={styles.fullImage1} />
                            </View>
                            <Text style={styles.providerName1}>Mathematics Tutoring</Text>
                            <Text style={styles.providerDescription1}>⭐ 4.8 (3k) <Text style={styles.chooseText}> </Text></Text>
                            <Text style={styles.providerDescription1}><Text style={styles.chooseText}> $88 </Text><Text style={styles.providerDescription2}>100$</Text></Text>

                        </TouchableOpacity>
                        <TouchableOpacity style={styles.providerCard1} onPress={handleprovider}>
                            <TouchableOpacity
                                style={[
                                    styles.heartIcon,

                                ]}
                                onPress={() => toggleLike('benjaminWilson')}
                            >
                                <Text style={styles.text}>
                                    {likedProviders.benjaminWilson ? '-12%' : '-12%'}
                                </Text>
                            </TouchableOpacity>
                            <View style={styles.providerImageWrapper1}>
                                <Image source={require('D:/beatask/src/assets/images/category/Events.jpg')} style={styles.fullImage1} />
                            </View>
                            <Text style={styles.providerName1}>Wedding planning</Text>
                            <Text style={styles.providerDescription1}>⭐ 4.8 (3k) <Text style={styles.chooseText}> </Text></Text>
                            <Text style={styles.providerDescription1}><Text style={styles.chooseText}> $88 </Text><Text style={styles.providerDescription2}>100$</Text></Text>

                        </TouchableOpacity>
                    </View>
                </Swiper>
            </ScrollView>
            <TouchableOpacity style={styles.fab} onPress={handleFABPress}>
        <Icon name="briefcase-variant-outline" size={26} color="#fff" />
            </TouchableOpacity>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerItem} onPress={handleHome}>
                    <Icon name="home-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
                    <Text style={styles.footerText}>HOME</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={handlebooked}>
                    <Icon name="calendar-check-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
                    <Text style={styles.footerText}>BOOKED</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={handleChat}>
                    <Icon name="chat-processing-outline" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
                    <Text style={styles.footerText}>MESSAGE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerItem} onPress={handleprofile}>
                    <Icons name="user" size={wp('7%')} color={isDarkMode ? '#FFF' : '#000'} />
                    <Text style={styles.footerText}>PROFILE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    },
    scrollContainer: {
        flex: 1,
    },

    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('3%'),
    },
    profileImage: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
    },
    greeting: {
        marginLeft: wp('2%'),
        fontSize: wp('4%'),
        color: isDarkMode ? '#FFF' : '#000',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#333' : '#FFF',
        borderRadius: wp('2%'),
        borderWidth: 1,
        borderColor: '#51514C',
        margin: wp('3%'),
        paddingHorizontal: wp('2%'),
    },
    searchIcon: {
        marginRight: wp('2%'),

    },
    searchBar: {
        flex: 1,
        color: isDarkMode ? '#FFF' : '#51514C',
    },
    swiper: {
        height: hp('20%'),
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
        marginHorizontal: wp('4%'),
        borderRadius: 5,
        marginBottom:-300,
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
        marginHorizontal: wp('1%'),
        paddingTop: wp('18%'),

    },
    slideText: {
        color: isDarkMode ? '#FFF' : '#000',

    },
    categoryContainer: {
        padding: wp('3%'),
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: wp('2%'), // Adding borderRadius for category items
        overflow: 'hidden', // Ensure contents don't overflow the container
    },
    categoryText: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // backgroundColor: isDarkMode ? '#fff' : '#333',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background for text
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('1%'),
        color: '#12CCB7', // Text color
        fontSize: wp('3.5%'), // Adjust font size as needed
        textAlign: 'center',
    },
    categoryWrapper: {
        width: '48%',
        aspectRatio: 1, // Maintain aspect ratio for each category item
        marginVertical: hp('1%'),
        borderRadius: wp('2%'), // Rounded corners for category items
        overflow: 'hidden', // Ensure contents don't overflow the container
    },
    category: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    categoryHeader: {
        fontSize: wp('4%'),
        color: isDarkMode ? '#FFF' : '#000',
        // backgroundColor: "#12CCB7",
        height: hp('6%'),
        borderRadius: wp('1%'),
        padding: wp('3%'),
        marginHorizontal: wp('3%'),
        marginBottom: wp('3%'),
        marginTop: wp('2%'),
        // alignSelf: 'center',

    },
    categoryHeader1: {
        fontSize: wp('4%'),
        color: isDarkMode ? '#FFF' : '#000',
        // backgroundColor: "#12CCB7",
        height: hp('6%'),
        borderRadius: wp('1%'),
        padding: wp('3%'),
        // marginHorizontal: wp('3%'),
        marginBottom: wp('3%'),
        marginTop: wp('2%'),
        // alignSelf: 'center',

    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    featuredHeader: {
        fontSize: wp('4%'),
        color: isDarkMode ? '#FFF' : '#000',
        // backgroundColor: "#12CCB7",
        height: hp('6%'),
        borderRadius: wp('1%'),
        padding: wp('3%'),
        marginHorizontal: wp('3%'),
        marginBottom: wp('3%'),
        marginTop: wp('2%'),
        // alignSelf: 'center',
    },
    providerSwiper: {
        height: hp('49%'),
        marginBottom: wp('-30%'),
        // marginTop: wp('-8%'),
    },
    providerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp('3%'),
    },
    providerCard: {
        width: '50%',  // Each card should take up 50% of the slide width
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#fff' : '#FFF',
        borderRadius: wp('2%'),
        padding: wp('3%'),
        borderWidth: 1,
        borderColor: isDarkMode ? '#444' : '#DDD',
        paddingHorizontal: wp('3%'),
        // marginHorizontal: wp('3%'),
        marginRight: wp('3%'),

    },
    heartIcon: {
        position: 'absolute',
        top: wp('3%'),
        right: wp('3%'),
        zIndex: 1,  // Ensure the heart icon is above other content
    },
    providerImageWrapper: {
        width: '100%',
        height: wp('40%'),
        borderRadius: wp('2%'),
        overflow: 'hidden',
        marginBottom: wp('2%'),
    },

    providerCard1: {
        width: '50%',  // Each card should take up 50% of the slide width
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: isDarkMode ? '#fff' : '#FFF',
        borderRadius: wp('2%'),
        padding: wp('3%'),
        // borderWidth: 1,
        borderColor: isDarkMode ? '#444' : '#DDD',
        paddingHorizontal: wp('3%'),
        // marginHorizontal: wp('3%'),
        marginRight: wp('3%'),

    },
    providerImageWrapper1: {
        width: '100%',
        height: wp('40%'),
        // borderRadius: wp('12%'),
        overflow: 'hidden',
        marginBottom: wp('2%'),
    },
    chooseText: {
        color: '#12CCB7',
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    fullImage1: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    providerName: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        color: isDarkMode ? '#021114' : '#021114',
        marginBottom: wp('1%'),
    },
    providerDescription: {
        fontSize: wp('3%'),
        color: isDarkMode ? '#021114' : '#021114',
        textAlign: 'center',
    },

    providerName1: {
        fontSize: wp('4%'),
        fontWeight: '400',
        color: isDarkMode ? '#fff' : '#021114',
        marginBottom: wp('1%'),
        textAlign: 'center',

    },
    providerDescription1: {
        fontSize: wp('4%'),
        color: isDarkMode ? '#fff' : '#021114',
        textAlign: 'center',

    },
    providerDescription2: {
        fontSize: wp('4%'),
        color: isDarkMode ? '#fff' : '#021114',
        textAlign: 'center',
        textDecorationLine: 'line-through',
    },
    likeButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#12CCB7', // Default color
    },
    liked: {
        backgroundColor: 'red', // Color when liked
    },
    text: {
        color: 'darkgreen', // Text color
        borderWidth: 1,
        borderColor: "darkgreen",
        backgroundColor: 'lightgreen',
        padding: wp('1%'),
        marginTop: wp('6.%'),
        borderBottomLeftRadius: wp('5%'),
    },
    slideimage:{
        width: wp('40%'),
        height: hp('60%'),
        resizeMode: 'repeat',
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#021114' : '#FFF',
        paddingVertical: hp('1%'),
    },
    footerItem: {
        alignItems: 'center',
    },
    footerText: {
        fontSize: wp('3%'),
        color: isDarkMode ? '#FFF' : '#000',
    },

    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        
    },
    modalContent: {
        marginHorizontal: wp('5%'),
        borderRadius: wp('2%'),
        padding: wp('5%'),
        marginBottom:wp('51%'),
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    modalSearchInput: {
        flex: 1,
        height: hp('6%'),
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: wp('2%'),
        paddingHorizontal: wp('3%'),
    },
    optionsContainer: {
        flexDirection: 'column',
    },
    optionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('1%'),
    },
    recentText: {
        fontWeight: 'bold',
        fontSize: 25,
    },
    clearAllText: {
        color: '#12CCB7',
        fontWeight:'700'
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('1%'),
        height:wp('12%')
    },
    optionText: {
        fontSize: wp('5%'), // Increased font size
    },
    fab: {
        position: 'absolute',
        right: wp('5%'), // 5% from the right
        bottom: hp('8%'), // 5% from the bottom
        width: wp('14%'), // 14% width
        height: wp('14%'), // 14% height
        borderRadius: wp('7%'), // 50% of width/height for perfect circle
        backgroundColor: '#00C9A7',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
      },
});

export default HomeScreen;
