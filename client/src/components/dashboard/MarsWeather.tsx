'use client'

import AirIcon from '@mui/icons-material/Air'
import CompressIcon from '@mui/icons-material/Compress'
import TerrainIcon from '@mui/icons-material/Terrain'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Grid,
    Skeleton,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

interface MarsWeatherData {
  sol: string
  temperature: any
  wind: any
  pressure: any
  season: string
}

export default function MarsWeather() {
  const [weather, setWeather] = useState<MarsWeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/mars/weather')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setWeather(data.weather_data ?? [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  const formatTemp = (tempData: any) => {
    if (!tempData || !tempData.av) return 'N/A'
    return `${tempData.av.toFixed(1)}°C`
  }

  const formatWind = (windData: any) => {
    if (!windData || !windData.av) return 'N/A'
    return `${windData.av.toFixed(1)} m/s`
  }

  const formatPressure = (pressureData: any) => {
    if (!pressureData || !pressureData.av) return 'N/A'
    return `${pressureData.av.toFixed(0)} Pa`
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TerrainIcon sx={{ color: 'error.main' }} />
          <Typography
            variant="h6"
            sx={{
              color: 'error.main',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textShadow: '0 0 10px rgba(255, 0, 85, 0.5)',
            }}
          >
            MARS WEATHER STATION
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Chip
            label="INSIGHT LANDER • ELYSIUM PLANITIA"
            size="small"
            sx={{
              bgcolor: 'rgba(255, 0, 85, 0.2)',
              color: 'error.main',
              fontFamily: 'Share Tech Mono',
              fontSize: '0.65rem',
            }}
          />
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} height={120} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        )}

        {error && <Alert severity="error">Error loading Mars weather: {error}</Alert>}

        {!loading && !error && weather.length === 0 && (
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              border: '1px solid rgba(255, 170, 0, 0.3)',
              borderRadius: 1,
              bgcolor: 'rgba(255, 170, 0, 0.05)',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              InSight mission has ended. Historical data may be limited.
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Share Tech Mono' }}>
              Mission Duration: Nov 2018 - Dec 2022
            </Typography>
          </Box>
        )}

        {!loading && weather.length > 0 && (
          <Grid container spacing={2}>
            {weather.slice(0, 7).map((sol, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={sol.sol || index}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid rgba(255, 0, 85, 0.3)',
                    borderRadius: 1,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'error.main',
                      boxShadow: '0 0 15px rgba(255, 0, 85, 0.2)',
                    },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: 'error.main',
                      fontFamily: 'Share Tech Mono',
                      mb: 1.5,
                      fontWeight: 700,
                    }}
                  >
                    SOL {sol.sol}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ThermostatIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', flex: 1 }}>
                        TEMP
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#ffaa00',
                          fontFamily: 'Share Tech Mono',
                          fontWeight: 700,
                        }}
                      >
                        {formatTemp(sol.temperature)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AirIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', flex: 1 }}>
                        WIND
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#00ffff',
                          fontFamily: 'Share Tech Mono',
                          fontWeight: 700,
                        }}
                      >
                        {formatWind(sol.wind)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CompressIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', flex: 1 }}>
                        PRESSURE
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#ff00ff',
                          fontFamily: 'Share Tech Mono',
                          fontWeight: 700,
                        }}
                      >
                        {formatPressure(sol.pressure)}
                      </Typography>
                    </Box>

                    {sol.season && (
                      <Box
                        sx={{
                          mt: 1,
                          p: 1,
                          bgcolor: 'rgba(255, 0, 85, 0.1)',
                          border: '1px solid rgba(255, 0, 85, 0.3)',
                          borderRadius: 0.5,
                          textAlign: 'center',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'error.main',
                            fontSize: '0.65rem',
                            fontFamily: 'Share Tech Mono',
                          }}
                        >
                          {sol.season}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}
