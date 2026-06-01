import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AccountScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>계정</Text>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    color: '#1f2937',
  },
});
