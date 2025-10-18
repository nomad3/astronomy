'use client';

import { Alert, Box, Card, CardContent, Chip, Collapse, IconButton, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';
import BusinessIcon from '@mui/icons-material/Business';

interface Mission {
  id: string;
  name: string;
  status?: string;
  launch_vehicle?: string;
  window_start?: string;
  launch_provider?: string;
  mission_description?: string;
  orbit?: string;
  pad?: string;
  location?: string;
}

const MissionItem = ({ mission, expanded, onToggle }) => {
  const getStatusColor = (status?: string) => {
    if (!status) return 'default';
    const lower = status.toLowerCase();
    if (lower.includes('success') || lower.includes('go')) return 'success';
    if (lower.includes('hold') || lower.includes('delay')) return 'warning';
    if (lower.includes('fail') || lower.includes('abort')) return 'error';
    return 'info';
  };

  return (
    <Box sx={{ border: '1px solid', borderColor: 'secondary.main', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={onToggle}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {mission.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {mission.status && <Chip label={mission.status} size="small" color={getStatusColor(mission.status)} />}
            {mission.launch_provider && <Chip label={mission.launch_provider} size="small" variant="outlined" />}
          </Box>
        </Box>
        <IconButton size="small" sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, pt: 0, borderTop: '1px solid', borderColor: 'secondary.main' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {mission.launch_vehicle && (
              <Typography variant="caption">
                VEHICLE: {mission.launch_vehicle}
              </Typography>
            )}
            {mission.window_start && (
              <Typography variant="caption">
                LAUNCH: {new Date(mission.window_start).toLocaleString()}
              </Typography>
            )}
            {mission.location && (
              <Typography variant="caption">
                LOCATION: {mission.location}
              </Typography>
            )}
            {mission.orbit && (
              <Typography variant="caption">
                ORBIT: {mission.orbit}
              </Typography>
            )}
            {mission.mission_description && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {mission.mission_description}
              </Typography>
            )}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default function MissionStatus() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await fetch('/api/missions?limit=8');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setMissions(data.missions ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RocketLaunchIcon /> Mission Status
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} height={80} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {!loading && !error && missions.length === 0 && (
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            No missions available.
          </Typography>
        )}

        {!loading && missions.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            {missions.map((mission) => (
              <MissionItem
                key={mission.id}
                mission={mission}
                expanded={expanded[mission.id]}
                onToggle={() => toggleExpand(mission.id)}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
