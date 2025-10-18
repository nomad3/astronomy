'use client';

import { useState, startTransition } from 'react';
import { Box, Container, Typography, AppBar, Toolbar, Chip, Tabs, Tab, Grid } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PublicIcon from '@mui/icons-material/Public';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ShieldIcon from '@mui/icons-material/Shield';
import TerrainIcon from '@mui/icons-material/Terrain';
import ImageIcon from '@mui/icons-material/Image';
import SpeedIcon from '@mui/icons-material/Speed';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';

import DataMetrics from '@/components/dashboard/DataMetrics';
import ActivityChart from '@/components/dashboard/ActivityChart';
import SystemHealthPanel from '@/components/dashboard/SystemHealthPanel';
import LaunchFrequencyChart from '@/components/dashboard/LaunchFrequencyChart';
import MissionDistributionChart from '@/components/dashboard/MissionDistributionChart';
import MissionStatus from '@/components/dashboard/MissionStatus';
import LaunchCalendar from '@/components/dashboard/LaunchCalendar';
import ApiRateMonitor from '@/components/dashboard/ApiRateMonitor';
import SolarSystem from '@/components/visualizations/SolarSystem';
import CelestialObjectExplorer from '@/components/visualizations/CelestialObjectExplorer';
import TelemetryPanel from '@/components/dashboard/TelemetryPanel';
import ISSTrackerMap from '@/components/visualizations/ISSTrackerMap';
import SystemMonitor from '@/components/dashboard/SystemMonitor';
import AstronomyPictureOfTheDay from '@/components/dashboard/AstronomyPictureOfTheDay';
import AsteroidTracker from '@/components/dashboard/AsteroidTracker';
import SpaceWeather from '@/components/dashboard/SpaceWeather';
import MarsRoverGallery from '@/components/dashboard/MarsRoverGallery';
import MarsWeather from '@/components/dashboard/MarsWeather';
import TelescopeGallery from '@/components/dashboard/TelescopeGallery';
import EarthViewer from '@/components/dashboard/EarthViewer';

import Header from '@/components/ui/Header';
import { Rocket } from 'lucide-react';
import ThreatIntelligence from '@/components/dashboard/ThreatIntelligence';



const navItems = [
  { icon: <DashboardIcon />, label: 'ANALYTICS' },
  { icon: <PublicIcon />, label: 'BRIDGE' },
  { icon: <RocketLaunchIcon />, label: 'OPERATIONS' },
  { icon: <ShieldIcon />, label: 'THREAT MONITOR' },
  { icon: <TerrainIcon />, label: 'MARS' },
  { icon: <ImageIcon />, label: 'OBSERVATORY' },
];

const DashboardNav = ({ activeTab, handleChange }) => (
  <Box sx={{ width: 240, bgcolor: 'background.paper', borderRight: '1px solid #30363d', display: 'flex', flexDirection: 'column' }}>
    <Toolbar sx={{ gap: 2, p: 2, borderBottom: '1px solid #30363d' }}>
      <Rocket size={32} color="#00e5ff" />
      <Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          STARSHIP OS
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em' }}>
          v3.14
        </Typography>
      </Box>
    </Toolbar>
    <Tabs
      orientation="vertical"
      value={activeTab}
      onChange={handleChange}
      sx={{
        flexGrow: 1,
        '& .MuiTab-root': {
          justifyContent: 'flex-start',
          fontWeight: 600,
          letterSpacing: '0.1em',
          padding: '16px 24px',
          borderBottom: '1px solid #1A2A3E',
        },
        '& .Mui-selected': {
          color: '#00e5ff',
          backgroundColor: 'rgba(0, 229, 255, 0.1)',
        },
        '& .MuiTabs-indicator': {
          left: 0,
          width: '4px',
          backgroundColor: '#00e5ff',
        },
      }}
    >
      {navItems.map((item, index) => (
        <Tab key={index} icon={item.icon} label={item.label} iconPosition="start" />
      ))}
    </Tabs>
    <Box sx={{ p: 2, borderTop: '1px solid #30363d' }}>
      <Chip
        icon={<SpeedIcon />}
        label="ALL SYSTEMS GO"
        color="success"
        sx={{ width: '100%', fontFamily: '"Exo", sans-serif', fontWeight: 500 }}
      />
    </Box>
  </Box>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event, newValue) => {
    startTransition(() => {
      setActiveTab(newValue);
    });
  };



  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <DashboardNav activeTab={activeTab} handleChange={handleTabChange} />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header title={navItems[activeTab].label} />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {activeTab === 0 && (
              <>
                <Grid item xs={12}><DataMetrics /></Grid>
                <Grid item xs={12} lg={8}><ActivityChart /></Grid>
                <Grid item xs={12} lg={4}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}><SystemHealthPanel /></Grid>
                    <Grid item xs={12}><LaunchFrequencyChart /></Grid>
                    <Grid item xs={12}><MissionDistributionChart /></Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}><ApiRateMonitor /></Grid>
              </>
            )}

            {activeTab === 1 && (
              <>
                <Grid item xs={12} lg={8}>
                  <SolarSystem />
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}><ISSTrackerMap /></Grid>
                    <Grid item xs={12}><CelestialObjectExplorer /></Grid>
                    <Grid item xs={12}><AstronomyPictureOfTheDay /></Grid>
                  </Grid>
                </Grid>
              </>
            )}

            {activeTab === 2 && (
              <>
                <Grid item xs={12} lg={6}><MissionStatus /></Grid>
                <Grid item xs={12} lg={6}><LaunchCalendar /></Grid>
              </>
            )}

            {activeTab === 3 && (
              <>
                <Grid item xs={12} lg={6}><AsteroidTracker /></Grid>
                <Grid item xs={12} lg={6}><SpaceWeather /></Grid>
                <Grid item xs={12}><ThreatIntelligence /></Grid>
              </>
            )}

            {activeTab === 4 && (
              <>
                <Grid item xs={12}><MarsRoverGallery /></Grid>
                <Grid item xs={12} lg={6}><MarsWeather /></Grid>
              </>
            )}

            {activeTab === 5 && (
              <>
                <Grid item xs={12} lg={8}><AstronomyPictureOfTheDay /></Grid>
                <Grid item xs={12} lg={4}><EarthViewer /></Grid>
                <Grid item xs={12}><TelescopeGallery telescope="jwst" title="JAMES WEBB SPACE TELESCOPE" /></Grid>
                <Grid item xs={12}><TelescopeGallery telescope="hubble" title="HUBBLE SPACE TELESCOPE" /></Grid>
                <Grid item xs={12}><TelescopeGallery telescope="probes" title="SPACE PROBE IMAGERY" /></Grid>
              </>
            )}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
