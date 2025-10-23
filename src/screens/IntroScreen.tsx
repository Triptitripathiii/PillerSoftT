import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

let LinearGradient: any = null;
try {
  // eslint-disable-next-line global-require
  LinearGradient = require('react-native-linear-gradient').default;
} catch (e) {
  LinearGradient = null;
}

const { width, height } = Dimensions.get('window');
const PILL_WIDTH = Math.min(300, width * 0.6);

export default function IntroScreen({ navigation }: any) {
  const handleSkip = () => {
    // navigate to the second intro screen
    navigation.navigate('IntroScreen2');
    // if you prefer replacement: navigation.replace('IntroScreen2');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.container.backgroundColor as string} />

      <View style={styles.slide}>
        <View style={styles.centerStack}>
          {/* Pill (Logo | Ipsum) */}
          <View style={styles.topPillWrap}>
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

          {/* central text block */}
          <View style={styles.textWrap}>
            <Text style={styles.title}>Kareer & Events</Text>
            <Text style={styles.desc}>
              While you train, we bring you the relevant jobs and events to cater employment.
            </Text>
          </View>
        </View>

        {/* Bottom Skip */}
        <View style={styles.bottomArea}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerStack: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  // Pill
  topPillWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  buttonWrap: {
    flexDirection: 'row',
    width: PILL_WIDTH,
    height: 48,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#1b2452',
    overflow: 'hidden',
  },
  leftPill: {
    flex: 1,
    backgroundColor: '#1b2452',
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
  },
  rightText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },

  slide: {
    width,
    minHeight: height - 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text block
  textWrap: {
    paddingHorizontal: 36,
    alignItems: 'center',
    marginTop: 14,
  },
  title: {
    color: '#1b2452',
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  desc: {
    color: '#6b6b6b',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Bottom
  bottomArea: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 28,
  },
  skipButton: {
    padding: 12,
  },
  skipText: {
    color: '#1b2452',
    fontSize: 16,
    fontWeight: '600',
  },
});
