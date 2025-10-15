'use client'

import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

export default function MissionStatus() {
  // Fetch mission data from your API
  const missions = [
    { name: 'Artemis I', status: 'Completed' },
    { name: 'Crew-9', status: 'Upcoming' },
    { name: 'Starlink Group 6-21', status: 'In Progress' },
  ];

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Mission Status
        </Typography>
        <List dense>
          {missions.map((mission, index) => (
            <React.Fragment key={mission.name}>
              <ListItem>
                <ListItemText primary={mission.name} secondary={mission.status} />
              </ListItem>
              {index < missions.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
