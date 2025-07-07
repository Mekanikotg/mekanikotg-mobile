import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Heading1, Label } from '../components'

const EulaScreen = () => {
    return (
        <ScrollView className="bg-white">
            <View className="p-4 justify-center flex-col items-center">
                <Heading1>EULA</Heading1>
                <Label className="whitespace-pre-wrap text-lg">
                    END-USER LICENSE AGREEMENT (EULA){"\n"}
                    Last Updated: 28 November 2024{"\n"}{"\n"}

                    This End-User License Agreement ("Agreement") constitutes a legal agreement between you ("User") and Speed Up Car Care Center ("Company"), the owner and operator of the MekanikOTG mobile application ("App"). By registering for, accessing, or using the App, you agree to the terms outlined in this Agreement.
                    If you do not agree to these terms, do not register, access, or use the App.{"\n"}{"\n"}
                    
                    Section 1. Acceptance of Terms{"\n"}
                    By creating an account or registering on the App, you acknowledge that:{"\n"}
                    1.1. You are at least 18 years old and capable of entering into a binding agreement.{"\n"}
                    1.2. You have read, understood, and agree to the terms of this Agreement.
                    {"\n"}{"\n"}
                    Section 2. License Grant{"\n"}
                    The Company grants you a limited, non-exclusive, non-transferable, and revocable license to use the App solely for personal or professional purposes as described in this Agreement.{"\n"}
                    {"\n"}
                    Section 3. Registration Obligations{"\n"}
                    3.1. Accurate Information: You must provide accurate, current, and complete information during the registration process. Failure to do so may result in account suspension or termination.{"\n"}
                    3.2. Account Security: You are responsible for maintaining the confidentiality of your login credentials. You agree to notify the Company immediately of any unauthorized use of your account.{"\n"}
                    3.3. Eligibility: The App is intended for individuals and businesses within Pasig City requiring assistance for four-wheeled vehicles.{"\n"}
                    {"\n"}
                    Section 4. Permitted Use{"\n"}
                    You agree to use the App solely for its intended purpose, which includes:{"\n"}
                    4.1. Booking emergency mechanic and towing services.{"\n"}
                    4.2. Communicating with assigned service providers through the App’s chat or call features.{"\n"}
                    You agree not to:{"\n"}
                    4.3. Use the App for unlawful or fraudulent activities.{"\n"}
                    4.4. Misrepresent your identity or any information provided during registration.{"\n"}
                    {"\n"}
                    Section 5. User Conduct{"\n"}
                    By registering and using the App, you agree to:{"\n"}
                    5.1. Comply with all applicable laws and regulations.{"\n"}
                    5.2. Treat service providers and other users with respect and professionalism.{"\n"}
                    5.3. Refrain from actions that disrupt the functionality of the App.{"\n"}{"\n"}
                    Section 6. Privacy and Data Collection{"\n"}
                    6.1. By registering, you consent to the collection, use, and storage of your personal information.{"\n"}
                    6.2. The App may collect your location data to facilitate services.{"\n"}{"\n"}
                    Section 7. Payment Terms{"\n"}
                    7.1. Payment for services booked through the App must be completed as per the terms displayed at the time of booking.{"\n"}
                    7.2. The Company is not responsible for disputes or additional fees incurred between you and the service provider.{"\n"}
                    {"\n"}
                    Section 8. Termination{"\n"}
                    The Company reserves the right to suspend or terminate your account and access to the App if:{"\n"}
                    8.1. You violate this Agreement or applicable laws.{"\n"}
                    8.2. Your actions are deemed harmful to the App, its users, or service providers.{"\n"}
                    {"\n"}
                    Section 9. Limitation of Liability{"\n"}
                    The Company is not liable for:{"\n"}
                    9.1. Delays, errors, or disruptions in service caused by third-party providers.{"\n"}
                    9.2. Loss or damage arising from unauthorized use of your account.{"\n"}
                    {"\n"}
                    Section 10. Disclaimer of Warranties{"\n"}
                    The App is provided "as is" without warranties of any kind, either express or implied. The Company does not guarantee:{"\n"}
                    10.1. Uninterrupted or error-free operation of the App.{"\n"}
                    10.2. Availability or reliability of services provided through the App.{"\n"}
                    {"\n"}
                    Section 11. Amendments{"\n"}
                    The Company reserves the right to modify this Agreement at any time. Notice of changes will be provided within the App or via email. Continued use of the App constitutes acceptance of the updated Agreement.{"\n"}
                    {"\n"}
                    Section 12. Governing Law and Dispute Resolution{"\n"}
                    12.1. This Agreement is governed by the laws of the Philippines.{"\n"}
                    12.2. Any disputes shall be resolved through arbitration in accordance with Philippine law.{"\n"}
                    {"\n"}
                    Section 13. Contact Information{"\n"}
                    For questions or concerns about this Agreement, please contact us at:{"\n"}
                    Speed Up Car Care Center{"\n"}
                    Email: evozethaldama1982@gmail.com{"\n"}
                    Phone: 0905-4147653{"\n"}
                    {"\n"}
                    By registering for or using the MekanikOTG application, you acknowledge that you have read, understood, and agree to be bound by this Agreement.
                </Label>
            </View>
        </ScrollView>
    )
}

export default EulaScreen

const styles = StyleSheet.create({})