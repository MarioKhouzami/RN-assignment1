import React, {useEffect, useState} from 'react';
import {View, Text, Image, Button, StyleSheet} from 'react-native';
import {useAuth} from '../context/AuthContext';

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: {url: string};
};

const ProfileScreen = () => {
  console.log('Profile screen rendered');
  const {getProfile, updateProfileImage} = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile...');
        const data = await getProfile();
        console.log('Profile data:', data);
        setProfile(data.user); // set to user object directly
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChangeProfilePicture = () => {
    // TODO: Implement image picker and updateProfileImage logic here
    console.log('Change profile picture pressed');
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profile.profileImage?.url ? (
        <Image
          source={{
            uri: `https://backend-practice.eurisko.me${profile.profileImage.url}`,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text>No profile picture</Text>
      )}
      <Text style={styles.text}>
        {profile.firstName} {profile.lastName}
      </Text>
      <Text style={styles.text}>{profile.email}</Text>
      <Button
        title="Change Profile Picture"
        onPress={handleChangeProfilePicture}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: '#ccc',
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default ProfileScreen;
