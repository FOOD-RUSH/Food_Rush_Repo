import { View } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import CommonView from '@/src/components/common/CommonView';

const SearchModal = () => {
  return (
    <CommonView>
      <View className="flex-row justify-between px-2 items-center">
        <MaterialIcons name="arrow-back" size={20} />
        <TextInput
          mode="outlined"
          contentStyle={{ fontSize: 15, paddingHorizontal: 15 }}
          className="rounded-2xl bg-slate-500 border-none active:border-primaryColor focus:bg-blue-100 transition-colors "
          left={
            <MaterialIcons
              name="search"
              size={18}
              className="align-middle ml-1"
            />
          }
          right={
            <MaterialIcons
              name="cancel"
              size={18}
              className="align-middle mr-1"
            />
          }
          placeholder="Search for your cravings"
        />
      </View>
    </CommonView>
  );
};

export default SearchModal;
