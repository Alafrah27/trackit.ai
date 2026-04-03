import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from './navbar'
const ThmedSafeArea = ({ children }) => {
    return (
        <SafeAreaView className='flex-1 bg-surface px-4'>
            <Navbar />
            {children}
        </SafeAreaView>
    )
}

export default ThmedSafeArea