// App.js
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './src/screens/SplashScreen';
import IntroScreen from './src/screens/IntroScreen';
import IntroScreen2 from './src/screens/IntroScreen2'; // new screen
import colors from './src/theme/colors';
import LoginScreen from './src/screens/LoginScreen';
import SignUp from './src/screens/SignUp';
import Home from './src/screens/Home';

const SPLASH_DURATION_MS = 2200;

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  // show splash first, then navigation stack
  if (showSplash) {
    return (
      <View style={[styles.container, { paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }]}>
        <SplashScreen />
      </View>
    );
  }

  // After splash, show the navigator so screens receive `navigation` prop
  return (
    <NavigationContainer>
      <View style={[styles.container, { paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom }]}>
        <Stack.Navigator initialRouteName="Intro">
          <Stack.Screen
            name="Intro"
            component={IntroScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="IntroScreen2"
            component={IntroScreen2}
            options={{ headerShown: false }}
          />
             <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
              <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
        
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
