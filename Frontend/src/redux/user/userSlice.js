import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
            
            // Persist user in localStorage
            localStorage.setItem("currentUser", JSON.stringify(action.payload));
        },        
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }, 
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
    },
});

export const { signInStart, signInSuccess, updateFailure, updateStart, updateSuccess, signInFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } = userSlice.actions;

export const userReducer = userSlice.reducer;