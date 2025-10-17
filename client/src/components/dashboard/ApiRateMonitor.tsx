'use client'

import ApiIcon from '@mui/icons-material/Api'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Box, Card, CardContent, LinearProgress, Typography } from '@mui/material'

export default function ApiRateMonitor() {
  // Simulated rate limit tracking (in production, this would come from backend)
  const rateLimit = {
    limit: 1000,
    used: 237,
    remaining: 763,
    resetTime: '59:23',
  }

  const usagePercentage = (rateLimit.used / rateLimit.limit) * 100

  const getStatusColor = () => {
    if (usagePercentage >= 80) return '#ff0055'
    if (usagePercentage >= 60) return '#ffaa00'
    return '#00ff00'
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ApiIcon sx={{ color: 'success.main' }} />
          <Typography
            variant="h6"
            sx={{
              color: 'success.main',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
            }}
          >
            API RATE MONITOR
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                NASA API USAGE
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: getStatusColor(),
                  fontFamily: 'Share Tech Mono',
                  fontWeight: 700,
                  textShadow: `0 0 10px ${getStatusColor()}`,
                }}
              >
                {rateLimit.used}/{rateLimit.limit}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                REMAINING
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'primary.main',
                  fontFamily: 'Share Tech Mono',
                  fontWeight: 700,
                }}
              >
                {rateLimit.remaining}
              </Typography>
            </Box>
          </Box>

          <LinearProgress
            variant="determinate"
            value={usagePercentage}
            sx={{
              height: 10,
              borderRadius: 1,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              '& .MuiLinearProgress-bar': {
                bgcolor: getStatusColor(),
                boxShadow: `0 0 10px ${getStatusColor()}`,
                borderRadius: 1,
              },
            }}
          />

          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'block',
              mt: 1,
              fontFamily: 'Share Tech Mono',
            }}
          >
            RESET IN: {rateLimit.resetTime}
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1.5,
            bgcolor: 'rgba(0, 255, 0, 0.05)',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
          <Box>
            <Typography variant="caption" sx={{ color: 'success.main', display: 'block', fontWeight: 700 }}>
              REDIS CACHE ACTIVE
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
              Responses cached: APOD (6h), NEO (1h), Weather (10m), Mars (12h)
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2,
            p: 1,
            bgcolor: 'rgba(0, 170, 255, 0.05)',
            border: '1px solid rgba(0, 170, 255, 0.3)',
            borderRadius: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'info.main',
              fontSize: '0.65rem',
              fontFamily: 'Share Tech Mono',
              display: 'block',
            }}
          >
            ℹ️ RATE LIMIT: 1,000 req/hour with personal API key
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
