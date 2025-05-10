import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {Control, Controller} from 'react-hook-form';

type InputFieldProps = {
  name: string;
  control: Control<any>;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  name,
  control,
  placeholder,
  secureTextEntry = false,
  error,
}) => {
  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value, onBlur}}) => (
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            placeholder={placeholder}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            secureTextEntry={secureTextEntry}
          />
        )}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});

export default InputField;
