

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";


export const useAppNavigaiton = () => {

    return useNavigation<NativeStackNavigationProp<RootStackParamList>>();
}

