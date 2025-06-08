import { Provider as PaperProvider } from "react-native-paper";
import { lightTheme } from "@/config/theme";
import { StatusBar } from "react-native";
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
<<<<<<< HEAD
>>>>>>> dca64a0 (Update submodule content)
=======
   </PaperProvider>
>>>>>>> 1d969ab (cleaned up a little bit ~Tochukwu Paul)
  );
}
