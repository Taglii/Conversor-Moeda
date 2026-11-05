import 'react-native-gesture-handler';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { FavoritesProvider } from './src/context/FavoritesContext';
import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';
import MoedasListScreen from './src/screens/MoedasListScreen';
import FavoritasScreen from './src/screens/FavoritasScreen';
import ConverterScreen from './src/screens/ConverterScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// Botão hambúrguer para abrir o Drawer a partir das abas
function DrawerMenuButton({ navigation }) {
  return (
    <TouchableOpacity
      style={styles.menuButton}
      onPress={() => navigation.openDrawer()}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="menu" size={26} color="#1E293B" />
    </TouchableOpacity>
  );
}

// Navegador de Abas Inferiores (Bottom Tabs) para a seção Moedas
function MoedasTabs({ navigation }) {
  return (
    <Tab.Navigator
      initialRouteName="MoedasTab"
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 1,
          shadowOpacity: 0.05,
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
          color: '#1E293B',
        },
        headerLeft: () => <DrawerMenuButton navigation={navigation} />,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'MoedasTab') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'FavoritasTab') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'ConverterTab') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="MoedasTab"
        component={MoedasListScreen}
        options={{ title: 'Moedas' }}
      />
      <Tab.Screen
        name="FavoritasTab"
        component={FavoritasScreen}
        options={{ title: 'Favoritas' }}
      />
      <Tab.Screen
        name="ConverterTab"
        component={ConverterScreen}
        options={{ title: 'Converter' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Drawer.Navigator
          initialRouteName="Início"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FFFFFF',
              elevation: 1,
              shadowOpacity: 0.05,
              borderBottomWidth: 1,
              borderBottomColor: '#E2E8F0',
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '700',
              color: '#1E293B',
            },
            headerTintColor: '#1E293B',
            drawerActiveTintColor: '#2563EB',
            drawerInactiveTintColor: '#475569',
            drawerActiveBackgroundColor: '#EFF6FF',
            drawerLabelStyle: {
              fontSize: 15,
              fontWeight: '600',
              marginLeft: -8,
            },
            drawerStyle: {
              backgroundColor: '#FFFFFF',
              width: 280,
            },
          }}
        >
          {/* Menu Lateral 1: Início */}
          <Drawer.Screen
            name="Início"
            component={HomeScreen}
            options={{
              title: 'Início',
              drawerIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />

          {/* Menu Lateral 2: Sobre */}
          <Drawer.Screen
            name="Sobre"
            component={AboutScreen}
            options={{
              title: 'Sobre',
              drawerIcon: ({ color, size }) => (
                <Ionicons name="information-circle-outline" size={size} color={color} />
              ),
            }}
          />

          {/* Menu Lateral 3: Moedas (Bottom Tabs: Moedas, Favoritas, Converter) */}
          <Drawer.Screen
            name="Moedas"
            component={MoedasTabs}
            options={{
              title: 'Moedas',
              headerShown: false,
              drawerIcon: ({ color, size }) => (
                <Ionicons name="cash-outline" size={size} color={color} />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 16,
    padding: 4,
  },
});
