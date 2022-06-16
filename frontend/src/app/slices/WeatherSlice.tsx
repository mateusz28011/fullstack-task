import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetWeatherRequest } from '../split/weather';
import type { RootState } from '../store';

type WeatherState = {
  lastGetWeatherQueryPayload: GetWeatherRequest | null;
};

const slice = createSlice({
  name: 'weather',
  initialState: { lastGetWeatherQueryPayload: null } as WeatherState,
  reducers: {
    setLastGetWeatherQueryPayload: (
      state,
      action: PayloadAction<GetWeatherRequest>
    ) => {
      state.lastGetWeatherQueryPayload = action.payload;
    },
  },
});

export const { setLastGetWeatherQueryPayload } = slice.actions;

export default slice.reducer;

export const selectLastGetWeatherQueryPayload = (state: RootState) =>
  state.weather.lastGetWeatherQueryPayload;
