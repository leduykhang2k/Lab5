import React from 'react';
import {
    View,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.iconWrapper}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <View style={styles.iconContainer}>
                        <Icon name="sign-out" size={50} color="black" />
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        padding: 10,
        backgroundColor: '#FFC0CB',
        borderRadius: 50,
    },
});

export default Settings;
