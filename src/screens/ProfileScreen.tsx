import React, {useState} from 'react';
import {View, TextInput, Button, Image, StyleSheet} from 'react-native';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <Button title="Change Photo" onPress={pickImage} />
      {photo && <Image source={{uri: photo}} style={styles.image} />}
      <Button
        title="Save"
        onPress={() => {
          /* Save logic */
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {padding: 16},
  input: {borderBottomWidth: 1, marginBottom: 12},
  image: {width: 100, height: 100, marginTop: 12},
});
