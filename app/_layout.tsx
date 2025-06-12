import { Provider as PaperProvider } from "react-native-paper";
import './globals.css';
import { lightTheme } from "@/config/theme";
import { StatusBar } from "react-native";
import { Stack } from "expo-router";
export default function RootLayout() {
  return (
   <PaperProvider theme={lightTheme}>
    <StatusBar/>
     <Stack>
     <Stack.Screen name="index" options={{headerShown: false}} />
     <Stack.Screen name="(auth)" options={{headerShown: false}} />
     <Stack.Screen name="(customer)" options={{headerShown: false}} />
     <Stack.Screen name="(restaurant)" options={{headerShown: false}} />
    </Stack>

   </PaperProvider>
  );
}
