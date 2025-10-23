// src/screens/SignUp.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { register } from '../api/auth'; // <- import the API helper

const { width, height } = Dimensions.get('window');
const CARD_PADDING = 20;
const INPUT_HEIGHT = 52;

type Props = {
  navigation?: any;
};

export default function SignUp({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+33');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const onBack = () => navigation?.goBack?.();

  const validateEmail = (em: string) => {
    // simple email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(em);
  };

  const validate = () => {
    if (!firstName.trim()) {
      Alert.alert('Validation', 'Please enter your first name.');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Validation', 'Please enter your email.');
      return false;
    }
    if (!validateEmail(email.trim())) {
      Alert.alert('Validation', 'Please enter a valid email address.');
      return false;
    }
    if (!password.trim() || password.length < 6) {
      Alert.alert('Validation', 'Password must be at least 6 characters.');
      return false;
    }
    if (!mobile.trim()) {
      Alert.alert('Validation', 'Please enter your mobile number.');
      return false;
    }
    // basic mobile numeric check
    if (!/^\d{6,15}$/.test(mobile.trim())) {
      Alert.alert('Validation', 'Please enter a valid mobile number (digits only).');
      return false;
    }
    return true;
  };

  const onRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        password,
        mobile_number: `${countryCode}${mobile.trim()}`,
      };

      const res = await register(payload);
      // res expected: { success: true, message, data: { user, token } }
      if (res && res.success) {
        // If API returns token inside res.data.token (or res.data?.token), store it and navigate to Home.
        const token = res?.data?.token || res?.data?.data?.token;
        if (token) {
          try {
            await AsyncStorage.setItem('@auth_token', token);
          } catch (e) {
            console.warn('Failed to persist token', e);
          }
        }

        Alert.alert('Success', res.message || 'Registered successfully', [
          {
            text: 'OK',
            onPress: () => {
              // navigate to Home and reset navigation stack
              navigation?.reset?.({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            },
          },
        ]);
      } else {
        const msg = (res && res.message) || 'Registration failed. Please try again.';
        Alert.alert('Registration failed', msg);
      }
    } catch (err: any) {
      console.log('Register error', err?.response ?? err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Network error. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  // keyboard offset: tweak if your header or statusbar heights differ
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 90 : 80;

  return (
    <KeyboardAvoidingView
      style={styles.screenOuter}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F6F7FA" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {/* Outer background layer (subtle color) */}
        <View style={styles.outerBackground}>
          {/* Inner white card (second layer) */}
          <View style={styles.innerCardWrap}>
            <ScrollView
              contentContainerStyle={styles.containerScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header Row */}
              <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} disabled={loading}>
                  <Ionicons name="chevron-back" size={22} color="#2b2b46" />
                </TouchableOpacity>
              </View>

              {/* Title and subtitle */}
              <Text style={styles.pageTitle}>Create account</Text>
              <Text style={styles.subtitle}>3 easy signup process</Text>

              {/* Progress bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack} />
                <LinearGradient
                  colors={['#11b77a', '#0d6373']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressFill}
                />
              </View>

              {/* Big heading */}
              <Text style={styles.bigHeading}>Enter your basic{'\n'}details</Text>

              {/* Form */}
              <View style={styles.form}>
                <FloatingInput
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={!loading}
                />
                <FloatingInput
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!loading}
                />
                <FloatingInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
                <FloatingInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!loading}
                />

                {/* Mobile row: country code + mobile field */}
                <View style={styles.mobileRow}>
                  <TouchableOpacity
                    style={styles.countryBox}
                    onPress={() => {
                      // placeholder for country picker
                      console.log('open country picker');
                    }}
                    activeOpacity={0.8}
                    disabled={loading}
                  >
                    <Text style={styles.countryText}>{countryCode}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={18} color="#333" />
                  </TouchableOpacity>

                  <View style={[styles.inputCard, styles.mobileInputCard]}>
                    <TextInput
                      value={mobile}
                      onChangeText={setMobile}
                      placeholder="Mobile Number"
                      placeholderTextColor="#a7a7a7"
                      keyboardType="phone-pad"
                      style={styles.mobileInput}
                      editable={!loading}
                    />
                  </View>
                </View>

                {/* Next button */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={onRegister}
                  style={[styles.nextWrap, loading && { opacity: 0.95 }]}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={['#11b77a', '#0d6373']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.nextButton}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.nextText}>Create account</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Small spacer */}
              <View style={{ height: 24 }} />
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

/* ---------- FloatingInput helper ---------- */
function FloatingInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  editable = true,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  editable?: boolean;
}) {
  const [secure, setSecure] = useState<boolean>(!!secureTextEntry);

  return (
    <View style={styles.inputCard}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#a7a7a7"
        style={styles.input}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        editable={editable}
      />
      {secureTextEntry && (
        <TouchableOpacity
          style={styles.eyeBtnSmall}
          onPress={() => setSecure((s) => !s)}
          hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}
          disabled={!editable}
        >
          <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={18} color="#9b9b9b" />
        </TouchableOpacity>
      )}
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  screenOuter: { flex: 1, backgroundColor: '#F6F7FA' }, // outer layer color
  outerBackground: {
    flex: 1,
    padding: 16,
    // center the inner card vertically (like the screenshot)
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCardWrap: {
    width: '96%',
    maxWidth: 420,
    // inner white card (second layer)
    backgroundColor: '#ffffff',
    // borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: CARD_PADDING,
    // shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 6,
  },

  // make ScrollView content grow so items push up when keyboard opens
  containerScroll: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  headerRow: {
    height: 44,
    justifyContent: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageTitle: {
    fontSize: 20,
    color: '#1f2646',
    fontWeight: '700',
    marginTop: 6,
  },
  subtitle: {
    color: '#9aa0b5',
    fontSize: 12,
    marginTop: 6,
    marginBottom: 12,
  },

  progressContainer: {
    marginTop: 6,
    marginBottom: 18,
    height: 14,
    justifyContent: 'center',
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#e9ebf0',
    borderRadius: 6,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    width: width * 0.24, // ~24% filled as in image
    height: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },

  bigHeading: {
    color: '#1b2452',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 36,
  },

  form: {
    marginTop: 4,
  },

  inputCard: {
    height: INPUT_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 0.3,
    borderColor: '#eee',
  },
  input: {
    fontSize: 15,
    color: '#222',
  },
  eyeBtnSmall: {
    position: 'absolute',
    right: 12,
    top: 14,
  },

  mobileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryBox: {
    width: 88,
    height: INPUT_HEIGHT,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginRight: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 0.3,
    borderColor: '#eee',
  },
  countryText: {
    fontSize: 14,
    color: '#222',
  },
  mobileInputCard: {
    flex: 1,
    paddingHorizontal: 12,
  },
  mobileInput: {
    fontSize: 15,
    color: '#222',
  },

  nextWrap: {
    marginTop: 18,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  nextButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 18,
  },
  nextText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
