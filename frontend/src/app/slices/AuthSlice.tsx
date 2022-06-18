import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, User } from '../split/auth';
import type { RootState } from '../store';

type AuthState = {
  user: User | null;
};

const slice = createSlice({
  name: 'auth',
  initialState: { user: null } as AuthState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state, action) => {
        state.user = null;
      })
      .addMatcher(
        authApi.endpoints.getLoggedUser.matchFulfilled,
        (state, action) => {
          state.user = action.payload;
        }
      )
      .addMatcher(
        authApi.endpoints.saveUserCity.matchFulfilled,
        (state, action) => {
          if (state.user)
            state.user.savedCity = {
              id: action.payload.savedCity,
              name: state.user?.savedCity?.name || '',
            };
        }
      );
  },
});

export const { setUser, clearUser } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const isUserAuthenticated = (state: RootState) =>
  state.auth.user !== null;
