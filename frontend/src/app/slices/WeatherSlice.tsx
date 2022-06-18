import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetWeatherRequest, WeatherDay, WeatherHour } from '../split/weather';
import type { RootState } from '../store';

type WeatherState = {
  lastGetWeatherQueryPayload: GetWeatherRequest | null;
  choosedDay: WeatherDay | null;
  choosedHour: WeatherHour | null;
};

const slice = createSlice({
  name: 'weather',
  initialState: {
    lastGetWeatherQueryPayload: null,
    choosedDay: null,
    choosedHour: null,
  } as WeatherState,
  reducers: {
    setLastGetWeatherQueryPayload: (
      state,
      action: PayloadAction<GetWeatherRequest>
    ) => {
      state.lastGetWeatherQueryPayload = action.payload;
    },
    setChoosedDay: (state, action: PayloadAction<WeatherDay>) => {
      state.choosedDay = action.payload;
    },
    setChoosedHour: (state, action: PayloadAction<WeatherHour>) => {
      state.choosedHour = action.payload;
    },
  },
});

export const { setLastGetWeatherQueryPayload, setChoosedDay, setChoosedHour } =
  slice.actions;

export default slice.reducer;

export const selectLastGetWeatherQueryPayload = (state: RootState) =>
  state.weather.lastGetWeatherQueryPayload;
export const selectChoosedDay = (state: RootState) => state.weather.choosedDay;
export const selectChoosedHour = (state: RootState) =>
  state.weather.choosedHour;
