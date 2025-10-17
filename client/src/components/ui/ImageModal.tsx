'use client'

import CloseIcon from '@mui/icons-material/Close'
import DateRangeIcon from '@mui/icons-material/DateRange'
import { Box, Chip, Dialog, DialogContent, IconButton, Typography } from '@mui/material'

interface ImageModalProps {
  open: boolean
  onClose: () => void
  title: string
  imageUrl: string
  description?: string
  date?: string
  keywords?: string[]
  metadata?: Record<string, any>
}

export default function ImageModal({
  open,
  onClose,
  title,
  imageUrl,
  description,
  date,
  keywords,
  metadata,
}: ImageModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(10, 14, 39, 0.98)',
          border: '2px solid rgba(0, 255, 255, 0.5)',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)',
          borderRadius: 2,
        },
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'primary.main',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
          '&:hover': {
            bgcolor: 'rgba(0, 255, 255, 0.2)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        {/* Image */}
        <Box
          sx={{
            width: '100%',
            maxHeight: '60vh',
            overflow: 'hidden',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottom: '2px solid rgba(0, 255, 255, 0.3)',
          }}
        >
          <img
            src={imageUrl}
            alt={title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '60vh',
              objectFit: 'contain',
            }}
          />
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: 'primary.main',
              mb: 2,
              fontWeight: 700,
              textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
            }}
          >
            {title}
          </Typography>

          {date && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <DateRangeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'Share Tech Mono' }}>
                {new Date(date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
            </Box>
          )}

          {description && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(0, 255, 255, 0.05)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'text.primary',
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                }}
              >
                {description}
              </Typography>
            </Box>
          )}

          {keywords && keywords.length > 0 && (
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Keywords:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {keywords.map((keyword, idx) => (
                  <Chip
                    key={idx}
                    label={keyword}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0, 255, 255, 0.1)',
                      color: 'primary.main',
                      border: '1px solid rgba(0, 255, 255, 0.3)',
                      fontFamily: 'Share Tech Mono',
                      fontSize: '0.7rem',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {metadata && Object.keys(metadata).length > 0 && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(0, 255, 255, 0.2)',
                borderRadius: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'block',
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Metadata:
              </Typography>
              {Object.entries(metadata).map(([key, value]) => (
                <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {key}:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'primary.light', fontFamily: 'Share Tech Mono' }}
                  >
                    {String(value)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

