'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box, Grid } from '@mui/material'

interface TelemetryData {
  label: string
  value: string
  unit: string
  color: string
}

export default function TelemetryPanel() {
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([
    { label: 'ALTITUDE', value: '400', unit: 'KM', color: '#00ffff' },
    { label: 'VELOCITY', value: '27580', unit: 'KM/H', color: '#00ff00' },
    { label: 'ORBITAL PERIOD', value: '92.68', unit: 'MIN', color: '#ffaa00' },
    { label: 'INCLINATION', value: '51.64', unit: 'DEG', color: '#ff00ff' },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => prev.map(item => ({
        ...item,
        value: item.label === 'VELOCITY' 
          ? (27580 + Math.random() * 20 - 10).toFixed(0)
          : item.label === 'ALTITUDE'
          ? (400 + Math.random() * 2 - 1).toFixed(2)
          : item.value
      })))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: 'primary.main',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
          }}
        >
          📡 TELEMETRY DATA
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {telemetry.map((item, index) => (
            <Grid size={{ xs: 6 }} key={index}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${item.color}40`,
                  borderRadius: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    bgcolor: item.color,
                    boxShadow: `0 0 10px ${item.color}`,
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  {item.label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.5 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: item.color,
                      fontFamily: 'Share Tech Mono',
                      fontWeight: 700,
                      textShadow: `0 0 10px ${item.color}`,
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: item.color,
                      opacity: 0.7,
                      fontSize: '0.7rem',
                    }}
                  >
                    {item.unit}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: 'rgba(0, 255, 0, 0.05)',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: 'success.main', fontFamily: 'Share Tech Mono', fontSize: '0.75rem' }}>
            → ALL SYSTEMS NOMINAL • DATA STREAM ACTIVE • TELEMETRY LOCKED
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

