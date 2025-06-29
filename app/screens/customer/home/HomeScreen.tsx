import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  return (
    <SafeAreaView>
      <ScrollView className='py-3 px-2'>
        {/* Header with profile photo and notification Icon and cart screen */}
        <View className='flex-1 flex-row justify-between'>
          {/* PHOTo of user with description of where food needs to be delivered */}
          <View className='flex-1 flex-row justify-end'>
            
          </View>
        </View>

        

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
