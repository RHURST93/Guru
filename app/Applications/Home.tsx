import React, { useState, useEffect } from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Modal,
    TouchableOpacity,
    Alert,
    ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { Swipeable } from 'react-native-gesture-handler';

interface Item {
    id: string;
    title: string;
    dateApplied: string;
    recruiter: string;
    contact: string;
}

const Home = () => {
    const router = useRouter();
    const [data, setData] = useState<Item[]>([]);
    const [newItemTitle, setNewItemTitle] = useState<string>('');
    const [dateApplied, setDateApplied] = useState<string>('');
    const [recruiter, setRecruiter] = useState<string>('');
    const [contact, setContact] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const STORAGE_KEY = '@flatlist_data';

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedData = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedData) {
                    setData(JSON.parse(storedData));
                }
            } catch (error) {
                console.error('Failed to load data from AsyncStorage', error);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const saveData = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (error) {
                console.error('Failed to save data to AsyncStorage', error);
            }
        };
        saveData();
    }, [data]);

    const addItem = () => {
        if (
            newItemTitle.trim() &&
            dateApplied.trim() &&
            recruiter.trim() &&
            contact.trim()
        ) {
            const newItem: Item = {
                id: (data.length + 1).toString(),
                title: newItemTitle,
                dateApplied,
                recruiter,
                contact,
            };
            setData((prevData) => [...prevData, newItem]);
            setNewItemTitle('');
            setDateApplied('');
            setRecruiter('');
            setContact('');
            setModalVisible(false);
        } else {
            alert('Please fill in all fields');
        }
    };

    const removeItem = (id: string) => {
        setData((prevData) => prevData.filter(item => item.id !== id));
    };

    const renderItem = ({ item }: { item: Item }) => {
        const renderRightActions = () => (
            <View style={styles.deleteButton}>
                <Button
                    title="Delete"
                    color="red"
                    onPress={() => removeItem(item.id)}
                />
            </View>
        );

        return (
            <Swipeable renderRightActions={renderRightActions}>
                <View style={styles.item}>
                    <Text style={styles.title}>Title: {item.title}</Text>
                    <Text>Date Applied: {item.dateApplied}</Text>
                    <Text>Recruiter: {item.recruiter}</Text>
                    <Text>Contact: {item.contact}</Text>
                </View>
            </Swipeable>
        );
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            
            
                <Text style={styles.text}>Applications</Text>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>+ Add Application</Text>
                </TouchableOpacity>

                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />

                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add New Application</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Item Title"
                                value={newItemTitle}
                                onChangeText={setNewItemTitle}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Date Applied (YYYY-MM-DD)"
                                value={dateApplied}
                                onChangeText={setDateApplied}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Recruiter Name"
                                value={recruiter}
                                onChangeText={setRecruiter}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Contact Info"
                                value={contact}
                                onChangeText={setContact}
                            />
                            <Button title="Add Item" onPress={addItem} />
                            <Button
                                title="Cancel"
                                color="red"
                                onPress={() => setModalVisible(false)}
                            />
                        </View>
                    </View>
                </Modal>

                <Button
                    title="Go to Resumes"
                    onPress={() => router.push('/Resume')}
                />
            
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    text: {
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10,
        color: '#d68b09',
        textDecorationLine: 'underline',
        textDecorationColor: "#d68b09"
    },
    addButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    item: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        color: '#333',
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8d7da',
        padding: 20,
        borderRadius: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#1f1c1c',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
        color: 'white'
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        width: '100%',
        color: 'white',
        backgroundColor: 'white'
    },
});

export default Home;
