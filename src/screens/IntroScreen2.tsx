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

export default function IntroScreen2({ navigation }: any) {
  const handleGetStarted = () => {
   navigation.navigate('LoginScreen');
    // Replace with your app's main/home navigation:
    // navigation.navigate('Home');
    // or navigation.reset(...) to clear stack
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
            <Text style={styles.title}>
              Klinic – No{' '}
              <Text style={styles.titleSub}>appointments or video calls required.</Text>
            </Text>
            <Text style={styles.desc}>
              Start a visit quickly and discreetly, whenever works best for you and get a treatment.
            </Text>
          </View>
        </View>

        {/* Bottom Get Started */}
        <View style={styles.bottomArea}>
          <TouchableOpacity onPress={handleGetStarted} style={styles.getStartedWrap} activeOpacity={0.85}>
            {LinearGradient ? (
              <LinearGradient
                colors={['#11b77a', '#0d6373']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.getStarted}
              >
                <Text style={styles.getStartedText}>Get Started</Text>
              </LinearGradient>
            ) : (
              <View style={[styles.getStarted, styles.rightFallback]}>
                <Text style={styles.getStartedText}>Get Started</Text>
              </View>
            )}
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
  titleSub: {
    color: '#1b2452',
    fontWeight: '700',
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
  getStartedWrap: {
    width: width - 40,
    paddingHorizontal: 20,
  },
  getStarted: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
