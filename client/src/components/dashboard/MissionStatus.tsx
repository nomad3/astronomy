'use client'

import AccessTimeIcon from '@mui/icons-material/AccessTime'
import BusinessIcon from '@mui/icons-material/Business'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PublicIcon from '@mui/icons-material/Public'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
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

interface Mission {
  id: string
  name: string
  status?: string
  launch_vehicle?: string
  window_start?: string
  launch_provider?: string
  mission_description?: string
  orbit?: string
  pad?: string
  location?: string
}

export default function MissionStatus() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await fetch('/api/missions?limit=8')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMissions(data.missions ?? [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMissions()
  }, [])

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getStatusColor = (status?: string) => {
    if (!status) return 'default'
    const lower = status.toLowerCase()
    if (lower.includes('success') || lower.includes('go')) return 'success'
    if (lower.includes('hold') || lower.includes('delay')) return 'warning'
    if (lower.includes('fail') || lower.includes('abort')) return 'error'
    return 'info'
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
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <RocketLaunchIcon /> MISSION STATUS
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} height={80} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mt: 2 }}>Error loading missions: {error}</Alert>}

        {!loading && !error && missions.length === 0 && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            No missions available.
          </Typography>
        )}

        {!loading && missions.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            {missions.map((mission) => (
              <Box
                key={mission.id}
                sx={{
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  borderRadius: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.3)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.2)',
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
                  onClick={() => toggleExpand(mission.id)}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {mission.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {mission.status && (
                        <Chip
                          label={mission.status}
                          size="small"
                          color={getStatusColor(mission.status)}
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontFamily: 'Share Tech Mono',
                            fontWeight: 600,
                          }}
                        />
                      )}
                      {mission.launch_provider && (
                        <Chip
                          label={mission.launch_provider}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            borderColor: 'rgba(255, 0, 255, 0.5)',
                            color: 'secondary.main',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{
                      transform: expanded[mission.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                      color: 'primary.main',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>

                <Collapse in={expanded[mission.id]} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      p: 2,
                      pt: 0,
                      borderTop: '1px solid rgba(0, 255, 255, 0.2)',
                      bgcolor: 'rgba(0, 255, 255, 0.02)',
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {mission.launch_vehicle && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <RocketLaunchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            VEHICLE:
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'primary.light' }}>
                            {mission.launch_vehicle}
                          </Typography>
                        </Box>
                      )}

                      {mission.window_start && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            LAUNCH:
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'warning.main', fontFamily: 'Share Tech Mono' }}>
                            {new Date(mission.window_start).toLocaleString()}
                          </Typography>
                        </Box>
                      )}

                      {mission.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PublicIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            LOCATION:
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'info.main' }}>
                            {mission.location}
                          </Typography>
                        </Box>
                      )}

                      {mission.orbit && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            ORBIT:
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'secondary.main' }}>
                            {mission.orbit}
                          </Typography>
                        </Box>
                      )}

                      {mission.mission_description && (
                        <Box
                          sx={{
                            mt: 1,
                            p: 1.5,
                            bgcolor: 'rgba(0, 0, 0, 0.4)',
                            borderLeft: '3px solid',
                            borderColor: 'primary.main',
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                            MISSION BRIEF:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.primary',
                              fontSize: '0.8rem',
                              lineHeight: 1.6,
                            }}
                          >
                            {mission.mission_description.length > 200
                              ? `${mission.mission_description.substring(0, 200)}...`
                              : mission.mission_description}
                          </Typography>
                        </Box>
                      )}
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
