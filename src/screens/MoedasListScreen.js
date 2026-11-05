import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getLatestRates, getSupportedCurrencies, getCurrencyName } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';

export default function MoedasListScreen({ navigation }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  // Carrega as moedas da API
  const carregarMoedas = useCallback(async () => {
    try {
      setErrorMessage(null);

      // Busca taxas mais recentes baseadas em USD e lista de nomes
      const [ratesResult, codesResult] = await Promise.all([
        getLatestRates('USD'),
        getSupportedCurrencies(),
      ]);

      if (!ratesResult.success) {
        setErrorMessage(ratesResult.error || 'Erro ao carregar taxas de câmbio.');
        return;
      }

      // Cria mapa de nomes por código
      const namesMap = {};
      if (codesResult.success && codesResult.codes) {
        codesResult.codes.forEach((item) => {
          namesMap[item.code] = item.name;
        });
      }

      const rates = ratesResult.rates || {};
      const listaFormatada = Object.keys(rates)
        .sort()
        .map((sigla) => ({
          sigla,
          nome: namesMap[sigla] || getCurrencyName(sigla),
          taxa: rates[sigla],
        }));

      setMoedas(listaFormatada);
      if (ratesResult.lastUpdateUtc) {
        setLastUpdate(ratesResult.lastUpdateUtc);
      }
    } catch (error) {
      console.error('Erro ao buscar moedas:', error);
      setErrorMessage('Falha ao conectar com o serviço de moedas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarMoedas();
  }, [carregarMoedas]);

  const onRefresh = () => {
    setRefreshing(true);
    carregarMoedas();
  };

  // Filtragem pela busca (sigla ou nome)
  const moedasFiltradas = useMemo(() => {
    if (!searchQuery.trim()) return moedas;
    const query = searchQuery.toLowerCase().trim();
    return moedas.filter(
      (m) =>
        m.sigla.toLowerCase().includes(query) ||
        m.nome.toLowerCase().includes(query)
    );
  }, [moedas, searchQuery]);

  // Ação ao tocar em uma moeda para converter
  const handleSelecionarParaConversao = (sigla) => {
    navigation.navigate('ConverterTab', {
      moedaDestinoPre: sigla === 'USD' ? 'BRL' : sigla,
      moedaOrigemPre: sigla === 'USD' ? 'USD' : 'USD',
    });
  };

  const renderMoedaItem = ({ item }) => {
    const favorite = isFavorite(item.sigla);

    return (
      <TouchableOpacity
        style={styles.itemCard}
        activeOpacity={0.8}
        onPress={() => handleSelecionarParaConversao(item.sigla)}
      >
        <View style={styles.itemLeft}>
          <View style={[styles.siglaBadge, favorite && styles.siglaBadgeFavorite]}>
            <Text style={[styles.siglaText, favorite && styles.siglaTextFavorite]}>
              {item.sigla}
            </Text>
          </View>

          <View style={styles.itemTextContainer}>
            <Text style={styles.nomeMoeda} numberOfLines={1}>
              {item.nome}
            </Text>
            <Text style={styles.taxaInfo}>
              1 USD = {typeof item.taxa === 'number' ? item.taxa.toFixed(4) : item.taxa}{' '}
              {item.sigla}
            </Text>
          </View>
        </View>

        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.favoriteButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => toggleFavorite(item.sigla)}
          >
            <Ionicons
              name={favorite ? 'star' : 'star-outline'}
              size={24}
              color={favorite ? '#F59E0B' : '#94A3B8'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Carregando moedas da API...</Text>
      </View>
    );
  }

  if (errorMessage && moedas.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={56} color="#EF4444" />
        <Text style={styles.errorTitle}>Ops! Ocorreu um problema</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={carregarMoedas}>
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por sigla (BRL, EUR...) ou nome"
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoCapitalize="characters"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearSearchButton}
          >
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Cabeçalho de Status / Contador */}
      <View style={styles.statusBar}>
        <Text style={styles.countText}>
          {moedasFiltradas.length}{' '}
          {moedasFiltradas.length === 1 ? 'moeda encontrada' : 'moedas encontradas'}
        </Text>
        {lastUpdate ? (
          <Text style={styles.updateTimeText}>Base: USD</Text>
        ) : null}
      </View>

      {/* Lista de Moedas */}
      <FlatList
        data={moedasFiltradas}
        keyExtractor={(item) => item.sigla}
        renderItem={renderMoedaItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Nenhuma moeda encontrada</Text>
            <Text style={styles.emptySubtitle}>
              Tente buscar por outra sigla ou nome de moeda.
            </Text>
          </View>
        }
      />
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
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 14,
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    gap: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    height: '100%',
  },
  clearSearchButton: {
    padding: 4,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  countText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  updateTimeText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  siglaBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  siglaBadgeFavorite: {
    backgroundColor: '#FEF3C7',
  },
  siglaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  siglaTextFavorite: {
    color: '#D97706',
  },
  itemTextContainer: {
    flex: 1,
  },
  nomeMoeda: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 3,
  },
  taxaInfo: {
    fontSize: 12.5,
    color: '#64748B',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
});
