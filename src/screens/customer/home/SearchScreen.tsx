import {
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';
import { goBack } from '@/src/navigation/navigationHelpers';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'react-native-paper/lib/typescript/components/Checkbox/Checkbox';
import { ScrollView } from 'react-native-gesture-handler';

const SearchScreen = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [promoVisible, setPromoVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  return (
    <CommonView>
      <View className="flex-row px-2 items-center py-3 bg-white">
        <TouchableOpacity
          onPress={goBack}
          className="bg-primaryColor rounded-full p-2"
        >
          <MaterialIcons name="arrow-back" size={25} color={'#fff'} />
        </TouchableOpacity>
        <KeyboardAvoidingView
          className="flex-1 ml-3"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TextInput
            placeholder="Search your craving"
            mode="outlined"
            outlineStyle={{
              borderColor: '#c4def8',
              borderWidth: 1,
              borderRadius: 20,
            }}
            style={{
              backgroundColor: 'rgb(202, 221, 240)',
              paddingTop: 5,
              paddingBottom: 5,
              paddingRight: 10,
              paddingLeft: 10,
            }}
            placeholderTextColor="#999"
            left={
              <TextInput.Icon
                icon="magnify"
                size={30}
                color={'black'}
                background={'rgb(202, 221, 240)'}
                className="pt-3 "
              />
            }
            right={
              <TextInput.Icon
                icon="close"
                onPress={() => Keyboard.dismiss()}
                className="items-center pt-2"
              />
            }
            className="flex-1"
            autoFocus={true}
            contentStyle={{ marginRight: -10, marginLeft: 45 }}
          />
        </KeyboardAvoidingView>
        {/* filter buttons */}
        <View className="flex-row justify-around items-center my-3">
          <TouchableOpacity
            className="flex-row bg-white border border-solid border-primaryColor p-2 shadow-sm space-x-1"
            onPress={() => setFilterVisible(!filterVisible)}
          >
            <Feather name="sliders" size={18} color={'#077aff'} />
            <Text className="text-primaryColor">Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity className=" bg-white border border-solid border-primaryColor p-2 shadow-sm space-x-1">
            <Text className="text-primaryColor">Sort By</Text>
          </TouchableOpacity>
          <TouchableOpacity className=" bg-white border border-solid border-primaryColor p-2 shadow-sm space-x-1">
            <Text className="text-primaryColor">Promo</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={filterVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        style={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}
      >
        <SafeAreaView className="h-full">
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={() => setFilterVisible}
              className="rounded-full p-2 active: bg-blue-200"
            >
              <MaterialIcons name="cancel" size={18} />
            </TouchableOpacity>
            <Text className="font-bold ">Filters</Text>
          </View>
          <ScrollView></ScrollView>
        </SafeAreaView>
      </Modal>
    </CommonView>
  );
};

export default SearchScreen;
