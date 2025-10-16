'use client'

import EventIcon from '@mui/icons-material/Event'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ImageIcon from '@mui/icons-material/Image'
import InfoIcon from '@mui/icons-material/Info'
import PlaceIcon from '@mui/icons-material/Place'
import RocketIcon from '@mui/icons-material/Rocket'
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    Collapse,
    IconButton,
    LinearProgress,
    Skeleton,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

interface Launch {
  id: string
  name: string
  status?: string
  window_start?: string
  window_end?: string
  location?: string
  provider?: string
  mission?: string
  mission_description?: string
  orbit?: string
  pad?: string
  image?: string
  webcast?: boolean
}

export default function LaunchCalendar() {
  const [launches, setLaunches] = useState<Launch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const response = await fetch('/api/launches?limit=8')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setLaunches(data.launches ?? [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLaunches()
  }, [])

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getStatusColor = (status?: string) => {
    if (!status) return 'default'
    const lower = status.toLowerCase()
    if (lower.includes('success')) return 'success'
    if (lower.includes('hold') || lower.includes('tbd') || lower.includes('tbc')) return 'warning'
    if (lower.includes('fail') || lower.includes('partial')) return 'error'
    if (lower.includes('go')) return 'info'
    return 'default'
  }

  const getTimeUntilLaunch = (windowStart?: string) => {
    if (!windowStart) return null
    const now = new Date()
    const launch = new Date(windowStart)
    const diff = launch.getTime() - now.getTime()

    if (diff < 0) return 'COMPLETED'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `T-${days}D ${hours}H`
    if (hours > 0) return `T-${hours}H ${minutes}M`
    return `T-${minutes}M`
  }

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: 'secondary.main',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <EventIcon /> LAUNCH SCHEDULE
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} height={80} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mt: 2 }}>Error loading launches: {error}</Alert>}

        {!loading && !error && launches.length === 0 && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            No upcoming launches found.
          </Typography>
        )}

        {!loading && launches.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            {launches.map((launch) => {
              const countdown = getTimeUntilLaunch(launch.window_start)

              return (
                <Box
                  key={launch.id}
                  sx={{
                    border: '1px solid rgba(255, 0, 255, 0.3)',
                    borderRadius: 1,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      boxShadow: '0 0 15px rgba(255, 0, 255, 0.2)',
                    },
                  }}
                >
                  {/* Countdown Bar */}
                  {countdown && countdown !== 'COMPLETED' && (
                    <LinearProgress
                      variant="indeterminate"
                      sx={{
                        height: 2,
                        bgcolor: 'rgba(255, 0, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'secondary.main',
                          boxShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
                        },
                      }}
                    />
                  )}

                  <Box
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleExpand(launch.id)}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: 'secondary.main',
                            fontWeight: 600,
                          }}
                        >
                          {launch.name}
                        </Typography>
                        {countdown && (
                          <Chip
                            label={countdown}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              fontFamily: 'Share Tech Mono',
                              fontWeight: 700,
                              bgcolor: countdown === 'COMPLETED' ? 'rgba(0, 255, 0, 0.2)' : 'rgba(255, 170, 0, 0.2)',
                              color: countdown === 'COMPLETED' ? 'success.main' : 'warning.main',
                              border: '1px solid',
                              borderColor: countdown === 'COMPLETED' ? 'success.main' : 'warning.main',
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {launch.status && (
                          <Chip
                            label={launch.status}
                            size="small"
                            color={getStatusColor(launch.status)}
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              fontFamily: 'Share Tech Mono',
                              fontWeight: 600,
                            }}
                          />
                        )}
                        {launch.provider && (
                          <Chip
                            label={launch.provider}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              borderColor: 'rgba(0, 255, 255, 0.5)',
                              color: 'primary.main',
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      sx={{
                        transform: expanded[launch.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                        color: 'secondary.main',
                      }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </Box>

                  <Collapse in={expanded[launch.id]} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        p: 2,
                        pt: 0,
                        borderTop: '1px solid rgba(255, 0, 255, 0.2)',
                        bgcolor: 'rgba(255, 0, 255, 0.02)',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {launch.window_start && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              WINDOW:
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'warning.main', fontFamily: 'Share Tech Mono' }}>
                              {new Date(launch.window_start).toLocaleString()}
                            </Typography>
                          </Box>
                        )}

                        {launch.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PlaceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              SITE:
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'info.main' }}>
                              {launch.location}
                            </Typography>
                          </Box>
                        )}

                        {launch.orbit && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <RocketIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              ORBIT:
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'secondary.main' }}>
                              {launch.orbit}
                            </Typography>
                          </Box>
                        )}

                        {launch.mission && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              MISSION:
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'primary.light' }}>
                              {launch.mission}
                            </Typography>
                          </Box>
                        )}

                        {launch.image && (
                          <Box
                            component="img"
                            src={launch.image}
                            alt={launch.name}
                            sx={{
                              width: '100%',
                              height: 150,
                              objectFit: 'cover',
                              borderRadius: 1,
                              mt: 1,
                              border: '1px solid rgba(255, 0, 255, 0.3)',
                            }}
                          />
                        )}

                        {launch.mission_description && (
                          <Box
                            sx={{
                              mt: 1,
                              p: 1.5,
                              bgcolor: 'rgba(0, 0, 0, 0.4)',
                              borderLeft: '3px solid',
                              borderColor: 'secondary.main',
                            }}
                          >
                            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                              MISSION DETAILS:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'text.primary',
                                fontSize: '0.8rem',
                                lineHeight: 1.6,
                              }}
                            >
                              {launch.mission_description.length > 250
                                ? `${launch.mission_description.substring(0, 250)}...`
                                : launch.mission_description}
                            </Typography>
                          </Box>
                        )}

                        {launch.webcast && (
                          <Chip
                            icon={<ImageIcon />}
                            label="WEBCAST AVAILABLE"
                            size="small"
                            color="success"
                            sx={{
                              alignSelf: 'flex-start',
                              fontFamily: 'Share Tech Mono',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              )
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
