import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RestaurantProfileStackScreenProps } from '../../../navigation/types';

type Props = RestaurantProfileStackScreenProps<'About'>;

const AboutScreen = ({ navigation }: Props) => {
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(contentAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Gradient Header */}
      <Animated.View
        style={{
          transform: [{ translateY: headerAnim }],
        }}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.header}
          start={[0, 0]}
          end={[1, 1]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About</Text>
          <MaterialCommunityIcons
            name="information-outline"
            size={32}
            color="#fff"
            style={{ marginLeft: 10 }}
          />
        </LinearGradient>
      </Animated.View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Animated.View
          style={{ opacity: contentAnim, marginTop: 24, alignItems: 'center' }}
        >
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#764ba2', '#667eea']}
              style={styles.logoBg}
            >
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={48}
                color="#fff"
              />
            </LinearGradient>
          </View>
          <Text style={styles.appName}>Food Rush</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.description}>
            Food Rush is a modern restaurant management app designed to simplify
            your business operations, manage orders, track analytics, and
            enhance customer satisfaction.
          </Text>
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Credits</Text>
            <Text style={styles.creditText}>
              Developed by The Food Rush Team
            </Text>
            <Text style={styles.creditText}> 2025 All Rights Reserved</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8fc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: '#764ba2',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  logoContainer: {
    marginTop: 16,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#764ba2',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#764ba2',
    marginTop: 6,
  },
  version: {
    fontSize: 15,
    color: '#aaa',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 18,
    alignItems: 'center',
    shadowColor: '#764ba2',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#764ba2',
    marginBottom: 10,
  },
  creditText: {
    fontSize: 15,
    color: '#333',
    marginTop: 2,
  },
});

export default AboutScreen;
