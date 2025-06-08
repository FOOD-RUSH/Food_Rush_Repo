import React from 'react'
import { Tabs } from 'expo-router'

const CustomLayout = () => {
  return (
    <Tabs screenOptions={{headerShown: false
        
    }}
   
    >
        <Tabs.Screen name='(tabs)/home'
        options={{
            title: "Home"
        }}
        />
        <Tabs.Screen name='(tabs)/cart'
        options={{
            title: "Home"
        }}
        />
        <Tabs.Screen name='(tabs)/notifications'
        options={{
            title: "Home"
        }}
        />
        <Tabs.Screen name='(tabs)/profile'
        options={{
            title: "Home"
        }}
        />
        {/* screens accessible via navigation but hidder */}
        <Tabs.Screen
        name='(tabs)/restaurant[id]'
        options = {{title: 'restaurant'}}
        />
        
        <Tabs.Screen
        name='index'
        options={{href: null}}
        />
    </Tabs>
  )
}

export default CustomLayout