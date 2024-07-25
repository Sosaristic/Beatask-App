// src/screens/AgreementScreen.tsx
import React from 'react';
import { StyleSheet, Text, View, Button, Alert, SafeAreaView, useColorScheme, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


const AgreementScreen = () => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const isDarkMode = colorScheme === 'dark';

    const handleAgreePress = () => {
        Alert.alert('Agreement', 'You have agreed to the terms.');
    };

    const handleNext = () => {
        // Navigate to the next screen
        navigation.navigate('Login'as never);
      };

    return (
        <SafeAreaView style={isDarkMode ? darkStyles.container : lightStyles.container}>
            <ScrollView contentContainerStyle={isDarkMode ? darkStyles.scrollContainer : lightStyles.scrollContainer}>
                <View style={isDarkMode ? darkStyles.content : lightStyles.content}>
                    <Text style={isDarkMode ? darkStyles.text1 : lightStyles.text1}>This Independent Contractor Agreement ("Agreement") is made effective as of today, by and between BEATASK LLC app users, facilitated by BEATASK LLC ("Recipient"), of 1942 Broadway St. STE 314C, Boulder, Colorado 80302, and Independent contractors registered on the BEATASK platform ("Contractor").</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>1. Description of Services.</Text>
                        Beginning today, the Contractor will provide the following services (collectively, "Services"):Please read them carefully before agreeing.
                    </Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>Services available on the BEATASK platform include, but are not limited to:</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Home Improvement: Residential Cleaning Services, Lawn Care and Trimming, Interior Decorating and Design, Home Repair and Handyman Services, Roofing Repair and Maintenance, General Construction Services, Environmental and Air Quality Testing, Appliance Setup and Installation, Appliance Maintenance and Repair.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Wellness: Fitness Coaching, Personal Development Coaching, Yoga Sessions, Pilates Sessions, Nutritional Guidance, Family Therapy, Health and Wellness, Marriage and Relationship Therapy, Rehabilitation Therapy, Mental Health Therapy and Counseling.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Pets: Dog Walking, Pet Sitting, Grooming, Dog Daycare, Dog Training.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Business: Accounting, Corporate Law Attorney, Business Tax Preparation, Business Consulting, Criminal Defense Attorney, Divorce Attorney, Intellectual Property Attorney, Marketing, Personal Financial Planning, Real Estate Attorney.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  IT and Graphic Design: Animation, Graphic Design, Logo Design, Presentation Design, Software Development, Social Media Marketing, Web Design, Writing and Editing Services.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Events: DJ, Wedding Planner, Wedding and Event Catering, Wedding and Event Makeup, Photo Booth Rental, Bartending, Event Planning, Event Security & Bouncer Services, Music Entertainment, Personal Chef, Wedding Cakes, Wedding Coordination, Wedding Florist, Wedding Planning, Wedding and Event Hair Styling, Wedding and Event Photography, Wedding and Event Venue Rental, Wedding and Event Videography</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Lessons: Singing, Piano, Personal Self-Defense Training, Literacy Tutoring, Mathematics Tutoring, Individual Yoga Sessions, Acting Coaching, Guitar Instruction, Science Tutoring, Language Lessons, Test Preparation Services.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Legal: Business Law, Contract Negotiation, Legal Interpretation, Disability Rights, Estate Planning, Immigration, Intellectual Property, Global Law, Workplace Rights, Legal Documentation, Conflict Resolution, Injury Claims, Legal Process, Property Law, Tax Regulation,</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>Furthermore, the Contractor has the right of control over how the Contractor will perform the Services. The Recipient does not have this right of control over how the Contractor will perform the Services.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>The Contractor will also provide any equipment or materials necessary to provide said Services and the Recipient is exempt from having to furnish such equipment or materials.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>2. Payment for Services.</Text>
                        The Recipient will pay compensation to the Contractor for the Services. Payments will be made as follows:
                    </Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Text style={isDarkMode ? darkStyles.text : lightStyles.text}>The Contractor will also provide any equipment or materials necessary to provide said Services and the Recipient is exempt from having to furnish such equipment or materials.</Text></Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Service providers will quote a price for their services to the consumers.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Upon the consumers acceptance of the quote, the service provider will perform the service as requested.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Once the service is completed, the consumer will mark the project as completed on the BEATASK platform.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  After the project is marked as completed, the service provider will be paid the agreed-upon amount.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Text style={isDarkMode ? darkStyles.text : lightStyles.text}>There is no fixed amount or single lump-sum payment. Payments are made based on the specific services completed and the payment amounts agreed upon between the service providers and consumers</Text></Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Text style={isDarkMode ? darkStyles.text : lightStyles.text}>No other fees and/or expenses will be paid to the Contractor unless such fees and/or expenses have been approved in advance by the appropriate executive on behalf of the Recipient in writing. The Contractor shall be solely responsible for any and all taxes, Social Security contributions or payments, disability insurance, unemployment taxes, and other pay-roll type taxes applicable to such compensation. The Contractor has the right of control over the method of payment for Services.</Text></Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>3. Term/Termination.</Text>
                        Termination of this agreement will occur as follows:Termination:
                    </Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Duration: This Agreement remains in effect as long as the Service Provider continues to offer services on the BEATASK platform and complies with the terms of this Agreement.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Termination by the Company: BEATASK LLC may terminate this Agreement at any time, with or without cause, by providing written notice to the Service Provider.</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Termination by the Service Provider: The Service Provider may terminate this Agreement at any time by providing written notice to BEATASK LLC</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  terminate this Agreement immediately in the event of a material breach by the other party</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  TEffect of Termination: Upon termination, the Service Provider will cease offering services through the BEATASK platform. Outstanding payments for completed services will be processed according to the agreed terms</Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Icon name="circle" size={hp('1.2%')} style={isDarkMode ? darkStyles.bulletIcon : lightStyles.bulletIcon} />  Survival: Provisions relating to confidentiality, intellectual property, and indemnification will survive the termination of this Agreement.</Text>


                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Text style={isDarkMode ? darkStyles.text : lightStyles.text}>Furthermore, the Contractor has the ability to terminate this Agreement "at will."</Text></Text>


                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Text style={isDarkMode ? darkStyles.text : lightStyles.text}>A regular, ongoing relationship of indefinite term is not contemplated. The Recipient has no right to assign Services to the Contractor other than as specifically contemplated by this Agreement. However, the parties may mutually agree that the Contractor shall perform other services for the Recipient, pursuant to the terms of this Agreement.</Text></Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>4. Relationship of Parties.</Text>
                        It is understood by the parties that the Contractor is an independent contractor with respect to the Recipient and not an employee of the Recipient. The Recipient will not provide fringe benefits, including health insurance benefits, paid vacation, or any other employee benefit, for the benefit of the Contractor.
                    </Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Text style={isDarkMode ? darkStyles.text : lightStyles.text}>It is contemplated that the relationship between the Contractor and the Recipient shall be a non-exclusive one. The Contractor also performs services for other organizations and/or individuals. The Recipient has no right to further inquire into the Contractor's other activities.</Text></Text>

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>5. Recipient's Control.</Text>
                        The Recipient has no right or power to control or otherwise interfere with the Contractor's mode of effecting performance under this Agreement. The Recipient's only concern is the result of the Contractor's work, and not the means of accomplishing it. Except in extraordinary circumstances and when necessary, the Contractor shall perform the Services without direct supervision by the Recipient.
                    </Text> 

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>6. Professional Capacity.</Text>
                        The Recipient has no right or power to control or otherwise interfere with the Contractor's mode of effecting performance under this Agreement. The Recipient's only concern is the result of the Contractor's work, and not the means of accomplishing it. Except in extraordinary circumstances and when necessary, the Contractor shall perform the Services without direct supervision by the Recipient.
                    </Text> 

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>
                        7. Personal Services Not Required.</Text>
                        The Contractor is not required to render the Services personally and may employ others to perform the Services on behalf of the Recipient without the Recipient's knowledge or consent. If the Contractor has assistants, it is the Contractor's responsibility to hire them and to provide materials for them.
                    </Text> 

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>8. No Location On the Premises.</Text>
                        The Contractor has no desk or other equipment either located at or furnished by the Recipient. Except to the extent that the Contractor works in a territory as defined by the Recipient, their Services are not integrated into the mainstream of the Recipient's business.
                    </Text> 

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>9. No Set Work Hours.</Text>
                        The Contractor has no set hours of work. There is no requirement that the Contractor work full time or otherwise account for work hours.
                    </Text> 

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>10. Expenses Paid By Contractor.</Text>
                        The Contractor's business and travel expenses are to be paid by the Contractor and not by the Recipient.
                    </Text> 


                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>11. Confidentiality.</Text>
                        The Contractor may have had access to proprietary, private and/or otherwise confidential information ("Confidential Information") of the Recipient. Confidential Information shall mean all non-public information that constitutes, relates, or refers to the operation of the business of the Recipient, including without limitation, all financial, investment, operational, personnel, sales, marketing, managerial, and statistical information of the Recipient, and any and all trade secrets, customer lists, or pricing information of the Recipient. The nature of the information and the manner of disclosure are such that a reasonable person would understand it to be confidential. The Contractor will not at any time or in any manner, either directly or indirectly, use for the personal benefit of the Contractor, or divulge, disclose, or communicate in any manner any Confidential Information. The Contractor will protect such information and treat the Confidential Information as strictly confidential. This provision shall continue to be effective after the termination of this Agreement. Upon termination of this Agreement, the Contractor will return to the Recipient all Confidential Information, whether physical or electronic, and other items that were used, created, or controlled by the Contractor during the term of this Agreement.
                    </Text> 

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}><Text style={isDarkMode ? darkStyles.text : lightStyles.text}>This Agreement is in compliance with the Defend Trade Secrets Act and provides civil or criminal immunity to any individual for the disclosure of trade secrets: (i) made in confidence to a federal, state, or local government official, or to an attorney when the disclosure is to report suspected violations of the law; or (ii) in a complaint or other document filed in a lawsuit if made under seal.</Text></Text>


                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>12. Injuries.</Text>
                        The Contractor acknowledges the Contractor's obligation to obtain appropriate insurance coverage for the benefit of the Contractor (and the Contractor's employees, if any). The Contractor waives any rights to recovery from the Recipient for any injuries that the Contractor (and/or the Contractors employees) may sustain while performing the Services under this Agreement and that are a result of the negligence of the Contractor or the Contractor's employees. The Contractor will provide the Recipient with a certificate naming the Recipient as an additional insured party.
                    </Text> 

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>13. Indemnification. </Text>
                        The Contractor agrees to indemnify and hold harmless the Recipient from all claims, losses, expenses, fees including attorney fees, costs, and judgments that may be asserted against the Recipient that result from the acts or omissions of the Contractor, the Contractor's employees, if any, and the Contractor's agents.
                    </Text> 
                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>14. No Right to Act as Agent. </Text>
                        An "employer-employee" or "principal-agent" relationship is not created merely because (1) the Recipient has or retains the right to supervise or inspect the work as it progresses in order to ensure compliance with the terms of the Agreement; or (2) the Recipient has or retains the right to stop work done improperly. The Contractor has no right to act as an agent for the Recipient and has an obligation to notify any involved parties that it is not an agent of the Recipient.
                    </Text> 

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>15. Entire Agreement.</Text>
                        This Agreement constitutes the entire agreement between the parties. All terms and conditions contained in any other writings previously executed by the parties regarding the matters contemplated herein shall be deemed to be merged herein and superseded hereby. No modification of this Agreement shall be deemed effective unless in writing and signed by the parties hereto.
                    </Text> 

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>16. Waiver of Breach.</Text>
                        The waiver by the Recipient of a breach of any provision of this Agreement by the Contractor shall not operate or be construed as a waiver of any subsequent breach by the Contractor.
                    </Text> 

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>17. Severability.</Text>
                        T If any provision of this Agreement shall be held to be invalid or unenforceable for any reason, the remaining provisions shall continue to be valid and enforceable. If a court finds that any provision of this Agreement is invalid or unenforceable, but that by limiting such provision it would become valid and enforceable, then such provision shall be deemed to be written, construed, and enforced as so limited.
                    </Text> 

                    <Text style={isDarkMode ? darkStyles.text : lightStyles.text}>
                        <Text style={isDarkMode ? darkStyles.text2 : lightStyles.text2}>18. Applicable Law</Text>
                        This Agreement shall be governed by the laws of Colorado.
                    </Text> 

                </View>
                <View style={isDarkMode ? darkStyles.footer : lightStyles.footer}>
                    <Button title="Agree" onPress={handleNext} color={isDarkMode ? '#12CCB7' : '#12CCB7'} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    content: {
        padding: wp('5%'),
    },
    text1: {
        fontSize: hp('2.2%'),
        marginBottom: hp('1%'),
        color: '#000000',

    },
    text: {
        fontSize: hp('2%'),
        marginBottom: hp('1%'),
        color: '#000000',
    },
    text2: {
        fontSize: hp('2.2%'),
        fontWeight: 'bold',
        marginBottom: hp('1%'),
        color: '#000000',
    },
    bulletIcon: {

        color: '#000000',
        // Adjust bullet color as needed
    },
    footer: {
        padding: wp('5%'),
        borderRadius: wp('5%'),
        alignItems: 'flex-end',
    },
});

const darkStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    content: {
        padding: wp('5%'),
    },
    text1: {
        fontSize: hp('2.2%'),
        marginBottom: hp('1%'),
        color: '#FFFFFF',
    },
    text2: {
        fontSize: hp('2.2%'),
        fontWeight: 'bold',
        marginBottom: hp('1%'),
        color: '#FFFFFF',
    },
    text: {
        fontSize: hp('2%'),
        marginBottom: hp('1%'),
        color: '#FFFFFF',
    },
    bulletIcon: {
        color: '#FFFFFF',
    },
    footer: {
        padding: wp('5%'),
        alignItems: 'flex-end',
        borderRadius: wp('5%'),
    },
});

export default AgreementScreen;
