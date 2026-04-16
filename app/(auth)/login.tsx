import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/useAuthStore';
import * as Haptics from 'expo-haptics';
import Logo from '@/assets/images/logo.svg';
import InputError from '@/src/components/common/InputError';

const Login = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const scrollRef = React.useRef<ScrollView>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ employeeId?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { employeeId?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.employeeId = 'Email is required';
    } else if (!email.includes('@')) {
      newErrors.employeeId = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onInputFocus = () => {
    // Scroll enough to hide the logo and focus the inputs at the top
    scrollRef.current?.scrollTo({ y: 50, animated: true });
  };

  const [loginError, setLoginError] = useState('');

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!validateForm()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    setLoginError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setLoginError(error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="px-8"
        >
          <View className="pt-40 pb-6 flex-1">
            {/* Logo Box - Precise Light Lime Color and Radius */}
            <View className="mb-10">
              <View
                style={{ backgroundColor: '#EAF9CC' }}
                className="w-20 h-20 rounded-[22px] items-center justify-center"
              >
                <Logo width={100} height={100} />
              </View>
            </View>

            {/* Heading Section */}
            <View className="mb-10">
              <Text className="text-[28px] tracking-tight">
                <Text className="font-inter-extrabold  text-[#0F7635]">Log in</Text>
                <Text className="font-inter-medium text-[#222222]"> to</Text>
              </Text>
              <Text className="text-[26px] font-inter-medium text-[#222222] tracking-tight ">
                access your account
              </Text>
            </View>

            {/* Form Inputs - Precise Height & Padding */}
            <View>
              {/* Employee ID */}
              <View>
                <View className={`bg-[#F0F0F0] rounded-xl px-5 py-4 flex-row items-center border-2 ${errors.employeeId ? 'border-[#FF4D4D]' : 'border-transparent'}`}>
                  <TextInput
                    placeholder="Employee ID"
                    placeholderTextColor="#6A6A6A"
                    value={email}
                    onChangeText={(val) => {
                      setEmail(val);
                      if (loginError) setLoginError('');
                      if (errors.employeeId) setErrors({ ...errors, employeeId: undefined });
                    }}
                    onFocus={onInputFocus}
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    className="flex-1 text-[#222222] font-inter text-[16px]"
                  />
                </View>
                <InputError message={errors.employeeId} visible={!!errors.employeeId} />
              </View>

              {/* Password */}
              <View className="mt-4">
                <View className={`bg-[#F0F0F0] rounded-xl px-5 py-4 flex-row items-center border-2 ${errors.password ? 'border-[#FF4D4D]' : 'border-transparent'}`}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#6A6A6A"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(val) => {
                      setPassword(val);
                      if (loginError) setLoginError('');
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    onFocus={onInputFocus}
                    autoComplete="password"
                    textContentType="password"
                    className="flex-1 text-[#222222] font-inter text-[16px]"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    className="p-2 -mr-2"
                  >
                    <View className="opacity-80">
                      <MaterialCommunityIcons
                        name={showPassword ? "eye" : "eye-off"}
                        size={24}
                        color="#6A6A6A"
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <InputError message={errors.password} visible={!!errors.password} />
              </View>

              {/* Shift Checkbox - Exact Size & Spacing */}
              {/* <TouchableOpacity
                className="flex-row items-center mt-3 ml-2"
                onPress={() => setKeepLoggedIn(!keepLoggedIn)}
                activeOpacity={0.7}
              >
                <View className={`w-5 h-5 rounded border-2 ${keepLoggedIn ? 'bg-[#222222] border-[#6A6A6A]' : 'border-[#6A6A6A]'} items-center justify-center mr-3`}>
                  {keepLoggedIn && <Ionicons name="checkmark-sharp" size={14} color="white" />}
                </View>
                <Text className="text-[#6A6A6A] font-inter text-[15px]">
                  Keep me logged in for this shift
                </Text>
              </TouchableOpacity> */}
            </View>

            {/* API Error Message */}
            {loginError ? (
              <View className="mt-5 bg-[#FFF0F0] border border-[#FFD4D4] rounded-xl px-4 py-3 flex-row items-center">
                <Ionicons name="alert-circle" size={20} color="#CF1A1A" />
                <Text className="text-[#CF1A1A] font-inter-medium text-[14px] ml-3 flex-1">{loginError}</Text>
              </View>
            ) : null}
          </View>

          {/* Action Button - Exact Pill Shape & Bottom Margin */}
          <View className="mt-auto pb-10">
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={{ backgroundColor: '#117B3E' }}
              className={`py-4 rounded-full items-center shadow-md active:opacity-90 ${isLoading ? 'opacity-80' : ''}`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Login</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;