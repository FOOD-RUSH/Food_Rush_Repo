import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { List, Switch, Button, Divider, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';

const MenuSettingsScreen = () => {
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [enableCustomization, setEnableCustomization] = useState(true);

  return (
    <CommonView style={{ backgroundColor: '#F8FAFC' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="px-6 py-8 bg-gradient-to-br from-blue-600 to-blue-800 -mx-6 -mt-4 mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
              <MaterialCommunityIcons name="cog" size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text className="text-2xl font-bold text-white">Menu Settings</Text>
              <Text className="text-blue-100 mt-1">Customize your menu preferences</Text>
            </View>
          </View>
        </View>

        {/* Settings Card */}
        <Card className="mx-6 mb-6" style={{ elevation: 2, backgroundColor: '#FFFFFF' }}>
          <Card.Content className="p-0">
            <List.Section>
              <List.Subheader style={{ 
                color: '#374151', 
                fontSize: 16, 
                fontWeight: '600',
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 8
              }}>
                General Settings
              </List.Subheader>
              
              <List.Item
                title="Auto-accept Orders"
                description="Automatically accept incoming orders"
                titleStyle={{ fontSize: 16, fontWeight: '500', color: '#1F2937' }}
                descriptionStyle={{ color: '#6B7280', fontSize: 14 }}
                left={props => (
                  <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center ml-4">
                    <MaterialCommunityIcons name="cart-check" size={24} color="#10B981" />
                  </View>
                )}
                right={() => (
                  <Switch
                    value={autoAcceptOrders}
                    onValueChange={setAutoAcceptOrders}
                    thumbColor={autoAcceptOrders ? '#3B82F6' : '#E5E7EB'}
                    trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                  />
                )}
                style={{ paddingVertical: 16 }}
              />
              
              <Divider style={{ marginHorizontal: 20, backgroundColor: '#E5E7EB' }} />
              
              <List.Item
                title="Show Out of Stock Items"
                description="Display items that are currently unavailable"
                titleStyle={{ fontSize: 16, fontWeight: '500', color: '#1F2937' }}
                descriptionStyle={{ color: '#6B7280', fontSize: 14 }}
                left={props => (
                  <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center ml-4">
                    <MaterialCommunityIcons name="eye-off" size={24} color="#F59E0B" />
                  </View>
                )}
                right={() => (
                  <Switch
                    value={showOutOfStock}
                    onValueChange={setShowOutOfStock}
                    thumbColor={showOutOfStock ? '#3B82F6' : '#E5E7EB'}
                    trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                  />
                )}
                style={{ paddingVertical: 16 }}
              />
              
              <Divider style={{ marginHorizontal: 20, backgroundColor: '#E5E7EB' }} />
              
              <List.Item
                title="Item Customization"
                description="Allow customers to customize orders"
                titleStyle={{ fontSize: 16, fontWeight: '500', color: '#1F2937' }}
                descriptionStyle={{ color: '#6B7280', fontSize: 14 }}
                left={props => (
                  <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center ml-4">
                    <MaterialCommunityIcons name="tune" size={24} color="#8B5CF6" />
                  </View>
                )}
                right={() => (
                  <Switch
                    value={enableCustomization}
                    onValueChange={setEnableCustomization}
                    thumbColor={enableCustomization ? '#3B82F6' : '#E5E7EB'}
                    trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                  />
                )}
                style={{ paddingVertical: 16, paddingBottom: 20 }}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View className="px-6 space-y-3 mb-8">
          <Button
            mode="contained"
            onPress={() => {}}
            icon="content-save"
            buttonColor="#3B82F6"
            contentStyle={{ paddingVertical: 12 }}
            labelStyle={{ fontSize: 16, fontWeight: '600' }}
            style={{ borderRadius: 12 }}
          >
            Save Changes
          </Button>

          <Button
            mode="outlined"
            onPress={() => {}}
            icon="refresh"
            textColor="#6B7280"
            contentStyle={{ paddingVertical: 12 }}
            labelStyle={{ fontSize: 16, fontWeight: '500' }}
            style={{ 
              borderRadius: 12, 
              borderColor: '#D1D5DB',
              backgroundColor: '#FFFFFF'
            }}
          >
            Reset to Defaults
          </Button>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default MenuSettingsScreen;