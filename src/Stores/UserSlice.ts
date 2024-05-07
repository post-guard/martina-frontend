import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        token : localStorage.getItem('token_key') || '',
    },
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('token_key', action.payload)
        }
    },
});


export const {setToken} = userSlice.actions;

export default userSlice.reducer;
