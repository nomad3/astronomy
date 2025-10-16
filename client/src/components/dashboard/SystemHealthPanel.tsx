'use client'

import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import MemoryIcon from '@mui/icons-material/Memory'
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck'
import SpeedIcon from '@mui/icons-material/Speed'
import StorageIcon from '@mui/icons-material/Storage'
import { Box, Card, CardContent, LinearProgress, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

interface SystemMetric {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  unit: string
}

export default function SystemHealthPanel() {
  const [mounted, setMounted] = useState(false)
  const [lastCheck, setLastCheck] = useState<string>('')
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { label: 'CPU USAGE', value: 45, icon: <MemoryIcon />, color: '#00ffff', unit: '%' },
    { label: 'MEMORY', value: 62, icon: <StorageIcon />, color: '#ff00ff', unit: '%' },
    { label: 'NETWORK', value: 88, icon: <NetworkCheckIcon />, color: '#00ff00', unit: '%' },
    { label: 'BANDWIDTH', value: 73, icon: <SpeedIcon />, color: '#ffaa00', unit: 'Mbps' },
  ])

  useEffect(() => {
    setMounted(true)
    setLastCheck(new Date().toLocaleTimeString())

    const interval = setInterval(() => {
      setMetrics(prev =>
        prev.map(metric => ({
          ...metric,
          value: Math.max(20, Math.min(95, metric.value + Math.random() * 10 - 5)),
        }))
      )
      setLastCheck(new Date().toLocaleTimeString())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (value: number) => {
    if (value >= 85) return '#ff0055'
    if (value >= 70) return '#ffaa00'
    return '#00ff00'
  }

  const getStatusText = (value: number) => {
    if (value >= 85) return 'CRITICAL'
    if (value >= 70) return 'WARNING'
    return 'NOMINAL'
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <HealthAndSafetyIcon sx={{ color: 'success.main' }} />
          <Typography
            variant="h6"
            sx={{
              color: 'success.main',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
            }}
          >
            SYSTEM HEALTH
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {metrics.map((metric, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: metric.color, '& svg': { fontSize: 18 } }}>{metric.icon}</Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {metric.label}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: metric.color,
                      fontFamily: 'Share Tech Mono',
                      fontWeight: 700,
                    }}
                  >
                    {metric.value.toFixed(1)}{metric.unit}
                  </Typography>
                  <Box
                    sx={{
                      px: 1,
                      py: 0.3,
                      bgcolor: `${getStatusColor(metric.value)}20`,
                      border: '1px solid',
                      borderColor: getStatusColor(metric.value),
                      borderRadius: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: getStatusColor(metric.value),
                        fontSize: '0.6rem',
                        fontFamily: 'Share Tech Mono',
                        fontWeight: 700,
                      }}
                    >
                      {getStatusText(metric.value)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={metric.value}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: metric.color,
                    boxShadow: `0 0 10px ${metric.color}`,
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: 'rgba(0, 255, 0, 0.05)',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            borderRadius: 1,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'success.main',
              fontFamily: 'Share Tech Mono',
              mb: 0.5,
            }}
          >
            ALL SYSTEMS OPERATIONAL
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            LAST CHECK: {mounted ? lastCheck : '--:--:--'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
