import React, { useEffect, useState } from 'react'
import { useColorScheme, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Dark, Default } from '../theme'
import AuthStack from './AuthStack'
import MainStack from './MainStack'
import { useAuth } from '../hooks/useAuth'

const Navigation = () => {
  const scheme = useColorScheme()

  const { isAuthUser } = useAuth()

  console.log(isAuthUser)

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor={scheme === 'dark' ? 'black' : 'white'}
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer theme={scheme === 'dark' ? Dark : Default}>
        {isAuthUser ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default Navigation
