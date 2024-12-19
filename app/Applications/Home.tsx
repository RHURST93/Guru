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
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { relative } from 'path';

interface Item {
    id: string;
    title: string;
    dateApplied: string;
    recruiter: string;
    contact: string;
    status: 'pending' | 'selected' | 'notSelected';
}

const Home = () => {
    const router = useRouter();
    const [data, setData] = useState<Item[]>([]);
    const [filteredData, setFilteredData] = useState<Item[]>([]);
    const [filter, setFilter] = useState<string>('all'); // Filter state
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
        applyFilter(filter);
    }, [data]);

    const applyFilter = (status: string) => {
        setFilter(status);
        if (status === 'all') {
            setFilteredData(data);
        } else {
            setFilteredData(data.filter((item) => item.status === status));
        }
    };

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
                status: 'pending', // Default status
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
        setData((prevData) => prevData.filter((item) => item.id !== id));
    };

    const toggleStatus = (id: string) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          status:
                              item.status === 'selected'
                                  ? 'pending'
                                  : item.status === 'pending'
                                  ? 'notSelected'
                                  : 'selected',
                      }
                    : item
            )
        );
    };

    const renderItem = ({ item }: { item: Item }) => {
        const renderRightActions = () => (
            <View style={styles.deleteButton}>
    <TouchableOpacity
        style={{
            borderRadius: 5,
            backgroundColor: 'red',
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        onPress={() => removeItem(item.id)}
    >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
    </TouchableOpacity>
</View>

        );

        return (
            <Swipeable renderRightActions={renderRightActions}>
                <View style={styles.item}>
                    <Text style={styles.title}>Title: {item.title}</Text>
                    <Text>Date Applied: {item.dateApplied}</Text>
                    <Text>Recruiter: {item.recruiter}</Text>
                    <Text>Contact: {item.contact}</Text>
                    <TouchableOpacity
                        style={[
                            styles.statusButton,
                            styles[item.status],
                        ]}
                        onPress={() => toggleStatus(item.id)}
                    >
                        <Text style={styles.statusButtonText}>
                            {item.status}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Swipeable>
        );
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <Text style={styles.text}>Applications</Text>

            <View style={styles.filterContainer}>
                {['all', 'pending', 'notSelected', 'selected'].map((status) => (
                    <TouchableOpacity
                        key={status}
                        style={[
                            styles.filterButton,
                            filter === status && styles.activeFilter,
                        ]}
                        onPress={() => applyFilter(status)}
                    >
                        <Text style={styles.filterText}>{status}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>+ Add Application</Text>
            </TouchableOpacity>

            <FlatList
                data={filteredData}
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
    container: { flex: 1, padding: 10, width: "100%" },
    text: { textAlign: 'center', fontSize: 20, marginBottom: 10 },
    filterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
    filterButton: { padding: 10, backgroundColor: '#ddd', borderRadius: 5, margin: 5 },
    activeFilter: { backgroundColor: '#007BFF' },
    filterText: { color: '#000' },
    addButton: { backgroundColor: '#007BFF', padding: 10, marginBottom: 10, alignItems: 'center', borderRadius: 5 },
    addButtonText: { color: '#FFF' },
    item: { backgroundColor: '#FFF', padding: 15, marginVertical: 5, borderRadius: 5 },
    statusButton: { marginTop: 10, padding: 10, borderRadius: 5, alignItems: 'center' },
    pending: { backgroundColor: '#f9c74f' },
    selected: { backgroundColor: '#28a745' },
    notSelected: { backgroundColor: '#dc3545' },
    statusButtonText: { color: '#FFF' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { width: '80%', padding: 20, backgroundColor: '#FFF', borderRadius: 5 },
    input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
    deleteButton: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8d7da', paddingHorizontal: 50, height:155, marginTop: 5, borderRadius: 5 },
});

export default Home;
