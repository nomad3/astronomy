'use client';

import { Box, Typography, LinearProgress } from '@mui/material';
import { Rocket } from 'lucide-react';

const MissionOverview = () => {
  const missions = [
    { name: 'Mars Rover Perseverance', progress: 80 },
    { name: 'James Webb Telescope', progress: 60 },
    { name: 'Artemis I', progress: 40 },
  ];

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Mission Overview
      </Typography>
      {missions.map((mission, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Rocket size={18} style={{ marginRight: '8px' }} />
            <Typography variant="body2">{mission.name}</Typography>
          </Box>
          <LinearProgress variant="determinate" value={mission.progress} />
        </Box>
      ))}
    </Box>
  );
};

export default MissionOverview;