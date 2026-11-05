import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const openApiDocs = () => {
    Linking.openURL('https://www.exchangerate-api.com/docs/overview');
  };

  const openApiWebsite = () => {
    Linking.openURL('https://www.exchangerate-api.com/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho do App */}
        <View style={styles.headerCard}>
          <View style={styles.iconBox}>
            <Ionicons name="information-circle" size={44} color="#2563EB" />
          </View>
          <Text style={styles.appName}>Conversor de Moedas</Text>
          <Text style={styles.appVersion}>Versão 1.0.0</Text>
          <Text style={styles.appTagline}>
            Aplicativo móvel de câmbio e conversão de moedas mundiais desenvolvido por Matheus Tagliatti
          </Text>
        </View>

        {/* Sobre o Aplicativo */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="document-text-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
          </View>
          <Text style={styles.paragraph}>
            Este aplicativo foi desenvolvido como parte de um desafio prático de{' '}
            <Text style={styles.boldText}>Desenvolvimento Móvel</Text>, com o intuito de
            demonstrar boas práticas na construção de apps React Native utilizando Expo e
            React Navigation.
          </Text>
          <Text style={styles.paragraph}>
            Ele combina navegação híbrida via Drawer (menu lateral) e Bottom Tabs (abas inferiores),
            consumo de APIs REST em tempo real e armazenamento persistente de preferências do usuário.
          </Text>
        </View>

        {/* API e Fonte de Dados */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="cloud-done-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>API Utilizada</Text>
          </View>
          <Text style={styles.paragraph}>
            As taxas de câmbio e conversões são fornecidas pela{' '}
            <Text style={styles.boldText}>ExchangeRate-API</Text>, uma plataforma de câmbio
            confiável com suporte a mais de 160 moedas globais e atualizações diárias.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.linkButton}
              activeOpacity={0.8}
              onPress={openApiWebsite}
            >
              <Ionicons name="globe-outline" size={16} color="#2563EB" />
              <Text style={styles.linkButtonText}>Site Oficial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.linkButton, styles.docsButton]}
              activeOpacity={0.8}
              onPress={openApiDocs}
            >
              <Ionicons name="book-outline" size={16} color="#FFFFFF" />
              <Text style={[styles.linkButtonText, { color: '#FFFFFF' }]}>Documentação</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recursos Implementados */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="layers-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Arquitetura & Recursos</Text>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="menu-outline" size={18} color="#2563EB" />
            <View style={styles.featureTextCol}>
              <Text style={styles.featureLabel}>Drawer Navigation</Text>
              <Text style={styles.featureDesc}>Menu lateral com Início, Sobre e Moedas.</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="apps-outline" size={18} color="#2563EB" />
            <View style={styles.featureTextCol}>
              <Text style={styles.featureLabel}>Bottom Tabs</Text>
              <Text style={styles.featureDesc}>Abas de Moedas, Favoritas e Conversor.</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="star-outline" size={18} color="#2563EB" />
            <View style={styles.featureTextCol}>
              <Text style={styles.featureLabel}>Persistência de Favoritas</Text>
              <Text style={styles.featureDesc}>Armazenamento local seguro via AsyncStorage.</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="swap-horizontal-outline" size={18} color="#2563EB" />
            <View style={styles.featureTextCol}>
              <Text style={styles.featureLabel}>Conversor em Tempo Real</Text>
              <Text style={styles.featureDesc}>Cálculo exato com taxa e valores da cotação.</Text>
            </View>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Desenvolvimento Móvel • React Native & Expo</Text>
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
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  appTagline: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitleRow: {
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
  paragraph: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 12,
  },
  boldText: {
    fontWeight: '700',
    color: '#1E293B',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  linkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    gap: 6,
  },
  docsButton: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  linkButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  featureTextCol: {
    flex: 1,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  featureDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});

