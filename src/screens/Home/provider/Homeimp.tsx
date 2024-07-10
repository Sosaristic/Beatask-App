import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColorScheme } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook if using React Navigation

interface Item {
    id: string;
    name: string;
    description: string;
    image: any;
    rating: number;
    reviews: number;
    price: number;
    highlyRated?: boolean;
}

const data: Item[] = [
    {
        id: '1',
        name: 'Benjamin Wilson',
        description: 'Expert in residential cleaning services, lawn care and trimming.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.5,
        reviews: 24,
        price: 20,
    },
    {
        id: '2',
        name: 'Maryland Winkles',
        description: 'Expert in residential cleaning services, lawn care and trimming.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 5.0,
        reviews: 32,
        price: 20,
        highlyRated: true,
    },
    {
        id: '3',
        name: 'John Doe',
        description: 'Expert in gardening and landscaping.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.8,
        reviews: 45,
        price: 25,
    },
    {
        id: '4',
        name: 'Jane Smith',
        description: 'Expert in interior design and home decor.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.2,
        reviews: 50,
        price: 30,
    },
    {
        id: '5',
        name: 'Emily Johnson',
        description: 'Expert in pet grooming and care.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.9,
        reviews: 20,
        price: 15,
    },
    {
        id: '6',
        name: 'Michael Brown',
        description: 'Expert in electrical repairs and installations.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.6,
        reviews: 28,
        price: 40,
    },
    {
        id: '7',
        name: 'Sarah Davis',
        description: 'Expert in plumbing and pipe fitting.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.3,
        reviews: 22,
        price: 35,
    },
    {
        id: '8',
        name: 'David Martinez',
        description: 'Expert in home renovation and construction.',
        image: require('D:/beatask/src/assets/images/category/booked.png'),
        rating: 4.7,
        reviews: 38,
        price: 50,
    },
];

const HomeScreen: React.FC = () => {
    const [sortVisible, setSortVisible] = useState(false);
    const [sortValue, setSortValue] = useState('rating');
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const navigation = useNavigation(); // Initialize useNavigation hook

    const handleSortChange = (value: string) => {
        setSortValue(value);
        setSortVisible(false);
        // Add sorting logic here
    };

    const renderItem = ({ item }: { item: Item }) => (
        <View style={[styles.card, isDarkMode && styles.cardDark]}>
            <Image source={item.image} style={styles.image} />
            <Text style={[styles.name, isDarkMode && styles.textDark]}>{item.name}</Text>
            <Text style={[styles.description, isDarkMode && styles.textDark]}>{item.description}</Text>
            <View style={styles.ratingContainer}>
                <Text style={[styles.rating, isDarkMode && styles.textDark]}>{item.rating}</Text>
                <Icon name="star" size={20} color="#ffd700" />
                <Text style={[styles.reviews, isDarkMode && styles.textDark]}>({item.reviews})</Text>
            </View>
            <Text style={[styles.price, isDarkMode && styles.textDark1]}>${item.price}</Text>
            <TouchableOpacity style={[styles.button, isDarkMode && styles.buttonDark]} onPress={handleView}>
                <Text style={styles.buttonText}  >VIEW</Text>
            </TouchableOpacity>
        </View>
    );

    const handleItemPress = (item: Item) => {
        // Navigate or handle item press action
    };
    const handleView = () => {
        navigation.navigate('Service'as never);
    };

    const handleFilterPress = () => {
        navigation.navigate('Filter'as never);
    };

    return (
        <View style={[styles.container, isDarkMode && styles.containerDark]}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.list}
            />
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => setSortVisible(!sortVisible)}
                >
                    <Icon name="sort" size={24} color="#fff" />
                    <Text style={styles.footerButtonText}>SORT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={handleFilterPress}>
                    <Icon name="filter-variant" size={24} color="#fff" />
                    <Text style={styles.footerButtonText}>FILTERS</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={sortVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeading}>
                            <Text style={styles.modalHeadingText}>Sort by</Text>
                            <TouchableOpacity onPress={() => setSortVisible(false)}>
                                <Icon name="close" size={24} color="#010A0C" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => handleSortChange('newest')} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>Newest listing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSortChange('mostJobs')} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>Most jobs completed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSortChange('bestReviews')} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>Best reviews</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSortChange('highToLowPrice')} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>High to low price</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleSortChange('lowToHighPrice')} style={styles.modalOption}>
                            <Text style={styles.modalOptionText}>Low to high price</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
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
        flex: 1,
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
        width: wp('40%'),
        height: wp('40%'),
        borderRadius: 10,
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
