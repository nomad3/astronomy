'use client'

import { Box, Card, CardContent, LinearProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import StatusIndicator from '../ui/StatusIndicator'

export default function SystemMonitor() {
  const [time, setTime] = useState<Date | null>(null)
  const [uptime, setUptime] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(new Date())

    const timer = setInterval(() => {
      setTime(new Date())
      setUptime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${days}D ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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
          ⚡ SYSTEM STATUS
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <StatusIndicator label="CORE SYSTEMS" status="online" value="OPERATIONAL" />
          <StatusIndicator label="NAVIGATION" status="online" value="LOCKED" />
          <StatusIndicator label="SENSORS" status="online" value="ACTIVE" />
          <StatusIndicator label="COMMUNICATIONS" status="online" value="NOMINAL" />
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 255, 255, 0.05)', border: '1px solid rgba(0, 255, 255, 0.2)' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
            MISSION CLOCK
          </Typography>
          {mounted && time ? (
            <>
              <Typography variant="h5" sx={{ color: 'primary.main', fontFamily: 'Share Tech Mono', textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}>
                {time.toISOString().split('T')[1].split('.')[0]} UTC
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                DATE: {time.toISOString().split('T')[0]}
              </Typography>
            </>
          ) : (
            <Typography variant="h5" sx={{ color: 'text.secondary', fontFamily: 'Share Tech Mono' }}>
              --:--:-- UTC
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            SYSTEM UPTIME: {formatUptime(uptime)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={100}
            sx={{
              mt: 1,
              height: 8,
              bgcolor: 'rgba(0, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'success.main',
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  )
}
