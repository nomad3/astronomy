'use client'

import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

export default function LaunchCalendar() {
  // Fetch launch data from your API
  const launches = [
    { name: 'Falcon 9 - Starlink', date: '2025-10-20' },
    { name: 'Atlas V - GOES-T', date: '2025-11-05' },
    { name: 'Artemis II', date: '2025-11-15' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Launch Calendar
        </Typography>
        <List dense>
          {launches.map((launch, index) => (
            <React.Fragment key={launch.name}>
              <ListItem>
                <ListItemText primary={launch.name} secondary={launch.date} />
              </ListItem>
              {index < launches.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
