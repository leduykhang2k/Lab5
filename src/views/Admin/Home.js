import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AddNewServices from './AddNewServices';
import ServiceDetails from './ServiceDetails';
import Profile from './Profile';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation, route }) => {
    const [services, setServices] = useState([]);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesSnapshot = await firestore().collection('services').get();
                const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(servicesData);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const userQuerySnapshot = await firestore().collection('user').get();
                userQuerySnapshot.forEach(doc => {
                    const user = doc.data();
                    setUsername(user.name);
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchServices();
        fetchUserData();

        const unsubscribe = navigation.addListener('focus', () => {
            fetchServices();
            fetchUserData();
        });

        return unsubscribe;
    }, [navigation]);


    const handleServicePress = (service) => {
        navigation.navigate('ServiceDetails', { service });
    };

    const renderItem = ({ item, index }) => (
        <TouchableOpacity style={styles.input} onPress={() => handleServicePress(item)}>
            <View style={styles.itemContainer}>
                <Text>{`${index + 1}. ${item.service}`}</Text>
                <Text>{item.prices}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
        
            <View style={styles.upperView}>
              
                <Text style={styles.username}>{username}</Text>
               
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <View style={styles.iconContainer}>
                        <Icon name="user" size={25} color="black" />
                    </View>
                </TouchableOpacity>
            </View>

           
            <View style={styles.contentContainer}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../image/logolab3.png')}
                        style={{ width: 200, height: 200 }}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.header}>
                    <Text style={styles.headerText}>DANH SÁCH DỊCH VỤ</Text>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddNewServices')}>
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={services}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    style={styles.list}
                />
            </View>
        </View>
    );
};

const Home = ({ route }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                initialParams={route.params}
            />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="AddNewServices" component={AddNewServices} />
            <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    upperView: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FFC0CB',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    input: {
        height: 40,
        width: 350,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        padding: 10
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        flex: 1,
        fontSize: 18,
    },
    addButton: {
        backgroundColor: 'pink',
        borderRadius: 50,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    buttonText: {
        fontSize: 20,
        color: 'white',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    username: {
        marginRight: 'auto',
        marginLeft: 10,
    },
    iconContainer: {
        padding: 5,
    },
});

export default Home;
