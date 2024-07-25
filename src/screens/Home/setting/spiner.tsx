import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const DottedSpinner: React.FC = () => {
    const dotSize = 10;
    const animationDuration = 500;

    // Create animation values
    const animation = new Animated.Value(0);

    // Define animation loop
    Animated.loop(
        Animated.sequence([
            Animated.timing(animation, {
                toValue: 1,
                duration: animationDuration,
                useNativeDriver: true,
            }),
            Animated.timing(animation, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
            }),
        ])
    ).start();

    // Interpolate animation value
    const dotTranslateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 50],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.dot, { transform: [{ translateX: dotTranslateX }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateX: dotTranslateX }] }]} />
            <Animated.View style={[styles.dot, { transform: [{ translateX: dotTranslateX }] }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 60,
        height: 20,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#12CCB7',
    },
});

export default DottedSpinner;
