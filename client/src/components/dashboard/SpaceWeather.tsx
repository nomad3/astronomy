'use client';

import { Alert, Box, Card, CardContent, Chip, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

interface SpaceWeatherNotification {
  messageType?: string;
  messageID?: string;
  messageURL?: string;
  messageIssueTime?: string;
  messageBody?: string;
}

const NotificationItem = ({ notification }) => {
  const getEventColor = (messageType?: string) => {
    if (!messageType) return 'info';
    const lower = messageType.toLowerCase();
    if (lower.includes('warning') || lower.includes('watch')) return 'warning';
    if (lower.includes('alert')) return 'error';
    return 'info';
  };

  return (
    <Box sx={{ p: 2, border: '1px solid', borderColor: 'secondary.main', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
            {notification.messageType}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {new Date(notification.messageIssueTime).toLocaleString()}
          </Typography>
        </Box>
        <Chip label="ACTIVE" size="small" color={getEventColor(notification.messageType)} />
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {notification.messageBody}
      </Typography>
    </Box>
  );
};

export default function SpaceWeather() {
  const [notifications, setNotifications] = useState<SpaceWeatherNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpaceWeather = async () => {
      try {
        const response = await fetch('/api/space-weather');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setNotifications(data.notifications ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceWeather();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WbSunnyIcon /> Space Weather Alerts
        </Typography>

        {loading && <Skeleton variant="rectangular" height={200} />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && notifications.length === 0 && (
          <Box sx={{ mt: 2, p: 3, textAlign: 'center', border: '1px solid', borderColor: 'success.main', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: 'success.main', mb: 1 }}>
              ALL CLEAR ✓
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No active space weather alerts. Solar conditions nominal.
            </Typography>
          </Box>
        )}

        {!loading && notifications.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {notifications.slice(0, 6).map((notification, index) => (
              <NotificationItem key={notification.messageID || index} notification={notification} />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
