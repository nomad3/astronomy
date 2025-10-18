'use client';

import { Alert, Box, Card, CardContent, Chip, Collapse, IconButton, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

interface Asteroid {
  id: string;
  name: string;
  close_approach_date: string;
  is_potentially_hazardous: boolean;
  estimated_diameter_km: number;
  relative_velocity_kms: string;
  miss_distance_km: string;
}

const AsteroidItem = ({ asteroid, expanded, onToggle }) => (
  <Box sx={{ border: '1px solid', borderColor: asteroid.is_potentially_hazardous ? 'error.main' : 'secondary.main', borderRadius: 2, overflow: 'hidden' }}>
    <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={onToggle}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: asteroid.is_potentially_hazardous ? 'error.main' : 'text.primary' }}>
          {asteroid.name}
        </Typography>
        <Chip label={`Approach: ${new Date(asteroid.close_approach_date).toLocaleDateString()}`} size="small" />
      </Box>
      {asteroid.is_potentially_hazardous && <WarningAmberIcon color="error" />}
      <IconButton size="small" sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
        <ExpandMoreIcon />
      </IconButton>
    </Box>
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <Box sx={{ p: 2, pt: 0, borderTop: '1px solid', borderColor: 'secondary.main' }}>
        <Typography variant="body2">Diameter: {asteroid.estimated_diameter_km.toFixed(2)} km</Typography>
        <Typography variant="body2">Velocity: {parseFloat(asteroid.relative_velocity_kms).toFixed(2)} km/s</Typography>
        <Typography variant="body2">Miss Distance: {parseFloat(asteroid.miss_distance_km).toLocaleString()} km</Typography>
      </Box>
    </Collapse>
  </Box>
);

export default function AsteroidTracker() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const response = await fetch('/api/asteroids?limit=10');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setAsteroids(data.asteroids ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAsteroids();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TravelExploreIcon /> Near-Earth Objects
        </Typography>
        {loading && <Skeleton variant="rectangular" height={200} />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && asteroids.length === 0 && <Typography>No near-Earth objects detected.</Typography>}
        {!loading && asteroids.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
            {asteroids.map(asteroid => (
              <AsteroidItem key={asteroid.id} asteroid={asteroid} expanded={expanded[asteroid.id]} onToggle={() => toggleExpand(asteroid.id)} />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
