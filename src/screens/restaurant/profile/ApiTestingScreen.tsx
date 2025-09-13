import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import CommonView from '@/src/components/common/CommonView';
import { RestaurantProfileStackScreenProps } from '@/src/navigation/types';

type ApiTestingScreenProps = RestaurantProfileStackScreenProps<'ApiTesting'>;

interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  responseTime: number;
}

const ApiTestingScreen: React.FC<ApiTestingScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();

  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const methods = ['GET', 'POST', 'PUT', 'DELETE'];

  const parseHeaders = (headersString: string): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (!headersString.trim()) return headers;

    const lines = headersString.split('\n');
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        headers[key.trim()] = valueParts.join(':').trim();
      }
    });
    return headers;
  };

  const formatHeaders = (headers: Record<string, string>): string => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };

  const makeApiCall = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      const requestHeaders = parseHeaders(headers);
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...requestHeaders,
        },
      };

      if (method !== 'GET' && body.trim()) {
        try {
          requestOptions.body = JSON.stringify(JSON.parse(body));
        } catch (e) {
          requestOptions.body = body;
        }
      }

      const response = await fetch(url, requestOptions);
      const responseTime = Date.now() - startTime;

      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        headers: responseHeaders,
        responseTime,
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      setResponse({
        status: 0,
        statusText: 'Network Error',
        data: error instanceof Error ? error.message : 'Unknown error',
        headers: {},
        responseTime,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setUrl('');
    setMethod('GET');
    setHeaders('');
    setBody('');
    setResponse(null);
  };

  const loadSampleRequest = () => {
    setUrl('https://jsonplaceholder.typicode.com/posts/1');
    setMethod('GET');
    setHeaders('Authorization: Bearer your-token-here\nAccept: application/json');
    setBody('');
  };

  return (
    <CommonView>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>API Testing</Text>
          <TouchableOpacity
            style={styles.sampleButton}
            onPress={loadSampleRequest}
          >
            <Text style={styles.sampleButtonText}>Sample</Text>
          </TouchableOpacity>
        </View>

        {/* URL Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>URL</Text>
          <TextInput
            style={styles.urlInput}
            value={url}
            onChangeText={setUrl}
            placeholder="https://api.example.com/endpoint"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Method</Text>
          <View style={styles.methodContainer}>
            {methods.map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.methodButton,
                  method === m && styles.methodButtonActive,
                ]}
                onPress={() => setMethod(m as typeof method)}
              >
                <Text
                  style={[
                    styles.methodButtonText,
                    method === m && styles.methodButtonTextActive,
                  ]}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Headers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Headers (optional)</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={headers}
            onChangeText={setHeaders}
            placeholder="Content-Type: application/json&#10;Authorization: Bearer token"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Body */}
        {(method === 'POST' || method === 'PUT') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Body (optional)</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={body}
              onChangeText={setBody}
              placeholder='{"key": "value"}'
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.sendButton]}
            onPress={makeApiCall}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="send" size={20} color="#fff" />
                <Text style={styles.sendButtonText}>Send Request</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearAll}
            disabled={loading}
          >
            <MaterialCommunityIcons name="refresh" size={20} color="#666" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Response */}
        {response && (
          <View style={styles.section}>
            <View style={styles.responseHeader}>
              <Text style={styles.sectionTitle}>Response</Text>
              <View style={styles.responseStatus}>
                <Text
                  style={[
                    styles.statusText,
                    response.status >= 200 && response.status < 300
                      ? styles.statusSuccess
                      : styles.statusError,
                  ]}
                >
                  {response.status} {response.statusText}
                </Text>
                <Text style={styles.responseTime}>
                  {response.responseTime}ms
                </Text>
              </View>
            </View>

            {/* Response Headers */}
            <View style={styles.responseSection}>
              <Text style={styles.responseSectionTitle}>Headers</Text>
              <ScrollView
                horizontal
                style={styles.responseScroll}
                showsHorizontalScrollIndicator={false}
              >
                <Text style={styles.responseText}>
                  {formatHeaders(response.headers)}
                </Text>
              </ScrollView>
            </View>

            {/* Response Data */}
            <View style={styles.responseSection}>
              <Text style={styles.responseSectionTitle}>Data</Text>
              <ScrollView
                horizontal
                style={styles.responseScroll}
                showsHorizontalScrollIndicator={false}
              >
                <Text style={styles.responseText}>
                  {typeof response.data === 'object'
                    ? JSON.stringify(response.data, null, 2)
                    : response.data}
                </Text>
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>
    </CommonView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sampleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  sampleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  urlInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  methodContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  methodButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  methodButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  responseStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusSuccess: {
    color: '#28a745',
  },
  statusError: {
    color: '#dc3545',
  },
  responseTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  responseSection: {
    marginBottom: 16,
  },
  responseSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  responseScroll: {
    maxHeight: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  responseText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
    lineHeight: 16,
  },
});

export default ApiTestingScreen;
