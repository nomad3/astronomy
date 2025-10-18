'use client';

import { Alert, Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import TerrainIcon from '@mui/icons-material/Terrain';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';

interface MarsWeatherData {
  sol: string;
  temperature: any;
  wind: any;
  pressure: any;
  season: string;
}

const WeatherCard = ({ sol, temperature, wind, pressure, season }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
        SOL {sol}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThermostatIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" sx={{ flex: 1 }}>Temperature</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{temperature}°C</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AirIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" sx={{ flex: 1 }}>Wind</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{wind} m/s</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompressIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" sx={{ flex: 1 }}>Pressure</Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{pressure} Pa</Typography>
        </Box>
        {season && <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>{season}</Typography>}
      </Box>
    </CardContent>
  </Card>
);

export default function MarsWeather() {
  const [weather, setWeather] = useState<MarsWeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/mars/weather');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setWeather(data.weather_data ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const formatTemp = (tempData: any) => tempData?.av?.toFixed(1) || 'N/A';
  const formatWind = (windData: any) => windData?.av?.toFixed(1) || 'N/A';
  const formatPressure = (pressureData: any) => pressureData?.av?.toFixed(0) || 'N/A';

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TerrainIcon />
          <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Mars Weather Station
          </Typography>
        </Box>

        {loading && <Skeleton variant="rectangular" height={200} />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && weather.length === 0 && (
          <Typography sx={{ p: 3, textAlign: 'center' }}>
            InSight mission has ended. Historical data may be limited.
          </Typography>
        )}

        {!loading && weather.length > 0 && (
          <Grid container spacing={2}>
            {weather.slice(0, 7).map((sol, index) => (
              <Grid item xs={12} md={6} lg={4} key={sol.sol || index}>
                <WeatherCard
                  sol={sol.sol}
                  temperature={formatTemp(sol.temperature)}
                  wind={formatWind(sol.wind)}
                  pressure={formatPressure(sol.pressure)}
                  season={sol.season}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
