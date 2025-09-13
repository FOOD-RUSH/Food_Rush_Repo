import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { List, Switch, Button, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';

const MenuSettingsScreen = () => {
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false);
  const [showOutOfStock, setShowOutOfStock] = useState(true);
  const [enableCustomization, setEnableCustomization] = useState(true);

  return (
    <CommonView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            Menu Settings
          </Text>
          <Text className="text-gray-500 mt-2">
            Customize your menu preferences
          </Text>
        </View>

        <View className="bg-white rounded-xl overflow-hidden">
          <List.Section>
            <List.Subheader>General Settings</List.Subheader>

            <List.Item
              title="Auto-accept Orders"
              description="Automatically accept incoming orders"
              left={(props) => <List.Icon {...props} icon="cart-check" />}
              right={() => (
                <Switch
                  value={autoAcceptOrders}
                  onValueChange={setAutoAcceptOrders}
                />
              )}
            />
            <Divider />

            <List.Item
              title="Show Out of Stock Items"
              description="Display items that are currently unavailable"
              left={(props) => <List.Icon {...props} icon="eye-off" />}
              right={() => (
                <Switch
                  value={showOutOfStock}
                  onValueChange={setShowOutOfStock}
                />
              )}
            />
            <Divider />

            <List.Item
              title="Item Customization"
              description="Allow customers to customize orders"
              left={(props) => <List.Icon {...props} icon="tune" />}
              right={() => (
                <Switch
                  value={enableCustomization}
                  onValueChange={setEnableCustomization}
                />
              )}
            />
          </List.Section>
        </View>

        <View className="mt-6 space-y-4">
          <Button mode="contained" onPress={() => {}} icon="content-save">
            Save Changes
          </Button>

          <Button mode="outlined" onPress={() => {}} icon="refresh">
            Reset to Defaults
          </Button>
        </View>
      </ScrollView>
    </CommonView>
  );
};

export default MenuSettingsScreen;
