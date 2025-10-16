'use client'

import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import TerrainIcon from '@mui/icons-material/Terrain'
import {
    Alert,
    Box,
    Card,
    CardContent,
    CardMedia,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Skeleton,
    Typography,
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
          // API might be unavailable, show demo data
          setPhotos([])
          setError('Mars Rover Photos API currently unavailable. Displaying mission info.')
          return
        }
        const data = await response.json()
        setPhotos(data.photos ?? [])
        setError(null)
      } catch (err: any) {
        setError('Mars Rover Photos API currently unavailable. Displaying mission info.')
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

        {error && <Alert severity="error" sx={{ mt: 2 }}>Error loading Mars photos: {error}</Alert>}

        {error && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Grid container spacing={2}>
              {[
                {
                  name: 'Curiosity',
                  status: 'Active',
                  landing: '2012-08-06',
                  location: 'Gale Crater',
                  mission: 'Studying Mars climate and geology',
                },
                {
                  name: 'Perseverance',
                  status: 'Active',
                  landing: '2021-02-18',
                  location: 'Jezero Crater',
                  mission: 'Search for ancient life, collect samples',
                },
                {
                  name: 'Opportunity',
                  status: 'Ended',
                  landing: '2004-01-25',
                  location: 'Meridiani Planum',
                  mission: 'Completed 2004-2018 (14 years)',
                },
              ].map((roverInfo, idx) => (
                <Grid size={{ xs: 12, md: 4 }} key={idx}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid rgba(255, 0, 85, 0.3)',
                      borderRadius: 1,
                      bgcolor: 'rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <Typography variant="h6" sx={{ color: 'error.main', mb: 1 }}>
                      {roverInfo.name}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Status: <span style={{ color: roverInfo.status === 'Active' ? '#00ff00' : '#ffaa00' }}>{roverInfo.status}</span>
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Landing: {roverInfo.landing}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Location: {roverInfo.location}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
                        {roverInfo.mission}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
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
                    <CardMedia
                      component="img"
                      height="200"
                      image={photo.img_src}
                      alt={`Mars ${photo.camera}`}
                      sx={{
                        objectFit: 'cover',
                        borderBottom: '1px solid rgba(255, 0, 85, 0.3)',
                      }}
                    />
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
