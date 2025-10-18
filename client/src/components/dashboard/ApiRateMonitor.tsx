'use client';

import { Box, Card, CardContent, LinearProgress, Typography } from '@mui/material';
import ApiIcon from '@mui/icons-material/Api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function ApiRateMonitor() {
  const rateLimit = { limit: 1000, used: 237, remaining: 763, resetTime: '59:23' };
  const usagePercentage = (rateLimit.used / rateLimit.limit) * 100;

  const getStatusColor = () => {
    if (usagePercentage >= 80) return 'error.main';
    if (usagePercentage >= 60) return 'warning.main';
    return 'success.main';
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ApiIcon sx={{ color: 'accent.main' }} />
          <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            API Rate Monitor
          </Typography>
        </Box>

        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                NASA API USAGE
              </Typography>
              <Typography variant="h4" sx={{ color: getStatusColor(), fontWeight: 700 }}>
                {rateLimit.used}/{rateLimit.limit}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                REMAINING
              </Typography>
              <Typography variant="h5" sx={{ color: 'accent.main', fontWeight: 700 }}>
                {rateLimit.remaining}
              </Typography>
            </Box>
          </Box>

          <LinearProgress
            variant="determinate"
            value={usagePercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getStatusColor(),
              },
            }}
          />

          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
            RESET IN: {rateLimit.resetTime}
          </Typography>
        </Box>

        <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 18 }} />
          <Box>
            <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
              REDIS CACHE ACTIVE
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', display: 'block' }}>
              Responses cached: APOD (6h), NEO (1h), Weather (10m), Mars (12h)
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
