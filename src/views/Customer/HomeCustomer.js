import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileCustomer from './ProfileCustomer';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Details from './Details';

const Stack = createStackNavigator();

const HomeScreenCustomer = ({ navigation, route }) => {
    const [services, setServices] = useState([]);
    const [username, setUsername] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredServices, setFilteredServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicesSnapshot = await firestore().collection('services').get();
                const servicesData = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setServices(servicesData);
                setFilteredServices(servicesData); // Set initial filtered services to all services
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        const fetchUserData = async () => {
            try {
                const userQuerySnapshot = await firestore().collection('user').get();
                userQuerySnapshot.forEach(doc => {
                    const user = doc.data();
                    setUsername(user.user);
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
        navigation.navigate('Details', { service });
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const handleSearchPress = () => {
        const filtered = services.filter(service =>
            service.service.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredServices(filtered);
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
              
                <TouchableOpacity onPress={() => navigation.navigate('ProfileCustomer')}>
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

               
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm dịch vụ..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
                        <Text style={styles.searchButtonText}>Tìm</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.header}>
                    <Text style={styles.headerText}>DANH SÁCH DỊCH VỤ</Text>
                </View>

                <FlatList
                    data={filteredServices}
                    renderItem={renderItem}
                    keyExtractor={item => String(item.id)}
                    style={styles.list}
                />
            </View>
        </View>
    );
};

const HomeCustomer = ({ route }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="HomeCustomer"
                component={HomeScreenCustomer}
                initialParams={route.params}
            />
            <Stack.Screen name="ProfileCustomer" component={ProfileCustomer} />
            <Stack.Screen name="Details" component={Details} />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    upperView: {
        flexDirection: 'row',
        backgroundColor: '#FFC0CB',
        paddingVertical: 10,
        paddingHorizontal: 20,
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
        paddingTop: 10,
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    searchButton: {
        height: 40,
        backgroundColor: '#FFC0CB',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderRadius: 5,
        marginLeft: 10,
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        flex: 1,
        fontSize: 30,
        textAlign: 'center',
        color: 'black',
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
    list: {
        paddingTop: 20,
    },
});

export default HomeCustomer;
