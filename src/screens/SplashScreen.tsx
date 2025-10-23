import React from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions } from 'react-native';

let LinearGradient: any = null;
try {
  LinearGradient = require('react-native-linear-gradient').default;
} catch (e) {
  LinearGradient = null;
}

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.container.backgroundColor as string} />

      <View style={styles.buttonWrap}>
        <View style={styles.leftPill}>
          <Text style={styles.leftText}>Logo</Text>
        </View>

        {LinearGradient ? (
          <LinearGradient
            colors={['#11b77a', '#0d6373']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rightPill}
          >
            <Text style={styles.rightText}>Ipsum</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.rightPill, styles.rightFallback]}>
            <Text style={styles.rightText}>Ipsum</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const PILL_WIDTH = Math.min(300, width * 0.6);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dfe5ee', // exact match with image background
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrap: {
    flexDirection: 'row',
    width: PILL_WIDTH,
    height: 48,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#1b2452', // same as left pill
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  leftPill: {
    flex: 1,
    backgroundColor: '#1b2452', // deep navy from image
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightPill: {
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightFallback: {
    backgroundColor: '#0d6373',
  },
  leftText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  rightText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
