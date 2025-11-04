import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RootNavigator from '@navigation/RootNavigator';
import { useAuthStore } from '@store/authStore';
import { setupI18n } from '@i18n/i18n';

// i18n kurulumu
setupI18n();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { initialized, initializeApp } = useAuthStore();

  // Uygulama başlangıcında token kontrolü ve kullanıcı verilerini yükleme
  useEffect(() => {
    const setup = async () => {
      // Saklı token varsa kullanıcı durumunu yenile
      await initializeApp();
    };

    setup();
  }, [initializeApp]);

  // Uygulama henüz yüklenmediyse veya splash screen'i gösteriyorsak buradan dönebiliriz
  if (!initialized) {
    return null; // Splash screen veya yükleme göstergesi burada gösterilebilir
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <RootNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
