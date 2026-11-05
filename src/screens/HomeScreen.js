import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner de Boas-Vindas */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconContainer}>
            <Ionicons name="swap-horizontal" size={40} color="#2563EB" />
          </View>
          <Text style={styles.heroTitle}>Conversor de Moedas</Text>
          <Text style={styles.heroSubtitle}>
            Cotações em tempo real e conversão inteligente de moedas mundiais.
          </Text>
        </View>

        {/* Card de Objetivo do Aplicativo */}
        <View style={styles.objectiveCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flag-outline" size={22} color="#2563EB" />
            <Text style={styles.sectionTitle}>Objetivo do Aplicativo</Text>
          </View>
          <Text style={styles.objectiveText}>
            Este aplicativo foi desenvolvido para fornecer uma experiência ágil e precisa
            no acompanhamento do mercado cambial. Com dados fornecidos diretamente pela
            ExchangeRate-API, você pode:
          </Text>

          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.featureText}>
              Consultar cotações atualizadas de mais de 160 moedas mundiais.
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.featureText}>
              Favoritar moedas para acompanhamento rápido e personalizado.
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.featureText}>
              Realizar conversões diretas entre quaisquer pares com taxas em tempo real.
            </Text>
          </View>
        </View>

        {/* Seção de Atalhos Rápidos */}
        <Text style={styles.shortcutsTitle}>Navegação Rápida</Text>

        <View style={styles.grid}>
          {/* Atalho: Todas as Moedas */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Moedas', { screen: 'MoedasTab' })}
          >
            <View style={[styles.cardIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="list" size={24} color="#2563EB" />
            </View>
            <Text style={styles.cardTitle}>Todas as Moedas</Text>
            <Text style={styles.cardDescription}>
              Lista completa com taxas de câmbio atualizadas.
            </Text>
          </TouchableOpacity>

          {/* Atalho: Favoritas */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Moedas', { screen: 'FavoritasTab' })}
          >
            <View style={[styles.cardIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="star" size={24} color="#D97706" />
            </View>
            <Text style={styles.cardTitle}>Favoritas</Text>
            <Text style={styles.cardDescription}>
              Acesse suas moedas prediletas com facilidade.
            </Text>
          </TouchableOpacity>

          {/* Atalho: Converter */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Moedas', { screen: 'ConverterTab' })}
          >
            <View style={[styles.cardIconBox, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="calculator" size={24} color="#16A34A" />
            </View>
            <Text style={styles.cardTitle}>Converter</Text>
            <Text style={styles.cardDescription}>
              Simule e calcule conversões instantâneas entre moedas.
            </Text>
          </TouchableOpacity>

          {/* Atalho: Sobre */}
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Sobre')}
          >
            <View style={[styles.cardIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="information-circle" size={24} color="#9333EA" />
            </View>
            <Text style={styles.cardTitle}>Sobre o App</Text>
            <Text style={styles.cardDescription}>
              Informações técnicas, créditos e documentação.
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dica de Navegação */}
        <View style={styles.tipBox}>
          <Ionicons name="menu-outline" size={20} color="#64748B" />
          <Text style={styles.tipText}>
            Dica: Você também pode acessar qualquer tela através do menu lateral (Drawer) no canto superior.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  objectiveCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  objectiveText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 19,
  },
  shortcutsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  grid: {
    gap: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'column',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
  },
});

