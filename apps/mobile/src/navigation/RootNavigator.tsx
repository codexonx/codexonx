import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

// SVG ikonları
import HomeIcon from '@assets/icons/HomeIcon';
import ProjectsIcon from '@assets/icons/ProjectsIcon';
import ProfileIcon from '@assets/icons/ProfileIcon';
import SettingsIcon from '@assets/icons/SettingsIcon';

// Kimlik doğrulama ekranları
import LoginScreen from '@screens/auth/LoginScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@screens/auth/ForgotPasswordScreen';

// Ana ekranlar
import HomeScreen from '@screens/HomeScreen';
import ProjectsScreen from '@screens/ProjectsScreen';
import ProfileScreen from '@screens/ProfileScreen';
import SettingsScreen from '@screens/SettingsScreen';
import ProjectDetailScreen from '@screens/ProjectDetailScreen';

// State management
import { useAuthStore } from '@store/authStore';

// Tip tanımları
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ProjectDetail: { id: string; title: string };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Projects: undefined;
  Profile: undefined;
  Settings: undefined;
};

type TabBarIconProps = {
  color: string;
  focused: boolean;
  size: number;
};

const HomeTabIcon = ({ color, size }: TabBarIconProps) => (
  <HomeIcon color={color} width={size} height={size} />
);

const ProjectsTabIcon = ({ color, size }: TabBarIconProps) => (
  <ProjectsIcon color={color} width={size} height={size} />
);

const ProfileTabIcon = ({ color, size }: TabBarIconProps) => (
  <ProfileIcon color={color} width={size} height={size} />
);

const SettingsTabIcon = ({ color, size }: TabBarIconProps) => (
  <SettingsIcon color={color} width={size} height={size} />
);

// Navigatörler
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Kimlik doğrulama navigator'ı
const AuthNavigator = () => {
  const { t } = useTranslation();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: t('auth.login') }} />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: t('auth.register') }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: t('auth.forgotPassword') }}
      />
    </AuthStack.Navigator>
  );
};

// Ana tab navigator'ı
const MainNavigator = () => {
  const { t } = useTranslation();

  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: 'rgba(0, 0, 0, 0.1)',
          elevation: 0,
        },
        headerShown: true,
      }}
    >
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t('nav.dashboard'),
          tabBarIcon: HomeTabIcon,
        }}
      />
      <MainTab.Screen
        name="Projects"
        component={ProjectsScreen}
        options={{
          title: t('nav.projects'),
          tabBarIcon: ProjectsTabIcon,
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t('nav.profile'),
          tabBarIcon: ProfileTabIcon,
        }}
      />
      <MainTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('nav.settings'),
          tabBarIcon: SettingsTabIcon,
        }}
      />
    </MainTab.Navigator>
  );
};

// Kök navigator
const RootNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <RootStack.Screen name="Main" component={MainNavigator} />
          <RootStack.Screen
            name="ProjectDetail"
            component={ProjectDetailScreen}
            options={({ route }: { route: { params: RootStackParamList['ProjectDetail'] } }) => ({
              headerShown: true,
              title: route.params.title,
            })}
          />
        </>
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

export default RootNavigator;
