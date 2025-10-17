'use client'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import WarningIcon from '@mui/icons-material/Warning'
import { Box, Card, CardContent, Chip, Grid, LinearProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

interface SystemStatus {
  name: string
  status: 'GO' | 'NO-GO' | 'CAUTION'
  value: string
}

export default function FlightDirectorConsole() {
  const [missionTime, setMissionTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [systems, setSystems] = useState<SystemStatus[]>([
    { name: 'PROPULSION', status: 'GO', value: '100%' },
    { name: 'LIFE SUPPORT', status: 'GO', value: 'NOMINAL' },
    { name: 'POWER SYSTEMS', status: 'GO', value: '98.7%' },
    { name: 'COMMUNICATIONS', status: 'GO', value: 'ACTIVE' },
    { name: 'GUIDANCE', status: 'GO', value: 'LOCKED' },
    { name: 'THERMAL', status: 'CAUTION', value: '21.3°C' },
    { name: 'DATA SYSTEMS', status: 'GO', value: 'ONLINE' },
    { name: 'CREW HEALTH', status: 'GO', value: 'NOMINAL' },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setMissionTime(prev => {
        let { days, hours, minutes, seconds } = prev
        seconds++
        if (seconds >= 60) {
          seconds = 0
          minutes++
        }
        if (minutes >= 60) {
          minutes = 0
          hours++
        }
        if (hours >= 24) {
          hours = 0
          days++
        }
        return { days, hours, minutes, seconds }
      })

      // Randomly update one system
      setSystems(prev => {
        const newSystems = [...prev]
        const randomIndex = Math.floor(Math.random() * newSystems.length)
        if (Math.random() > 0.95) {
          newSystems[randomIndex].status = 'CAUTION'
        } else if (Math.random() > 0.7) {
          newSystems[randomIndex].status = 'GO'
        }
        return newSystems
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'GO':
        return <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
      case 'CAUTION':
        return <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />
      case 'NO-GO':
        return <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GO':
        return '#00ff00'
      case 'CAUTION':
        return '#ffaa00'
      case 'NO-GO':
        return '#ff0055'
      default:
        return '#00ffff'
    }
  }

  const goCount = systems.filter(s => s.status === 'GO').length
  const totalSystems = systems.length

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
            }}
          >
            🎯 FLIGHT DIRECTOR CONSOLE
          </Typography>

          <Chip
            label={goCount === totalSystems ? 'ALL SYSTEMS GO' : 'CAUTION ADVISORY'}
            color={goCount === totalSystems ? 'success' : 'warning'}
            sx={{
              fontFamily: 'Share Tech Mono',
              fontWeight: 700,
              fontSize: '0.75rem',
              animation: goCount === totalSystems ? 'none' : 'pulse 2s ease-in-out infinite',
            }}
          />
        </Box>

        {/* Mission Elapsed Time */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(0, 255, 255, 0.5)',
            borderRadius: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            MISSION ELAPSED TIME (MET)
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: 'primary.main',
              fontFamily: 'Share Tech Mono',
              fontWeight: 700,
              textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
              letterSpacing: '0.1em',
            }}
          >
            {missionTime.days.toString().padStart(3, '0')}:
            {missionTime.hours.toString().padStart(2, '0')}:
            {missionTime.minutes.toString().padStart(2, '0')}:
            {missionTime.seconds.toString().padStart(2, '0')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Share Tech Mono' }}>
            DAYS : HOURS : MINUTES : SECONDS
          </Typography>
        </Box>

        {/* System Status Grid */}
        <Grid container spacing={1}>
          {systems.map((system, index) => (
            <Grid size={{ xs: 6, md: 3 }} key={index}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: `${getStatusColor(system.status)}10`,
                  border: `1px solid ${getStatusColor(system.status)}`,
                  borderRadius: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 0 15px ${getStatusColor(system.status)}40`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  {getStatusIcon(system.status)}
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                    }}
                  >
                    {system.name}
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    color: getStatusColor(system.status),
                    fontFamily: 'Share Tech Mono',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                >
                  {system.status}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.65rem',
                    fontFamily: 'Share Tech Mono',
                  }}
                >
                  {system.value}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Overall Status Bar */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              SYSTEMS READY: {goCount}/{totalSystems}
            </Typography>
            <Typography variant="caption" sx={{ color: 'success.main', fontFamily: 'Share Tech Mono' }}>
              {((goCount / totalSystems) * 100).toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(goCount / totalSystems) * 100}
            sx={{
              height: 10,
              borderRadius: 1,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '& .MuiLinearProgress-bar': {
                bgcolor: goCount === totalSystems ? 'success.main' : 'warning.main',
                boxShadow: `0 0 10px ${goCount === totalSystems ? '#00ff00' : '#ffaa00'}`,
              },
            }}
          />
        </Box>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: 'rgba(0, 255, 0, 0.05)',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            borderRadius: 1,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'success.main',
              fontFamily: 'Share Tech Mono',
              fontWeight: 600,
            }}
          >
            ✓ FLIGHT DIRECTOR: GO FOR ORBIT • ALL STATIONS REPORT GO
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

