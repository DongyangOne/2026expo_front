import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const SearchScreen = () => {
  return (
    <View className="flex-1">
      <WebView source={{ uri: 'https://xn--oy2b29bd3a601b.kr//' }} className="flex-1"></WebView>
    </View>
  );
};

export default SearchScreen;
