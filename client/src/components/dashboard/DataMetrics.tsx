'use client'

import PublicIcon from '@mui/icons-material/Public'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import SecurityIcon from '@mui/icons-material/Security'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

interface AnalyticsData {
  launches: {
    total: number
    providers: number
  }
  asteroids: {
    total: number
    hazardous: number
  }
  space_weather: {
    total_alerts: number
  }
  threat_level: string
}

export default function DataMetrics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics/overview')
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (err) {
        console.error('Error fetching analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    // Refresh every 2 minutes
    const interval = setInterval(fetchAnalytics, 120000)
    return () => clearInterval(interval)
  }, [])

  const metrics = [
    {
      title: 'UPCOMING LAUNCHES',
      value: analytics?.launches.total.toString() || '0',
      change: `${analytics?.launches.providers || 0} Providers`,
      isPositive: true,
      icon: <RocketLaunchIcon />,
      color: '#00ffff',
    },
    {
      title: 'NEAR-EARTH OBJECTS',
      value: analytics?.asteroids.total.toString() || '0',
      change: `${analytics?.asteroids.hazardous || 0} Hazardous`,
      isPositive: (analytics?.asteroids.hazardous || 0) === 0,
      icon: <PublicIcon />,
      color: '#ffaa00',
    },
    {
      title: 'SPACE WEATHER ALERTS',
      value: analytics?.space_weather.total_alerts.toString() || '0',
      change: 'Active Notifications',
      isPositive: (analytics?.space_weather.total_alerts || 0) < 5,
      icon: <WarningAmberIcon />,
      color: '#ff00ff',
    },
    {
      title: 'THREAT LEVEL',
      value: analytics?.threat_level || 'UNKNOWN',
      change: 'NOMINAL',
      isPositive: analytics?.threat_level === 'LOW',
      icon: <SecurityIcon />,
      color: analytics?.threat_level === 'LOW' ? '#00ff00' : analytics?.threat_level === 'MEDIUM' ? '#ffaa00' : '#ff0055',
    },
  ]

  if (loading) {
    return (
      <Grid container spacing={2}>
        {[...Array(4)].map((_, idx) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={idx}>
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 1 }} />
          </Grid>
        ))}
      </Grid>
    )
  }

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
                  <TrendingDownIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
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
