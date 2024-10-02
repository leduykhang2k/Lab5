import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Customer = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        
        const fetchBookings = async () => {
            try {
                const snapshot = await firestore().collection('bookings').get();
                const bookingsData = snapshot.docs.map(doc => doc.data());
                setBookings(bookingsData);
            } catch (error) {
                console.error('Error fetching bookings: ', error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LỊCH ĐẶT KHÁCH HÀNG</Text>
            <FlatList
                data={bookings}
                renderItem={({ item, index }) => (
                    <View style={styles.item}>
                        <Text style={styles.serialNumber}>{index + 1}.</Text>
                        <View style={styles.itemContent}>
                            <Text>Tên dịch vụ: {item.serviceName}</Text>
                            <Text>Giá: {item.prices}</Text>
                            <Text>Ngày làm dịch vụ: {item.bookingDate}</Text>
                            <Text>Thời gian: {item.bookingTime}</Text>
                           
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        backgroundColor: 'white',
    },
    serialNumber: {
        marginRight: 10,
        fontWeight: 'bold',
    },
    itemContent: {
        flex: 1,
    },
});

export default Customer;
