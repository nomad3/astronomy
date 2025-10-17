'use client'

import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import TerrainIcon from '@mui/icons-material/Terrain'
import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Skeleton,
    Typography
} from '@mui/material'
import { useEffect, useState } from 'react'

interface MarsPhoto {
  id: number
  sol: number
  camera: string
  camera_name: string
  img_src: string
  earth_date: string
  rover: string
  rover_status: string
}

export default function MarsRoverGallery() {
  const [photos, setPhotos] = useState<MarsPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rover, setRover] = useState('curiosity')
  const [sol, setSol] = useState(1000)

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/mars/rover-photos?rover=${rover}&sol=${sol}&limit=12`)
        if (!response.ok) {
          setPhotos([])
          setError('Unable to fetch rover photos')
          return
        }
        const data = await response.json()
        setPhotos(data.photos ?? [])
        setError(data.demo ? 'Displaying demo data (Mars Rover Photos API temporarily unavailable)' : null)
      } catch (err: any) {
        setError('Unable to fetch rover photos')
        setPhotos([])
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [rover, sol])

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TerrainIcon sx={{ color: 'error.main' }} />
            <Typography
              variant="h6"
              sx={{
                color: 'error.main',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                textShadow: '0 0 10px rgba(255, 0, 85, 0.5)',
              }}
            >
              MARS ROVER IMAGES
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: 'text.secondary' }}>Rover</InputLabel>
              <Select
                value={rover}
                label="Rover"
                onChange={(e) => setRover(e.target.value)}
                sx={{
                  color: 'primary.main',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 255, 255, 0.3)',
                  },
                }}
              >
                <MenuItem value="curiosity">Curiosity</MenuItem>
                <MenuItem value="perseverance">Perseverance</MenuItem>
                <MenuItem value="opportunity">Opportunity</MenuItem>
                <MenuItem value="spirit">Spirit</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ color: 'text.secondary' }}>Sol</InputLabel>
              <Select
                value={sol}
                label="Sol"
                onChange={(e) => setSol(Number(e.target.value))}
                sx={{
                  color: 'primary.main',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 255, 255, 0.3)',
                  },
                }}
              >
                <MenuItem value={1000}>1000</MenuItem>
                <MenuItem value={2000}>2000</MenuItem>
                <MenuItem value={3000}>3000</MenuItem>
                <MenuItem value={3500}>3500</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {loading && (
          <Grid container spacing={2}>
            {[...Array(6)].map((_, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {error && (
          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            📡 {error} • Displaying rover metadata and camera information from Sol {sol}
          </Alert>
        )}

        {!loading && !error && photos.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              p: 4,
              border: '1px solid rgba(255, 0, 85, 0.3)',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No photos available for Sol {sol}. Try a different sol or rover.
            </Typography>
          </Box>
        )}

        {!loading && photos.length > 0 && (
          <>
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`ROVER: ${photos[0]?.rover || rover}`.toUpperCase()}
                size="small"
                sx={{ bgcolor: 'rgba(255, 0, 85, 0.2)', color: 'error.main', fontFamily: 'Share Tech Mono' }}
              />
              <Chip
                label={`SOL ${sol}`}
                size="small"
                sx={{ bgcolor: 'rgba(255, 170, 0, 0.2)', color: 'warning.main', fontFamily: 'Share Tech Mono' }}
              />
              {photos[0]?.earth_date && (
                <Chip
                  label={`EARTH DATE: ${photos[0].earth_date}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(0, 255, 255, 0.2)', color: 'primary.main', fontFamily: 'Share Tech Mono' }}
                />
              )}
            </Box>

            <Grid container spacing={2}>
              {photos.map((photo) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={photo.id}>
                  <Card
                    sx={{
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 0, 85, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'error.main',
                        boxShadow: '0 0 20px rgba(255, 0, 85, 0.3)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        height: 200,
                        borderBottom: '1px solid rgba(255, 0, 85, 0.3)',
                        background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(255, 0, 0, 0.2) 50%, rgba(70, 35, 10, 0.4) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `radial-gradient(circle at ${30 + (photo.id % 3) * 20}% ${40 + (photo.id % 2) * 20}%, rgba(255, 100, 0, 0.2) 0%, transparent 50%)`,
                        },
                      }}
                    >
                      <TerrainIcon sx={{ fontSize: 80, color: 'rgba(255, 0, 85, 0.3)', mb: 1 }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'error.main',
                          fontFamily: 'Share Tech Mono',
                          fontSize: '0.7rem',
                          textAlign: 'center',
                          px: 2,
                        }}
                      >
                        {photo.camera}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.6rem',
                          mt: 0.5,
                        }}
                      >
                        SOL {photo.sol}
                      </Typography>
                    </Box>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <CameraAltIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'error.main',
                            fontSize: '0.7rem',
                            fontFamily: 'Share Tech Mono',
                          }}
                        >
                          {photo.camera_name}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.65rem' }}>
                        {photo.camera}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                          {photo.earth_date}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  )
}
