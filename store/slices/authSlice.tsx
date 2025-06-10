import { createSlice , PayloadAction} from "@reduxjs/toolkit";
import { User } from "@/types";
// AUTH STATE
interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}
// INITIAL STATE OF AUTHENTICATION
const initialState : AuthState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
}
// AUTH SLICE

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload,
            state.isAuthenticated= true,
            state.isLoading= false
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        },

        setLoading : (state, action: PayloadAction <boolean>) => {
            state.isLoading = action.payload;
        }
        

    }
})

export const {setUser, clearUser, setLoading} = authSlice.actions;
export default authSlice.reducer;