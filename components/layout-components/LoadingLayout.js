import { StyleSheet, View, ActivityIndicator, Modal } from 'react-native';
import React from 'react';

const LoadingLayout = () => {
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="fade"
                transparent={true}
                presentationStyle={'overFullScreen'}
                visible={true}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ActivityIndicator color="#ffffff" />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default LoadingLayout;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        width: "100%",
        height: "100%",
        marginTop: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#18A0FB',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
});