const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

// NativeWind가 global.css(Tailwind 디렉티브)를 Metro 변환 파이프라인에 주입하도록 래핑합니다.
module.exports = withNativeWind(mergeConfig(getDefaultConfig(__dirname), config), {
  input: './global.css',
});
