import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import createClient, {type Middleware} from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";


export const setUser = createAsyncThunk("user/getUser", async ({token, userId}: { token: string, userId: string }) => {

        const client = createClient<openapi.paths>();
        const authMiddleware: Middleware = {
            async onRequest(req) {
                req.headers.set("Authorization", `Bearer ${token}`);
                return req;
            }
        }
        client.use(authMiddleware)
        const responseForUser = await client.GET("/api/user/{userId}", {
            params: {
                path: {
                    userId: userId
                }
            }
        })

        if (responseForUser.response.status == 200 && responseForUser.data !== undefined) {
            let userAuth;
            if (responseForUser.data.auth.sudo) {
                userAuth = "sudo"
            } else if (responseForUser.data.auth.roomAdmin) {
                userAuth = "roomAdmin"
            } else if (responseForUser.data.auth.airconAdmin) {
                userAuth = "airconAdmin"
            } else if (responseForUser.data.auth.billAdmin) {
                userAuth = "billAdmin"
            } else {
                userAuth = "guest"
            }

            return {
                userId: userId,
                auth: userAuth,
                name: responseForUser.data.name,
            };
        }

        return {
            userId: "",
            auth: "",
            name: ""
        };
    }
)


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: localStorage.getItem('token_key') || '',
        id: localStorage.getItem('user_id') || '',
        name: localStorage.getItem('user_name') || '',
        auth: localStorage.getItem('user_auth') || ''
    },
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('token_key', action.payload)
        },
        cleanState:(state) => {
            state.token = '';
            state.id = '';
            state.name = '';
            state.auth = '';
            localStorage.setItem('token_key', '')
            localStorage.setItem('user_id', '')
            localStorage.setItem('user_name', '')
            localStorage.setItem('user_auth', '')
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setUser.fulfilled, (state, action) => {
            state.id = action.payload.userId;
            state.name = action.payload.name;
            state.auth = action.payload.auth;
            localStorage.setItem('user_id', state.id)
            localStorage.setItem('user_auth', state.auth)
            localStorage.setItem('user_name', state.name)
        })
    },
});


export const {setToken,cleanState} = userSlice.actions;

export default userSlice.reducer;
