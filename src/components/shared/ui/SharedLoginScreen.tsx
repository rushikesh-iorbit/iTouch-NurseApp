// shared/ui/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';


import AsyncStorage from '@react-native-async-storage/async-storage';

const eyeIcon = require('../../../../assets/icons/eye-line.png');
const eyeOffIcon = require('../../../../assets/icons/eye-off-line.png');

type RootStackParamList = {
  Login: undefined;
  TwoFactorAuth: undefined;
  Dashboard: undefined;
};

type LoginScreenProps = {
  title: string;
  description: string;
  imageSource: any;
  logoSource: any;
  onLogin: (username: string, password: string) => Promise<any>;
};

const SharedLoginScreen: React.FC<LoginScreenProps> = ({
  title,
  description,
  imageSource,
  logoSource,
  onLogin,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIconColor] = useState('#000000');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false)


  const handlePasswordVisibility = () => {
    setPasswordVisibility(prev => !prev);
  };

   const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
    };

  
  const handleLogin = async () => {
  Keyboard.dismiss();
  
  if (!username || !password) {
    Toast.show({
      type: 'error',
      text1: 'Login Error',
      text2: 'Please fill Username & Password',
    });
    return;
  }

  if (!validateEmail(username)) {
    Toast.show({
      type: 'error',
      text1: 'Invalid Input',
      text2: 'Please enter a valid email address',
    });
    return;
  }

  try {
    setLoading(true);
    console.log('Login attempt with:', username);
    
    const response = await onLogin(username, password);
    console.log('Login response:', response);

    await AsyncStorage.setItem('userName', response.userName);
    await AsyncStorage.setItem('orgName', response.orgName);

    if (response.code === '111') {
      Toast.show({
        type: 'info',
        text1: 'Verify Your Email',
        text2: response.message,
      });
      // Set state for email verification flow if needed
      return;
    }

    if (response.code === '222') {
      Toast.show({
        type: 'info',
        text1: '2-Factor Authentication',
        text2: response.message,
      });
      navigation.replace('TwoFactorAuth');
      return;
    }

    // If no special codes, proceed to dashboard
    navigation.replace('Dashboard');

  } catch (error: any) {
    const errorMessage = error?.response?.data?.message 
      || 'Invalid credentials. Please check your email and password';
    
    Toast.show({
      type: 'error',
      text1: 'Login Failed',
      text2: errorMessage,
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.leftPanel}>
          <Text style={styles.appTitle}>{title}</Text>
          <Image source={imageSource} style={styles.image} resizeMode="contain" />
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.rightPanel}>
          <Image source={logoSource} style={styles.logo} />
          <Text style={styles.welcomeText}>Welcome to iTouch Nurse</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={'#000000'}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor={'#000000'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={passwordVisibility}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={handlePasswordVisibility}>
              <Image
                source={passwordVisibility ? eyeOffIcon : eyeIcon}
                style={[styles.eyeImage, { tintColor: rightIconColor }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.forgotRow}>
            <Text style={styles.forgotText}> </Text>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SharedLoginScreen;


const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  leftPanel: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  rightPanel: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  image: {
    width: 250,
    height: 200,
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginBottom: 2,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
 passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    height: 40,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingRight: 40, // Make space for the icon
    color: '#000000',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  forgotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  forgotText: {
    color: '#999',
  },
  forgotPassword: {
    color: 'green',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#4CAE51',
    paddingVertical: 10,
    borderRadius: 10,
  },
  loginText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  description: {
    fontSize: 10,
    textAlign: 'center',
    paddingHorizontal: 8,
    color: '#555',
  },
  eyeImage: {
  width: 22,
  height: 22,
},

});
