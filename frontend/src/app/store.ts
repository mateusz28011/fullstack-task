import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { authApi } from './split/auth';
import authReducer from './slices/AuthSlice';
import weatherReducer from './slices/WeatherSlice';
import { weatherApi } from './split/weather';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;

setupListeners(store.dispatch);
