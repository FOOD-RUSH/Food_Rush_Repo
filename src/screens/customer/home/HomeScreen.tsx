import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import CommonView from '@/src/components/common/CommonView';
import { Avatar, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native-gesture-handler';

const HomeScreen = () => {
  //get user state in the home screen
  return (
    <CommonView>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Avatar.Image source={{}} style={styles.avatarStyle} />
          <View style={styles.ColumnStyle}>
            <Text style={{ fontSize: 20, color: 'gray' }}>Deliver to</Text>
            <Text style={{ fontSize: 30, fontWeight: 'semibold' }}>
              Deliver to Biyemassi
            </Text>
          </View>
          <Pressable className="mr-2">
            <Ionicons name="notifications-circle" color="#007aff" size={20} />
          </Pressable>
          <Pressable className="mr-2">
            <Ionicons name="cart-outline" color="#007aff" size={20} />
          </Pressable>
        </View>
        <View id="searchBar">
          <TextInput
            right={<Ionicons name="search" size={40} color="grey" />}
            mode="outlined"
            style={{
              paddingHorizontal: 20,
              backgroundColor: 'grey',
              justifyContent: 'center',
            }}
          />
        </View>
        {/* Promotions section */}

        <View >

        </View>
      </ScrollView>
    </CommonView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatarStyle: {
    backgroundColor: 'white',
    height: 100,
    width: 100,
  },
  ColumnStyle: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
