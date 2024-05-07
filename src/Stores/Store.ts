import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./UserSlice.ts";

export const store =  configureStore({
    reducer: {
        userInfo: userReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
