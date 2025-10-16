'use client'

import { Box, Typography } from '@mui/material'

interface StatusIndicatorProps {
  label: string
  status: 'online' | 'warning' | 'critical' | 'standby'
  value?: string
}

export default function StatusIndicator({ label, status, value }: StatusIndicatorProps) {
  const getColor = () => {
    switch (status) {
      case 'online': return '#00ff00'
      case 'warning': return '#ffaa00'
      case 'critical': return '#ff0055'
      case 'standby': return '#0088ff'
      default: return '#00ffff'
    }
  }

  const color = getColor()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          bgcolor: color,
          boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.5 },
          },
        }}
      />
      <Box>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textTransform: 'uppercase',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
          }}
        >
          {label}
        </Typography>
        {value && (
          <Typography
            variant="body2"
            sx={{
              color,
              fontWeight: 600,
              fontSize: '0.9rem',
              textShadow: `0 0 10px ${color}`,
            }}
          >
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

