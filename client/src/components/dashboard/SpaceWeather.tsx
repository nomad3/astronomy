'use client'

import FlareIcon from '@mui/icons-material/Flare'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Skeleton,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

interface SpaceWeatherNotification {
  messageType?: string
  messageID?: string
  messageURL?: string
  messageIssueTime?: string
  messageBody?: string
}

export default function SpaceWeather() {
  const [notifications, setNotifications] = useState<SpaceWeatherNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSpaceWeather = async () => {
      try {
        const response = await fetch('/api/space-weather')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setNotifications(data.notifications ?? [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSpaceWeather()
  }, [])

  const getEventIcon = (messageType?: string) => {
    if (!messageType) return <NotificationsActiveIcon />
    const lower = messageType.toLowerCase()
    if (lower.includes('flare') || lower.includes('solar')) return <FlareIcon />
    if (lower.includes('cme') || lower.includes('coronal')) return <WbSunnyIcon />
    return <NotificationsActiveIcon />
  }

  const getEventColor = (messageType?: string) => {
    if (!messageType) return 'info'
    const lower = messageType.toLowerCase()
    if (lower.includes('warning') || lower.includes('watch')) return 'warning'
    if (lower.includes('alert')) return 'error'
    return 'info'
  }

  const formatMessageType = (type?: string) => {
    if (!type) return 'NOTIFICATION'
    return type.replace(/([A-Z])/g, ' $1').trim().toUpperCase()
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
          <WbSunnyIcon /> SPACE WEATHER ALERTS
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} height={90} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mt: 2 }}>Error loading space weather: {error}</Alert>}

        {!loading && !error && notifications.length === 0 && (
          <Box
            sx={{
              mt: 2,
              p: 3,
              textAlign: 'center',
              border: '1px solid rgba(0, 255, 0, 0.3)',
              borderRadius: 1,
              bgcolor: 'rgba(0, 255, 0, 0.05)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'success.main', mb: 1 }}>
              ALL CLEAR ✓
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No active space weather alerts. Solar conditions nominal.
            </Typography>
          </Box>
        )}

        {!loading && notifications.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {notifications.slice(0, 6).map((notification, index) => (
              <Box
                key={notification.messageID || index}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: `${getEventColor(notification.messageType)}.main`,
                  borderRadius: 1,
                  bgcolor: `rgba(255, 170, 0, 0.05)`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: `0 0 15px rgba(255, 170, 0, 0.3)`,
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 170, 0, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getEventIcon(notification.messageType)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'warning.main',
                        fontWeight: 700,
                        mb: 0.5,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {formatMessageType(notification.messageType)}
                    </Typography>
                    {notification.messageIssueTime && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontFamily: 'Share Tech Mono',
                          display: 'block',
                        }}
                      >
                        ISSUED: {new Date(notification.messageIssueTime).toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                  <Chip
                    label="ACTIVE"
                    size="small"
                    color={getEventColor(notification.messageType)}
                    sx={{
                      height: 22,
                      fontSize: '0.65rem',
                      fontFamily: 'Share Tech Mono',
                      fontWeight: 700,
                    }}
                  />
                </Box>

                {notification.messageBody && (
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: 'rgba(0, 0, 0, 0.4)',
                      borderLeft: '3px solid',
                      borderColor: 'warning.main',
                      borderRadius: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        fontSize: '0.8rem',
                        lineHeight: 1.6,
                        fontFamily: 'Rajdhani',
                      }}
                    >
                      {notification.messageBody.length > 200
                        ? `${notification.messageBody.substring(0, 200)}...`
                        : notification.messageBody}
                    </Typography>
                  </Box>
                )}

                {notification.messageID && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontFamily: 'Share Tech Mono',
                      fontSize: '0.65rem',
                      mt: 1,
                      display: 'block',
                    }}
                  >
                    ID: {notification.messageID}
                  </Typography>
                )}
              </Box>
            ))}

            <Box
              sx={{
                mt: 1,
                p: 1.5,
                bgcolor: 'rgba(255, 170, 0, 0.05)',
                border: '1px solid rgba(255, 170, 0, 0.3)',
                borderRadius: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Share Tech Mono' }}>
                ⚡ MONITORING SOLAR ACTIVITY • CONTINUOUS UPDATES FROM NASA DONKI
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
