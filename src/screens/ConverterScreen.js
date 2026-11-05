import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { convertCurrency, getSupportedCurrencies, getCurrencyName } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';

export default function ConverterScreen({ route }) {
  const { favorites } = useFavorites();

  const [moedaOrigem, setMoedaOrigem] = useState('BRL');
  const [moedaDestino, setMoedaDestino] = useState('USD');
  const [valor, setValor] = useState('100');

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Lista de moedas para o seletor modal
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTarget, setModalTarget] = useState('origem'); // 'origem' ou 'destino'
  const [modalSearch, setModalSearch] = useState('');

  // Recebe parâmetros de pré-seleção ao navegar de outras telas
  useEffect(() => {
    if (route.params?.moedaOrigemPre) {
      setMoedaOrigem(route.params.moedaOrigemPre);
    }
    if (route.params?.moedaDestinoPre) {
      setMoedaDestino(route.params.moedaDestinoPre);
    }
  }, [route.params]);

  // Carrega lista de moedas suportadas para o seletor
  useEffect(() => {
    async function carregarCodigos() {
      const res = await getSupportedCurrencies();
      if (res.success && res.codes) {
        setCurrencyOptions(res.codes);
      }
    }
    carregarCodigos();
  }, []);

  // Inverter moedas de origem e destino
  const handleInverter = () => {
    const temp = moedaOrigem;
    setMoedaOrigem(moedaDestino);
    setMoedaDestino(temp);
    setResultado(null);
    setErrorMessage(null);
  };

  // Executar conversão
  const handleConverter = async () => {
    Keyboard.dismiss();
    setErrorMessage(null);

    const valorLimpo = valor.trim().replace(',', '.');
    const valorNum = parseFloat(valorLimpo);

    if (!valorLimpo || isNaN(valorNum) || valorNum <= 0) {
      setErrorMessage('Por favor, informe um valor numérico válido maior que zero.');
      return;
    }

    if (moedaOrigem.toUpperCase() === moedaDestino.toUpperCase()) {
      setResultado({
        origemValor: valorNum,
        origemMoeda: moedaOrigem.toUpperCase(),
        destinoValor: valorNum,
        destinoMoeda: moedaDestino.toUpperCase(),
        taxa: 1.0,
        ultimaAtualizacao: 'Mesma moeda selecionada',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await convertCurrency(
        moedaOrigem.toUpperCase().trim(),
        moedaDestino.toUpperCase().trim(),
        valorLimpo
      );

      if (res.success) {
        setResultado({
          origemValor: valorNum,
          origemMoeda: res.baseCode,
          destinoValor: res.targetValue,
          destinoMoeda: res.targetCode,
          taxa: res.conversionRate,
          ultimaAtualizacao: res.lastUpdateUtc,
        });
      } else {
        setErrorMessage(res.error || 'Não foi possível realizar a conversão.');
      }
    } catch (err) {
      setErrorMessage('Falha ao comunicar com o servidor de conversão.');
    } finally {
      setLoading(false);
    }
  };

  // Abre modal seletor
  const openModal = (target) => {
    setModalTarget(target);
    setModalSearch('');
    setModalVisible(true);
  };

  // Seleciona moeda no modal
  const handleSelectCurrency = (code) => {
    if (modalTarget === 'origem') {
      setMoedaOrigem(code);
    } else {
      setMoedaDestino(code);
    }
    setModalVisible(false);
    setResultado(null);
  };

  // Moedas filtradas no modal
  const filteredModalCurrencies = useMemo(() => {
    if (!modalSearch.trim()) return currencyOptions;
    const q = modalSearch.toLowerCase().trim();
    return currencyOptions.filter(
      (c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
    );
  }, [currencyOptions, modalSearch]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Card Principal do Conversor */}
          <View style={styles.converterCard}>
            <Text style={styles.cardHeaderTitle}>Conversão de Moedas</Text>
            <Text style={styles.cardHeaderSub}>
              Selecione as moedas e digite o valor a ser convertido
            </Text>

            {/* Linha dos Seletores de Moeda */}
            <View style={styles.currenciesSelectorContainer}>
              {/* Moeda Origem */}
              <View style={styles.currencyBlock}>
                <Text style={styles.label}>Moeda Origem</Text>
                <TouchableOpacity
                  style={styles.currencySelectButton}
                  activeOpacity={0.8}
                  onPress={() => openModal('origem')}
                >
                  <View style={styles.currencyBadge}>
                    <Text style={styles.currencyBadgeText}>{moedaOrigem}</Text>
                  </View>
                  <View style={styles.currencyNameBox}>
                    <Text style={styles.currencyNameText} numberOfLines={1}>
                      {getCurrencyName(moedaOrigem)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Botão de Inversão */}
              <TouchableOpacity
                style={styles.swapButton}
                activeOpacity={0.7}
                onPress={handleInverter}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="swap-horizontal" size={22} color="#2563EB" />
              </TouchableOpacity>

              {/* Moeda Destino */}
              <View style={styles.currencyBlock}>
                <Text style={styles.label}>Moeda Destino</Text>
                <TouchableOpacity
                  style={styles.currencySelectButton}
                  activeOpacity={0.8}
                  onPress={() => openModal('destino')}
                >
                  <View style={[styles.currencyBadge, { backgroundColor: '#DCFCE7' }]}>
                    <Text style={[styles.currencyBadgeText, { color: '#16A34A' }]}>
                      {moedaDestino}
                    </Text>
                  </View>
                  <View style={styles.currencyNameBox}>
                    <Text style={styles.currencyNameText} numberOfLines={1}>
                      {getCurrencyName(moedaDestino)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Input de Valor */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Valor a ser convertido</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPrefix}>{moedaOrigem}</Text>
                <TextInput
                  style={styles.input}
                  value={valor}
                  onChangeText={(text) => {
                    setValor(text);
                    setResultado(null);
                    setErrorMessage(null);
                  }}
                  keyboardType="numeric"
                  placeholder="Ex: 100.00"
                  placeholderTextColor="#94A3B8"
                  returnKeyType="done"
                  onSubmitEditing={handleConverter}
                />
                {valor.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setValor('');
                      setResultado(null);
                    }}
                    style={styles.clearInputButton}
                  >
                    <Ionicons name="close-circle" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Botões de Valores Rápidos */}
            <View style={styles.quickValuesRow}>
              {[10, 50, 100, 500, 1000].map((quickVal) => (
                <TouchableOpacity
                  key={quickVal}
                  style={[
                    styles.quickValueChip,
                    valor === String(quickVal) && styles.quickValueChipActive,
                  ]}
                  onPress={() => {
                    setValor(String(quickVal));
                    setResultado(null);
                  }}
                >
                  <Text
                    style={[
                      styles.quickValueText,
                      valor === String(quickVal) && styles.quickValueTextActive,
                    ]}
                  >
                    {quickVal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Mensagem de Erro (se houver) */}
            {errorMessage ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color="#EF4444" />
                <Text style={styles.errorBoxText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Botão de Converter */}
            <TouchableOpacity
              style={[styles.convertButton, loading && styles.convertButtonDisabled]}
              activeOpacity={0.8}
              onPress={handleConverter}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.convertButtonText}>Calculando cotação...</Text>
                </View>
              ) : (
                <View style={styles.loadingRow}>
                  <Ionicons name="calculator-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.convertButtonText}>Converter</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Exibição do Resultado da Conversão */}
          {resultado && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
                <Text style={styles.resultHeaderTitle}>Resultado da Conversão</Text>
              </View>

              {/* Linha do Valor Origem */}
              <View style={styles.resultRow}>
                <Text style={styles.resultRowLabel}>Valor de Origem:</Text>
                <Text style={styles.resultRowValue}>
                  {Number(resultado.origemValor).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}{' '}
                  <Text style={styles.currencyTag}>{resultado.origemMoeda}</Text>
                </Text>
              </View>

              {/* Linha do Valor Destino (Destaque Principal) */}
              <View style={[styles.resultRow, styles.resultHighlightRow]}>
                <Text style={styles.resultRowLabelHighlight}>Valor de Destino:</Text>
                <Text style={styles.resultMainHighlight}>
                  {Number(resultado.destinoValor).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}{' '}
                  <Text style={styles.currencyTagHighlight}>{resultado.destinoMoeda}</Text>
                </Text>
              </View>

              {/* Linha da Taxa de Conversão */}
              <View style={styles.resultRow}>
                <Text style={styles.resultRowLabel}>Taxa de Conversão:</Text>
                <Text style={styles.resultRateValue}>
                  1 {resultado.origemMoeda} ={' '}
                  {typeof resultado.taxa === 'number'
                    ? resultado.taxa.toFixed(5)
                    : resultado.taxa}{' '}
                  {resultado.destinoMoeda}
                </Text>
              </View>

              {/* Atualização da API */}
              {resultado.ultimaAtualizacao && (
                <View style={styles.updateFooter}>
                  <Ionicons name="time-outline" size={14} color="#94A3B8" />
                  <Text style={styles.updateFooterText}>
                    Cotação oficial: {resultado.ultimaAtualizacao}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Modal Seletor de Moedas */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {/* Cabeçalho do Modal */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    Selecionar Moeda de {modalTarget === 'origem' ? 'Origem' : 'Destino'}
                  </Text>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#1E293B" />
                  </TouchableOpacity>
                </View>

                {/* Busca no Modal */}
                <View style={styles.modalSearchBox}>
                  <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.modalSearchInput}
                    placeholder="Pesquisar moeda (sigla ou nome)..."
                    placeholderTextColor="#94A3B8"
                    value={modalSearch}
                    onChangeText={setModalSearch}
                    autoCapitalize="characters"
                  />
                  {modalSearch.length > 0 && (
                    <TouchableOpacity onPress={() => setModalSearch('')}>
                      <Ionicons name="close-circle" size={16} color="#94A3B8" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Seção de Moedas Favoritas para Acesso Rápido */}
                {favorites.length > 0 && !modalSearch && (
                  <View style={styles.modalFavoritesSection}>
                    <Text style={styles.modalSectionLabel}>Moedas Favoritas</Text>
                    <View style={styles.modalFavoritesRow}>
                      {favorites.map((favCode) => (
                        <TouchableOpacity
                          key={favCode}
                          style={styles.modalFavChip}
                          onPress={() => handleSelectCurrency(favCode)}
                        >
                          <Ionicons name="star" size={12} color="#D97706" style={{ marginRight: 4 }} />
                          <Text style={styles.modalFavChipText}>{favCode}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {/* Lista Completa de Moedas */}
                <FlatList
                  data={filteredModalCurrencies}
                  keyExtractor={(item) => item.code}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalCurrencyItem}
                      onPress={() => handleSelectCurrency(item.code)}
                    >
                      <View style={styles.modalItemBadge}>
                        <Text style={styles.modalItemBadgeText}>{item.code}</Text>
                      </View>
                      <Text style={styles.modalItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={styles.modalEmpty}>
                      <Text style={styles.modalEmptyText}>Nenhuma moeda encontrada</Text>
                    </View>
                  }
                />
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  converterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardHeaderSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 18,
  },
  currenciesSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  currencyBlock: {
    flex: 1,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  currencySelectButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  currencyBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  currencyNameBox: {
    flex: 1,
    marginRight: 4,
  },
  currencyNameText: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  inputSection: {
    marginBottom: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  inputPrefix: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    height: '100%',
  },
  clearInputButton: {
    padding: 4,
  },
  quickValuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  quickValueChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickValueChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  quickValueText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  quickValueTextActive: {
    color: '#2563EB',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    gap: 8,
  },
  errorBoxText: {
    flex: 1,
    fontSize: 12.5,
    color: '#B91C1C',
    lineHeight: 17,
  },
  convertButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  convertButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  convertButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  resultHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#166534',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DCFCE7',
  },
  resultRowLabel: {
    fontSize: 13.5,
    color: '#4B5563',
  },
  resultRowValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  currencyTag: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  resultHighlightRow: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 6,
    borderBottomWidth: 0,
    paddingVertical: 12,
  },
  resultRowLabelHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
  },
  resultMainHighlight: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#15803D',
  },
  currencyTagHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#166534',
  },
  resultRateValue: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#374151',
  },
  updateFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
    justifyContent: 'flex-end',
  },
  updateFooterText: {
    fontSize: 11.5,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    marginBottom: 12,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
  },
  modalFavoritesSection: {
    marginBottom: 14,
  },
  modalSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  modalFavoritesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalFavChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  modalFavChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D97706',
  },
  modalCurrencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalItemBadge: {
    width: 52,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalItemBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  modalItemName: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  modalEmpty: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  modalEmptyText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});

