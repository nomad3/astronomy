'use client'

import PublicIcon from '@mui/icons-material/Public'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'
import SecurityIcon from '@mui/icons-material/Security'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

interface MetricData {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: React.ReactNode
  color: string
}

export default function DataMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      title: 'ACTIVE MISSIONS',
      value: '847',
      change: '+12.5%',
      isPositive: true,
      icon: <RocketLaunchIcon />,
      color: '#00ffff',
    },
    {
      title: 'SATELLITES TRACKED',
      value: '5,432',
      change: '+8.2%',
      isPositive: true,
      icon: <SatelliteAltIcon />,
      color: '#ff00ff',
    },
    {
      title: 'NEAR-EARTH OBJECTS',
      value: '127',
      change: '-3.1%',
      isPositive: false,
      icon: <PublicIcon />,
      color: '#ffaa00',
    },
    {
      title: 'THREAT LEVEL',
      value: 'LOW',
      change: 'NOMINAL',
      isPositive: true,
      icon: <SecurityIcon />,
      color: '#00ff00',
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        if (metric.title === 'ACTIVE MISSIONS') {
          const val = parseInt(metric.value) + Math.floor(Math.random() * 3 - 1)
          return { ...metric, value: val.toString() }
        }
        if (metric.title === 'SATELLITES TRACKED') {
          const val = parseInt(metric.value.replace(',', '')) + Math.floor(Math.random() * 5 - 2)
          return { ...metric, value: val.toLocaleString() }
        }
        return metric
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Grid container spacing={2}>
      {metrics.map((metric, index) => (
        <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
          <Card
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid',
              borderColor: `${metric.color}40`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                bgcolor: metric.color,
                boxShadow: `0 0 10px ${metric.color}`,
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.65rem',
                  }}
                >
                  {metric.title}
                </Typography>
                <Box
                  sx={{
                    color: metric.color,
                    opacity: 0.7,
                    '& svg': { fontSize: 20 },
                  }}
                >
                  {metric.icon}
                </Box>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  color: metric.color,
                  fontFamily: 'Share Tech Mono',
                  fontWeight: 700,
                  mb: 1,
                  textShadow: `0 0 10px ${metric.color}`,
                }}
              >
                {metric.value}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {metric.isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 14, color: 'error.main' }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: metric.isPositive ? 'success.main' : 'error.main',
                    fontFamily: 'Share Tech Mono',
                    fontSize: '0.7rem',
                  }}
                >
                  {metric.change}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
