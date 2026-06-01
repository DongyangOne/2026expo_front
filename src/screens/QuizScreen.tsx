import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QuizScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>퀴즈</Text>
    </View>
  );
};

export default QuizScreen;

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
