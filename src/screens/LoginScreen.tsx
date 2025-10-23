// src/screens/LoginScreen.tsx
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { login } from '../api/auth';

const { width } = Dimensions.get('window');

type Props = {
  navigation?: any;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      Alert.alert('Validation', 'Please enter your email or phone number.');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Validation', 'Please enter your password.');
      return false;
    }
    return true;
  };

  const onLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // include remember flag if you want backend behavior
      const payload = {
        email: email.trim(),
        password,
        remember_me: remember,
      };

      const res = await login(payload);
      // expected res format from your API doc: { success: true, message, data: { user, token } }
      if (res && res.success) {
        // Login success - token is saved inside auth.login()
        console.log('Login success', res);
        // Replace stack to avoid going back to login
        navigation?.replace?.('Home');
      } else {
        // API responded but login failed
        const msg = (res && res.message) || 'Login failed. Please check your credentials.';
        Alert.alert('Login failed', msg);
      }
    } catch (err: any) {
      console.log('Login error', err?.response ?? err);
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

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo Pill */}
        <View style={styles.pillOuter}>
          <View style={styles.leftPill}>
            <Text style={styles.leftPillText}>Logo</Text>
          </View>

          <LinearGradient
            colors={['#11b77a', '#0d6373', '#1b2452']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rightPill}
          >
            <Text style={styles.rightPillText}>Ipsum</Text>
          </LinearGradient>
        </View>

        {/* Title */}
        <Text style={styles.title}>Log In</Text>

        {/* Inputs */}
        <View style={styles.form}>
          <View style={styles.inputWrap}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email / Phone number"
              placeholderTextColor="#9b9b9b"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={[styles.inputWrap, styles.passwordWrap]}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#9b9b9b"
              style={[styles.input, { flex: 1 }]}
              secureTextEntry={secure}
              autoCapitalize="none"
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setSecure((s) => !s)}
              style={styles.eyeBtn}
              hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}
              disabled={loading}
            >
              <Ionicons
                name={secure ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#9b9b9b"
              />
            </TouchableOpacity>
          </View>

          {/* Remember + Forgot */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.checkboxWrap}
              onPress={() => setRemember((r) => !r)}
              disabled={loading}
            >
              <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                {remember && <MaterialIcons name="check" size={16} color="#fff" />}
              </View>
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation?.navigate?.('ForgotPassword')} disabled={loading}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Gradient Button */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onLogin}
            style={[styles.buttonWrap, loading && { opacity: 0.9 }]}
            disabled={loading}
          >
            <LinearGradient
              colors={['#11b77a', '#0d6373', '#1b2452']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Register link */}
          <View style={styles.registerWrap}>
            <Text style={styles.smallText}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={loading}>
              <Text style={styles.registerLink}>Register now!</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PILL_WIDTH = Math.min(300, width * 0.6);

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#ffffff' },
  container: {
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: 18,
  },
  pillOuter: {
    flexDirection: 'row',
    width: PILL_WIDTH,
    height: 48,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#1b2452',
    overflow: 'hidden',
    marginBottom: 38,
  },
  leftPill: {
    flex: 1,
    backgroundColor: '#1b2452',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftPillText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  rightPill: {
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightPillText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  title: {
    fontSize: 28,
    color: '#1b2452',
    fontWeight: '700',
    marginBottom: 26,
    textAlign: 'center',
  },

  form: {
    width: '100%',
    paddingHorizontal: 8,
  },

  inputWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#cfcfcf',
    marginBottom: 18,
    paddingVertical: 6,
  },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 44,
    fontSize: 15,
    color: '#222',
    padding: 0,
  },

  eyeBtn: {
    marginLeft: 8,
    padding: 6,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 22,
  },

  checkboxWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#cfcfcf',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#11b77a',
    borderColor: '#11b77a',
  },
  checkboxLabel: {
    color: '#222',
    fontSize: 14,
  },
  forgotText: {
    color: '#1b2452',
    fontSize: 14,
  },

  buttonWrap: {
    marginTop: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  button: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  registerWrap: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallText: {
    color: '#222',
  },
  registerLink: {
    color: '#11b77a',
    fontWeight: '700',
    marginLeft: 4,
  },
});
