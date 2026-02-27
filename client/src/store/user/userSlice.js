import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ── Sign In ──────────────────────────────────────────────────────────────
    signInStart: (state) => {
      state.loading = true;
      state.error = null; // ✅ Clear previous errors on new attempt
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ── Sign Up ──────────────────────────────────────────────────────────────
    signUpStart: (state) => {
      state.loading = true;
      state.error = null; // ✅ Clear previous errors on new attempt
    },
    signUpSuccess: (state) => {
      // ✅ FIXED: Don't store user in currentUser on signup
      // User must explicitly sign in after registering
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signUpFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ── Update User ──────────────────────────────────────────────────────────
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ── Delete User ──────────────────────────────────────────────────────────
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ── Sign Out ─────────────────────────────────────────────────────────────
    signoutUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signoutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signoutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} = userSlice.actions;

export default userSlice.reducer;