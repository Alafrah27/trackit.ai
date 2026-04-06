import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Pressable, Modal, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.5

const SelectionSheet = ({ isVisible, onClose, title, options, selectedValue, onSelect }) => {
    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Backdrop Area */}
                <Pressable 
                    onPress={onClose} 
                    style={styles.backdrop} 
                />

                <View style={styles.sheet}>
                    <View style={styles.handle} />
                    
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        style={styles.scroll}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => {
                                    onSelect(option.value)
                                    // Slight delay before closing for better feedback
                                    setTimeout(() => onClose(), 150)
                                }}
                                style={styles.option}
                            >
                                <Text style={[
                                    styles.optionText, 
                                    selectedValue === option.value && styles.selectedText
                                ]}>
                                    {option.label}
                                </Text>
                                {selectedValue === option.value && (
                                    <View style={styles.checkContainer}>
                                        <Ionicons name="checkmark" size={16} color="white" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sheet: {
        height: SHEET_HEIGHT,
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    closeBtn: {
        padding: 4,
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 24,
        marginTop: 8,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f9fafb',
    },
    optionText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#374151',
    },
    selectedText: {
        color: '#005bc1',
        fontWeight: '700',
    },
    checkContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#005bc1',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default SelectionSheet
