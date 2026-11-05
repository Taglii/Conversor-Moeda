import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getLatestRates, getSupportedCurrencies, getCurrencyName } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritasScreen({ navigation }) {
  const { favorites, removeFavorite } = useFavorites();

  const [ratesMap, setRatesMap] = useState({});
  const [namesMap, setNamesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Carrega as cotações para exibir nas favoritas
  const carregarDados = useCallback(async () => {
    try {
      const [ratesResult, codesResult] = await Promise.all([
        getLatestRates('USD'),
        getSupportedCurrencies(),
      ]);

      if (ratesResult.success && ratesResult.rates) {
        setRatesMap(ratesResult.rates);
      }

      if (codesResult.success && codesResult.codes) {
        const names = {};
        codesResult.codes.forEach((item) => {
          names[item.code] = item.name;
        });
        setNamesMap(names);
      }
    } catch (error) {
      console.error('Erro ao carregar dados das favoritas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const onRefresh = () => {
    setRefreshing(true);
    carregarDados();
  };

  // Monta lista de objetos das moedas favoritas
  const moedasFavoritas = useMemo(() => {
    return favorites.map((sigla) => {
      const taxa = ratesMap[sigla];
      const nome = namesMap[sigla] || getCurrencyName(sigla);
      return {
        sigla,
        nome,
        taxa,
      };
    });
  }, [favorites, ratesMap, namesMap]);

  // Filtra por busca se houver
  const moedasFiltradas = useMemo(() => {
    if (!searchQuery.trim()) return moedasFavoritas;
    const q = searchQuery.toLowerCase().trim();
    return moedasFavoritas.filter(
      (m) => m.sigla.toLowerCase().includes(q) || m.nome.toLowerCase().includes(q)
    );
  }, [moedasFavoritas, searchQuery]);

  const handleConverterMoeda = (sigla) => {
    navigation.navigate('ConverterTab', {
      moedaDestinoPre: sigla === 'BRL' ? 'USD' : sigla,
      moedaOrigemPre: sigla === 'BRL' ? 'BRL' : 'USD',
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemCard}>
        <View style={styles.cardHeader}>
          <View style={styles.siglaBadge}>
            <Ionicons name="star" size={16} color="#D97706" style={{ marginRight: 4 }} />
            <Text style={styles.siglaText}>{item.sigla}</Text>
          </View>

          <TouchableOpacity
            style={styles.unfavoriteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => removeFavorite(item.sigla)}
          >
            <Ionicons name="close" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <Text style={styles.nomeMoeda}>{item.nome}</Text>

        <View style={styles.rateBox}>
          <Text style={styles.rateLabel}>Cotação de Referência:</Text>
          <Text style={styles.rateValue}>
            {item.taxa !== undefined
              ? `1 USD = ${typeof item.taxa === 'number' ? item.taxa.toFixed(4) : item.taxa} ${item.sigla}`
              : 'Consultando taxa...'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.convertButton}
          activeOpacity={0.8}
          onPress={() => handleConverterMoeda(item.sigla)}
        >
          <Ionicons name="swap-horizontal" size={16} color="#2563EB" />
          <Text style={styles.convertButtonText}>Converter com {item.sigla}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && favorites.length > 0 && Object.keys(ratesMap).length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Carregando moedas favoritas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {favorites.length > 0 ? (
        <>
          {/* Barra de Busca de Favoritas (se houver mais de 3) */}
          {favorites.length > 3 && (
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Filtrar favoritas..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="characters"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.headerInfo}>
            <Text style={styles.headerCount}>
              {favorites.length} {favorites.length === 1 ? 'moeda salva' : 'moedas salvas'}
            </Text>
            <Text style={styles.headerSub}>Toque em converter para simular valores</Text>
          </View>

          <FlatList
            data={moedasFiltradas}
            keyExtractor={(item) => item.sigla}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#2563EB']}
                tintColor="#2563EB"
              />
            }
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Ionicons name="star-outline" size={48} color="#D97706" />
          </View>
          <Text style={styles.emptyTitle}>Nenhuma moeda favorita ainda</Text>
          <Text style={styles.emptyDescription}>
            Você pode favoritar qualquer moeda tocando no ícone de estrela na lista de
            moedas para acompanhá-la facilmente aqui.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MoedasTab')}
          >
            <Ionicons name="list" size={18} color="#FFFFFF" />
            <Text style={styles.exploreButtonText}>Explorar Moedas</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  headerInfo: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerCount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSub: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  siglaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  siglaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D97706',
  },
  unfavoriteButton: {
    padding: 4,
  },
  nomeMoeda: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  rateBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  rateLabel: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 2,
  },
  rateValue: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  convertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  convertButtonText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

