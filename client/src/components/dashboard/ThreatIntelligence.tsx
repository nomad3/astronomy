'use client';

import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import { AlertTriangle, Zap, Orbit } from 'lucide-react';

const ThreatIntelligence = () => {
  const threats = [
    {
      id: 'NEO-2023-001',
      type: 'Asteroid',
      severity: 'High',
      details: 'Potentially hazardous asteroid with a close approach on 2025-12-25.',
    },
    {
      id: 'SWE-2023-002',
      type: 'Solar Flare',
      severity: 'Medium',
      details: 'M-class solar flare detected. Potential for minor radio blackouts.',
    },
    {
      id: 'NEO-2023-003',
      type: 'Asteroid',
      severity: 'Low',
      details: 'Small asteroid with a distant approach. No threat to Earth.',
    },
  ];

  const getThreatIcon = (type) => {
    if (type === 'Asteroid') {
      return <Orbit size={24} />;
    } else if (type === 'Solar Flare') {
      return <Zap size={24} />;
    } else {
      return <AlertTriangle size={24} />;
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === 'High') {
      return 'error';
    } else if (severity === 'Medium') {
      return 'warning';
    } else {
      return 'success';
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Threat Intelligence
      </Typography>
      <Grid container spacing={2}>
        {threats.map((threat, index) => (
          <Grid item xs={12} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {getThreatIcon(threat.type)}
                  <Typography variant="body1" sx={{ fontWeight: 600, ml: 1 }}>
                    {threat.id}
                  </Typography>
                  <Chip
                    label={threat.severity}
                    color={getSeverityColor(threat.severity)}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {threat.details}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ThreatIntelligence;