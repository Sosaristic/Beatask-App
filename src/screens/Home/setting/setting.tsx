import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'; // Assuming you have FontAwesome icons

const SettingsScreen: React.FC = () => {
    const navigation = useNavigation();

    const colorScheme = useColorScheme();
    const isDarkMode: boolean = colorScheme === 'dark'; // Explicitly declare isDarkMode as boolean

    const styles = getStyles(isDarkMode);

    // Function to handle back button press
    const handleBackButton = () => {
        navigation.goBack();
    };
    const handleOptionPress = (option: string) => {
        console.log(`Pressed option: ${option}`);
    };

    const handleprofilesetup = () => {
        navigation.navigate('ProfileSetup' as never);
    };
    const handleservicelisting = () => {
        navigation.navigate('Service' as never);
    };



    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.option} onPress={handleprofilesetup}>
                <Text style={styles.text}>Profile setup</Text>
                <FontAwesomeIcon
                    name="angle-right"
                    size={24}
                    style={[styles.chevron, styles.rightChevron]}
                    color={isDarkMode ? '#fff' : '#000'}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={handleservicelisting}>
                {/* <FontAwesomeIcon name="cogs" size={24} color={isDarkMode ? '#fff' : '#000'} /> */}
                <Text style={styles.text}>Service listing</Text>
                <FontAwesomeIcon
                    name="angle-right"
                    size={24}
                    style={[styles.chevron, styles.rightChevron]}
                    color={isDarkMode ? '#fff' : '#000'}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Review and Ratings')}>
                {/* <FontAwesomeIcon name="star" size={24} color={isDarkMode ? '#fff' : '#000'} /> */}
                <Text style={styles.text}>Review and Ratings</Text>
                <FontAwesomeIcon
                    name="angle-right"
                    size={24}
                    style={[styles.chevron, styles.rightChevron]}
                    color={isDarkMode ? '#fff' : '#000'}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Payment setting')}>
                {/* <FontAwesomeIcon name="credit-card" size={24} color={isDarkMode ? '#fff' : '#000'} /> */}
                <Text style={styles.text}>Payment setting</Text>
                <FontAwesomeIcon
                    name="angle-right"
                    size={24}
                    style={[styles.chevron, styles.rightChevron]}
                    color={isDarkMode ? '#fff' : '#000'}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Log out')}>
                <Text style={styles.logout}>Log out</Text>
                <FontAwesomeIcon
                    name="angle-right"
                    size={24}
                    style={[styles.chevron, styles.rightChevron]}
                    color="red"
                />
            </TouchableOpacity>
        </View>
    );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? '#000' : '#fff',
        padding: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Align items horizontally with space between
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? '#444' : '#ccc',
    },
    text: {
        color: isDarkMode ? '#fff' : '#000',
        fontSize: 18,
        marginLeft: 10,
    },
    logout: {
        color: 'red',
        fontSize: 18,
    },
    chevron: {
        marginRight: 10,
    },
    darkchevron: {
        color: '#fff',
    },
    rightChevron: {
        marginLeft: 'auto', // Align to the right side of the container
    },
});

export default SettingsScreen;
