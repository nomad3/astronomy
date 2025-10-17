'use client'

import ImageModal from '@/components/ui/ImageModal'
import DateRangeIcon from '@mui/icons-material/DateRange'
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
    Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'

interface TelescopeImage {
  nasa_id: string
  title: string
  description: string
  date_created: string
  keywords: string[]
  image_url: string
  photographer?: string
  center?: string
}

interface Props {
  telescope: 'jwst' | 'hubble' | 'probes'
  title: string
  icon: React.ReactNode
  color: string
}

export default function TelescopeGallery({ telescope, title, icon, color }: Props) {
  const [images, setImages] = useState<TelescopeImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [probe, setProbe] = useState('voyager')
  const [selectedImage, setSelectedImage] = useState<TelescopeImage | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleImageClick = (image: TelescopeImage) => {
    setSelectedImage(image)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedImage(null)
  }

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      try {
        const endpoint = telescope === 'probes'
          ? `/api/telescopes/probes?probe=${probe}&limit=12`
          : `/api/telescopes/${telescope}?limit=12`

        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setImages(data.images ?? [])
        setError(null)
      } catch (err: any) {
        setError(err.message)
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [telescope, probe])

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color }}>{icon}</Box>
            <Typography
              variant="h6"
              sx={{
                color,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                textShadow: `0 0 10px ${color}`,
              }}
            >
              {title}
            </Typography>
          </Box>

          {telescope === 'probes' && (
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel sx={{ color: 'text.secondary' }}>Space Probe</InputLabel>
              <Select
                value={probe}
                label="Space Probe"
                onChange={(e) => setProbe(e.target.value)}
                sx={{
                  color: 'primary.main',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 255, 255, 0.3)',
                  },
                }}
              >
                <MenuItem value="voyager">Voyager 1 & 2</MenuItem>
                <MenuItem value="cassini">Cassini</MenuItem>
                <MenuItem value="new horizons">New Horizons</MenuItem>
                <MenuItem value="juno">Juno</MenuItem>
                <MenuItem value="parker solar probe">Parker Solar Probe</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>

        {loading && (
          <Grid container spacing={2}>
            {[...Array(6)].map((_, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Unable to load {title} images. NASA Image Library may be temporarily unavailable.
          </Alert>
        )}

        {!loading && !error && images.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              p: 4,
              border: `1px solid ${color}40`,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No images available. Try again later or select different options.
            </Typography>
          </Box>
        )}

        {!loading && images.length > 0 && (
          <>
            <Grid container spacing={2}>
              {images.map((img, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={img.nasa_id || index}>
                  <Card
                    onClick={() => handleImageClick(img)}
                    sx={{
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      border: `1px solid ${color}40`,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: color,
                        boxShadow: `0 0 20px ${color}40`,
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                  {img.image_url && (
                    <Box
                      sx={{
                        height: 180,
                        overflow: 'hidden',
                        borderBottom: `1px solid ${color}40`,
                        bgcolor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={img.image_url}
                        alt={img.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  )}
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color,
                        mb: 1,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {img.title}
                    </Typography>

                    {img.description && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.7rem',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1,
                        }}
                      >
                        {img.description}
                      </Typography>
                    )}

                    <Box sx={{ mt: 'auto' }}>
                      {img.date_created && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <DateRangeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                            {new Date(img.date_created).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                      {img.keywords && img.keywords.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                          {img.keywords.slice(0, 2).map((keyword, idx) => (
                            <Chip
                              key={idx}
                              label={keyword}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.6rem',
                                bgcolor: `${color}20`,
                                color,
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            </Grid>

            {/* Image Modal */}
            {selectedImage && (
              <ImageModal
                open={modalOpen}
                onClose={handleCloseModal}
                title={selectedImage.title}
                imageUrl={selectedImage.image_url}
                description={selectedImage.description}
                date={selectedImage.date_created}
                keywords={selectedImage.keywords}
                metadata={
                  selectedImage.photographer || selectedImage.center
                    ? {
                        ...(selectedImage.photographer ? { Photographer: selectedImage.photographer } : {}),
                        ...(selectedImage.center ? { Center: selectedImage.center } : {}),
                        'NASA ID': selectedImage.nasa_id,
                      }
                    : { 'NASA ID': selectedImage.nasa_id }
                }
              />
            )}
          </>
        )}

        <Box
          sx={{
            mt: 2,
            p: 1,
            bgcolor: `${color}10`,
            border: `1px solid ${color}40`,
            borderRadius: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Share Tech Mono', fontSize: '0.65rem' }}>
            🔭 {images.length} IMAGES FROM NASA IMAGE AND VIDEO LIBRARY • {telescope === 'probes' ? probe.toUpperCase() : title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
