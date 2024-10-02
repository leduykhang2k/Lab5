import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore'; 

const AppointmentCustomer = () => {
    const navigation = useNavigation();
    const [bookings, setBookings] = useState([]);

  
    useEffect(() => {
        const unsubscribe = firestore().collection('bookings').onSnapshot(querySnapshot => {
            const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBookings(bookingsData);
        });

       
        return () => unsubscribe();
    }, []); 

    
    const deleteBooking = async (id) => {
        try {
            await firestore().collection('bookings').doc(id).delete();
            Alert.alert('Thông báo', 'Đặt lịch đã được xoá thành công');
        } catch (error) {
            console.error('Error deleting booking: ', error);
            Alert.alert('Error', 'Failed to delete booking');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Các dịch vụ đã đặt của bạn</Text>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.bookingText}>Tên dịch vụ: {item.serviceName}</Text>
                        <Text style={styles.bookingText}>Ngày: {item.bookingDate}</Text>
                        <Text style={styles.bookingText}>Giờ: {item.bookingTime}</Text>
                        <TouchableOpacity onPress={() => deleteBooking(item.id)} style={styles.deleteButton}>
                            <Text style={styles.deleteButtonText}>Xoá</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        paddingTop: 20
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bookingText: {
        fontSize: 16,
        marginBottom: 5,
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AppointmentCustomer;
