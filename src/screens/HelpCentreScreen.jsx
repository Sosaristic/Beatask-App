import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import {CustomButton} from '../components';
import {customTheme} from '../custom_theme/customTheme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HelpCentreScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={{paddingBottom: insets.bottom + 20}}>
      {/* Welcome Section */}
      <Text style={styles.title}>Help & Support</Text>
      <Text style={styles.text}>
        Welcome to <Text style={styles.boldText}>BeaTask</Text> – your go-to
        platform for finding and booking trusted services across the USA.
        Whether you need help with home improvement, business services, or
        anything in between, we're here to assist you every step of the way!
      </Text>

      <Text style={styles.title}>How can we help you today?</Text>

      {/* Browse Our Services Section */}
      <Text style={styles.title}>Browse Our Services</Text>
      <Text style={styles.text}>
        Find the service you need from a variety of categories including home
        improvement, business services, and more.
      </Text>
      <Text style={styles.text}>
        Use the search bar or category filters to find exactly what you're
        looking for.
      </Text>

      {/* FAQs Section */}
      <Text style={styles.title}>Frequently Asked Questions (FAQs)</Text>

      <View style={styles.section}>
        <Text style={styles.boldText}>How do I book a service?</Text>
        <Text style={styles.text}>
          Visit the service listing and click the "Book Now" button. Follow the
          prompts to schedule your service.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.boldText}>Is payment secure?</Text>
        <Text style={styles.text}>
          We use industry-standard payment processors to ensure your payment
          details are safe.
        </Text>
      </View>

      {/* Contact Section */}
      <Text style={styles.title}>Contact Our Support Team</Text>
      <Text style={styles.text}>
        Need direct assistance? Feel free to reach out to us for help with your
        bookings, payment issues, or any other questions.
      </Text>
      <Text style={styles.text}>
        <Text style={styles.boldText}>Email: </Text>
        contact@beatask.com
      </Text>
      <Text style={styles.text}>We'll respond within 24 hours.</Text>

      {/* Footer */}
      <Text style={styles.title}>We're Here to Help!</Text>
      <Text style={styles.text}>
        No matter the question or issue, our team is dedicated to providing you
        with the best experience. Don’t hesitate to reach out to us via email at{' '}
        <Text style={{color: customTheme.primaryColor}}>
          contact@beatask.com
        </Text>{' '}
        for immediate assistance.
      </Text>

      {/* Button using TouchableOpacity */}
    </ScrollView>
  );
};

export default HelpCentreScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 10,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
