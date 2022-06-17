import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import {
  selectChoosedHour,
  selectChoosedDay,
  setChoosedHour,
} from '../../../app/slices/WeatherSlice';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
} from 'recharts';
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart';

const WeatherHours = () => {
  const dispatch = useAppDispatch();
  const choosedHour = useAppSelector(selectChoosedHour);
  const choosedDay = useAppSelector(selectChoosedDay);

  const changeChoosedHour = (e: CategoricalChartState) => {
    const hourNumber = e.activeTooltipIndex;
    if (choosedDay && hourNumber !== choosedHour?.hourNumber) {
      const weatherHourNew = choosedDay.weatherHours.find(
        (weatherHour) => weatherHour.hourNumber === hourNumber
      );
      weatherHourNew && dispatch(setChoosedHour(weatherHourNew));
    }
  };

  return choosedDay?.weatherHours ? (
    <ResponsiveContainer width='100%' height={120}>
      <AreaChart
        data={choosedDay.weatherHours}
        onClick={changeChoosedHour}
        style={{ cursor: 'pointer' }}
      >
        <ReferenceDot
          r={6}
          style={{ zIndex: 100, position: 'relative' }}
          x={choosedHour?.hourNumber}
          y={choosedHour?.tempC}
          isFront={true}
          fill='#2c5282'
          stroke='none'
        />
        <ReferenceLine
          stroke='#2c5282'
          segment={[
            { x: choosedHour?.hourNumber, y: 0 },
            { x: choosedHour?.hourNumber, y: choosedHour?.tempC },
          ]}
        />
        <XAxis
          dataKey='hourNumber'
          interval='preserveStartEnd'
          minTickGap={8}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}:00`}
        />
        <Tooltip
          cursor={true}
          formatter={(value: any) => [`${value}°`, 'Temperature']}
        />
        <Area
          isAnimationActive={false}
          type='monotone'
          dataKey='tempC'
          stroke='#2c5282'
          strokeWidth={1.5}
          fill='#3182ce'
        />
      </AreaChart>
    </ResponsiveContainer>
  ) : null;
};

export default WeatherHours;
