"use client"

import AstronomyPictureOfTheDay from '@/components/dashboard/AstronomyPictureOfTheDay';
import LaunchCalendar from '@/components/dashboard/LaunchCalendar';
import MissionStatus from '@/components/dashboard/MissionStatus';
import ISSTrackerMap from '@/components/visualizations/ISSTrackerMap';
import SolarSystem from '@/components/visualizations/SolarSystem';
import { AppBar, Box, Grid, Toolbar, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Space Exploration Data Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <SolarSystem />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <AstronomyPictureOfTheDay />
              <ISSTrackerMap />
              <MissionStatus />
              <LaunchCalendar />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
