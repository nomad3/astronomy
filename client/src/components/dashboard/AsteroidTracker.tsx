'use client'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SpeedIcon from '@mui/icons-material/Speed'
import StraightenIcon from '@mui/icons-material/Straighten'
import TravelExploreIcon from '@mui/icons-material/TravelExplore'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Collapse,
    IconButton,
    Skeleton,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

interface Asteroid {
  id: string
  name: string
  close_approach_date: string
  is_potentially_hazardous: boolean
  estimated_diameter_km: number
  relative_velocity_kms: string
  miss_distance_km: string
}

export default function AsteroidTracker() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const response = await fetch('/api/asteroids?limit=10')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setAsteroids(data.asteroids ?? [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAsteroids()
  }, [])

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const formatNumber = (num: string | number) => {
    const value = typeof num === 'string' ? parseFloat(num) : num
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: 'warning.main',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textShadow: '0 0 10px rgba(255, 170, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <TravelExploreIcon /> NEAR-EARTH OBJECTS
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} height={70} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mt: 2 }}>Error loading asteroids: {error}</Alert>}

        {!loading && !error && asteroids.length === 0 && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            No near-Earth objects detected.
          </Typography>
        )}

        {!loading && asteroids.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            {asteroids.map((asteroid) => (
              <Box
                key={asteroid.id}
                sx={{
                  border: asteroid.is_potentially_hazardous
                    ? '1px solid rgba(255, 0, 85, 0.5)'
                    : '1px solid rgba(255, 170, 0, 0.3)',
                  borderRadius: 1,
                  bgcolor: asteroid.is_potentially_hazardous
                    ? 'rgba(255, 0, 85, 0.05)'
                    : 'rgba(0, 0, 0, 0.3)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: asteroid.is_potentially_hazardous ? 'error.main' : 'warning.main',
                    boxShadow: asteroid.is_potentially_hazardous
                      ? '0 0 15px rgba(255, 0, 85, 0.3)'
                      : '0 0 15px rgba(255, 170, 0, 0.2)',
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleExpand(asteroid.id)}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      {asteroid.is_potentially_hazardous && (
                        <WarningAmberIcon
                          sx={{
                            fontSize: 20,
                            color: 'error.main',
                            animation: 'pulse 2s ease-in-out infinite',
                          }}
                        />
                      )}
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: asteroid.is_potentially_hazardous ? 'error.main' : 'warning.main',
                          fontWeight: 600,
                        }}
                      >
                        {asteroid.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`APPROACH: ${new Date(asteroid.close_approach_date).toLocaleDateString()}`}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontFamily: 'Share Tech Mono',
                          bgcolor: 'rgba(255, 170, 0, 0.2)',
                          color: 'warning.main',
                        }}
                      />
                      {asteroid.is_potentially_hazardous && (
                        <Chip
                          label="HAZARDOUS"
                          size="small"
                          color="error"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontFamily: 'Share Tech Mono',
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{
                      transform: expanded[asteroid.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                      color: asteroid.is_potentially_hazardous ? 'error.main' : 'warning.main',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>

                <Collapse in={expanded[asteroid.id]} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      p: 2,
                      pt: 0,
                      borderTop: asteroid.is_potentially_hazardous
                        ? '1px solid rgba(255, 0, 85, 0.3)'
                        : '1px solid rgba(255, 170, 0, 0.2)',
                      bgcolor: 'rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(255, 170, 0, 0.3)',
                          borderRadius: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <StraightenIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            DIAMETER
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'warning.main',
                            fontFamily: 'Share Tech Mono',
                            fontSize: '1.1rem',
                          }}
                        >
                          {asteroid.estimated_diameter_km
                            ? `${formatNumber(asteroid.estimated_diameter_km)} km`
                            : 'N/A'}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(255, 170, 0, 0.3)',
                          borderRadius: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <SpeedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            VELOCITY
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'error.main',
                            fontFamily: 'Share Tech Mono',
                            fontSize: '1.1rem',
                          }}
                        >
                          {asteroid.relative_velocity_kms
                            ? `${formatNumber(asteroid.relative_velocity_kms)} km/s`
                            : 'N/A'}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(0, 255, 0, 0.3)',
                          borderRadius: 1,
                          gridColumn: '1 / -1',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <TravelExploreIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            MISS DISTANCE
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'success.main',
                            fontFamily: 'Share Tech Mono',
                            fontSize: '1.1rem',
                          }}
                        >
                          {asteroid.miss_distance_km
                            ? `${formatNumber(asteroid.miss_distance_km)} km`
                            : 'N/A'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                          {asteroid.miss_distance_km &&
                            `≈ ${(parseFloat(asteroid.miss_distance_km) / 384400).toFixed(2)} lunar distances`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
