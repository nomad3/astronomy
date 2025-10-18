'use client';

import { Alert, Box, Card, CardContent, Chip, Collapse, IconButton, LinearProgress, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Launch {
  id: string;
  name: string;
  status?: string;
  window_start?: string;
  window_end?: string;
  location?: string;
  provider?: string;
  mission?: string;
  mission_description?: string;
  orbit?: string;
  pad?: string;
  image?: string;
  webcast?: boolean;
}

const LaunchItem = ({ launch, expanded, onToggle }) => {
  const getStatusColor = (status?: string) => {
    if (!status) return 'default';
    const lower = status.toLowerCase();
    if (lower.includes('success')) return 'success';
    if (lower.includes('hold') || lower.includes('tbd') || lower.includes('tbc')) return 'warning';
    if (lower.includes('fail') || lower.includes('partial')) return 'error';
    if (lower.includes('go')) return 'info';
    return 'default';
  };

  const getTimeUntilLaunch = (windowStart?: string) => {
    if (!windowStart) return null;
    const now = new Date();
    const launchDate = new Date(windowStart);
    const diff = launchDate.getTime() - now.getTime();

    if (diff < 0) return 'COMPLETED';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `T-${days}D ${hours}H`;
    if (hours > 0) return `T-${hours}H ${minutes}M`;
    return `T-${minutes}M`;
  };

  const countdown = getTimeUntilLaunch(launch.window_start);

  return (
    <Box sx={{ border: '1px solid', borderColor: 'secondary.main', borderRadius: 2, overflow: 'hidden' }}>
      {countdown && countdown !== 'COMPLETED' && <LinearProgress variant="indeterminate" color="secondary" />}
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={onToggle}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {launch.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {launch.status && <Chip label={launch.status} size="small" color={getStatusColor(launch.status)} />}
            {launch.provider && <Chip label={launch.provider} size="small" variant="outlined" />}
            {countdown && <Chip label={countdown} size="small" color={countdown === 'COMPLETED' ? 'success' : 'warning'} />}
          </Box>
        </Box>
        <IconButton size="small" sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, pt: 0, borderTop: '1px solid', borderColor: 'secondary.main' }}>
          {launch.image && <Box component="img" src={launch.image} alt={launch.name} sx={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 1, mt: 1 }} />}
          <Typography variant="body2" sx={{ mt: 1 }}>
            {launch.mission_description}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
};

export default function LaunchCalendar() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const response = await fetch('/api/launches?limit=8');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setLaunches(data.launches ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon /> Launch Schedule
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} height={80} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {!loading && !error && launches.length === 0 && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            No upcoming launches found.
          </Typography>
        )}

        {!loading && launches.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            {launches.map((launch) => (
              <LaunchItem
                key={launch.id}
                launch={launch}
                expanded={expanded[launch.id]}
                onToggle={() => toggleExpand(launch.id)}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
