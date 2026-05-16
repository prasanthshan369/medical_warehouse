import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import InputError from '@/src/components/common/InputError';

interface LoginFormProps {
  employeeId: string;
  setEmployeeId: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  errors: { employeeId?: string; password?: string };
  onFocus: () => void;
  onInputChange: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  employeeId,
  setEmployeeId,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  errors,
  onFocus,
  onInputChange,
}) => {
  return (
    <View>
      {/* Employee ID */}
      <View>
        <View className={`bg-[#F0F0F0] rounded-xl px-5 py-4 flex-row items-center border-2 ${errors.employeeId ? 'border-[#FF4D4D]' : 'border-transparent'}`}>
          <TextInput
            placeholder="Employee ID"
            placeholderTextColor="#6A6A6A"
            value={employeeId}
            onChangeText={(val) => {
              setEmployeeId(val);
              onInputChange();
            }}
            onFocus={onFocus}
            autoCapitalize="none"
            autoComplete="username"
            textContentType="username"
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
              onInputChange();
            }}
            onFocus={onFocus}
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
    </View>
  );
};
