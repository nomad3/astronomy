'use client'

import PublicIcon from '@mui/icons-material/Public'
import SatelliteIcon from '@mui/icons-material/Satellite'
import {
    Alert,
    Box,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Grid,
    Skeleton,
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

interface EPICImage {
  identifier: string
  caption: string
  image: string
  date: string
  image_url: string
  centroid_coordinates: {
    lat: number
    lon: number
  }
}

export default function EarthViewer() {
  const [images, setImages] = useState<EPICImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/earth/epic?limit=6')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setImages(data.images ?? [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [])

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <PublicIcon sx={{ color: 'info.main' }} />
          <Typography
            variant="h6"
            sx={{
              color: 'info.main',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textShadow: '0 0 10px rgba(0, 170, 255, 0.5)',
            }}
          >
            EPIC EARTH OBSERVATORY
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<SatelliteIcon />}
            label="DSCOVR SATELLITE • L1 LAGRANGE POINT • 1.5M KM FROM EARTH"
            size="small"
            sx={{
              bgcolor: 'rgba(0, 170, 255, 0.2)',
              color: 'info.main',
              fontFamily: 'Share Tech Mono',
              fontSize: '0.65rem',
            }}
          />
        </Box>

        {loading && (
          <Grid container spacing={2}>
            {[...Array(6)].map((_, idx) => (
              <Grid size={{ xs: 12, md: 6 }} key={idx}>
                <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {error && <Alert severity="error">Error loading Earth images: {error}</Alert>}

        {!loading && !error && images.length === 0 && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No EPIC images available at this time.
          </Typography>
        )}

        {!loading && images.length > 0 && (
          <Grid container spacing={2}>
            {images.map((img, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={img.identifier || index}>
                <Card
                  sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(0, 170, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'info.main',
                      boxShadow: '0 0 20px rgba(0, 170, 255, 0.3)',
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  {img.image_url && (
                    <CardMedia
                      component="img"
                      height="250"
                      image={img.image_url}
                      alt={img.caption || 'Earth from EPIC'}
                      sx={{
                        objectFit: 'cover',
                        borderBottom: '1px solid rgba(0, 170, 255, 0.3)',
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'info.main',
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      {img.caption || 'Earth View'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {img.date && (
                        <Chip
                          label={new Date(img.date).toLocaleDateString()}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.6rem',
                            bgcolor: 'rgba(0, 170, 255, 0.2)',
                            color: 'info.main',
                            fontFamily: 'Share Tech Mono',
                          }}
                        />
                      )}
                      {img.centroid_coordinates && (
                        <Chip
                          label={`${img.centroid_coordinates.lat.toFixed(2)}°, ${img.centroid_coordinates.lon.toFixed(2)}°`}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.6rem',
                            bgcolor: 'rgba(0, 255, 255, 0.2)',
                            color: 'primary.main',
                            fontFamily: 'Share Tech Mono',
                          }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}
