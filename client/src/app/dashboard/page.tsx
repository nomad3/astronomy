"use client"

import ActivityChart from '@/components/dashboard/ActivityChart'
import ApiRateMonitor from '@/components/dashboard/ApiRateMonitor'
import AsteroidTracker from '@/components/dashboard/AsteroidTracker'
import AstronomyPictureOfTheDay from '@/components/dashboard/AstronomyPictureOfTheDay'
import DataMetrics from '@/components/dashboard/DataMetrics'
import EarthViewer from '@/components/dashboard/EarthViewer'
import LaunchCalendar from '@/components/dashboard/LaunchCalendar'
import LaunchFrequencyChart from '@/components/dashboard/LaunchFrequencyChart'
import MarsRoverGallery from '@/components/dashboard/MarsRoverGallery'
import MarsWeather from '@/components/dashboard/MarsWeather'
import MissionDistributionChart from '@/components/dashboard/MissionDistributionChart'
import MissionStatus from '@/components/dashboard/MissionStatus'
import SpaceWeather from '@/components/dashboard/SpaceWeather'
import SystemHealthPanel from '@/components/dashboard/SystemHealthPanel'
import SystemMonitor from '@/components/dashboard/SystemMonitor'
import TelemetryPanel from '@/components/dashboard/TelemetryPanel'
import CelestialObjectExplorer from '@/components/visualizations/CelestialObjectExplorer'
import ISSTrackerMap from '@/components/visualizations/ISSTrackerMap'
import SolarSystem from '@/components/visualizations/SolarSystem'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ImageIcon from '@mui/icons-material/Image'
import PublicIcon from '@mui/icons-material/Public'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'
import ShieldIcon from '@mui/icons-material/Shield'
import SpeedIcon from '@mui/icons-material/Speed'
import TerrainIcon from '@mui/icons-material/Terrain'
import { AppBar, Box, Chip, Container, Grid, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        bgcolor: 'background.default',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.03) 0%, transparent 50%)',
      }}
    >
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <SatelliteAltIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(45deg, #00ffff 30%, #ff00ff 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
              }}
            >
              STARSHIP CONTROL DECK
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.2em' }}>
              DEEP SPACE MISSION COMMAND CENTER
            </Typography>
          </Box>
          <Chip
            icon={<SpeedIcon />}
            label="OPERATIONAL"
            color="success"
            sx={{
              fontFamily: 'Share Tech Mono',
              fontWeight: 700,
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
            }}
          />
        </Toolbar>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              fontWeight: 600,
              letterSpacing: '0.1em',
            },
          }}
        >
          <Tab icon={<DashboardIcon />} label="ANALYTICS" iconPosition="start" />
          <Tab icon={<PublicIcon />} label="BRIDGE" iconPosition="start" />
          <Tab icon={<RocketLaunchIcon />} label="OPERATIONS" iconPosition="start" />
          <Tab icon={<ShieldIcon />} label="THREAT MONITOR" iconPosition="start" />
          <Tab icon={<TerrainIcon />} label="MARS" iconPosition="start" />
          <Tab icon={<ImageIcon />} label="OBSERVATORY" iconPosition="start" />
        </Tabs>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Top Status Bar */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: 'rgba(0, 255, 255, 0.05)',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            borderRadius: 1,
            display: 'flex',
            gap: 3,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'primary.main', fontFamily: 'Share Tech Mono' }}>
            ⚡ PWR: 100% | 🛰️ SAT-LINK: ACTIVE | 📡 COMMS: NOMINAL | 🔒 SEC: LEVEL 5
          </Typography>
        </Box>

        {activeTab === 0 && (
          <Grid container spacing={2}>
            {/* KPI Metrics */}
            <Grid size={{ xs: 12 }}>
              <DataMetrics />
            </Grid>

            {/* Charts Row 1 */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <ActivityChart />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <SystemHealthPanel />
            </Grid>

            {/* Charts Row 2 */}
            <Grid size={{ xs: 12, md: 6 }}>
              <LaunchFrequencyChart />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MissionDistributionChart />
            </Grid>

            {/* Data Tables and API Monitor */}
            <Grid size={{ xs: 12, md: 6 }}>
              <MissionStatus />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <LaunchCalendar />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ApiRateMonitor />
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={2}>
            {/* Left Column - Main Display */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <SolarSystem />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CelestialObjectExplorer />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TelemetryPanel />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ISSTrackerMap />
                </Grid>
              </Grid>
            </Grid>

            {/* Right Column - Side Panels */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <SystemMonitor />
                <AstronomyPictureOfTheDay />
              </Box>
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <SystemMonitor />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TelemetryPanel />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ISSTrackerMap />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MissionStatus />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <LaunchCalendar />
            </Grid>
          </Grid>
        )}

        {activeTab === 3 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <AsteroidTracker />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <SpaceWeather />
            </Grid>
            <Grid size={{ xs: 12, lg: 8 }}>
              <ISSTrackerMap />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <SystemMonitor />
                <TelemetryPanel />
              </Box>
            </Grid>
          </Grid>
        )}

        {activeTab === 4 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <MarsRoverGallery />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MarsWeather />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <SystemMonitor />
                <TelemetryPanel />
              </Box>
            </Grid>
          </Grid>
        )}

        {activeTab === 5 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <AstronomyPictureOfTheDay />
            </Grid>
            <Grid size={{ xs: 12, lg: 4 }}>
              <EarthViewer />
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Bottom Status Bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 1,
          bgcolor: 'rgba(10, 14, 39, 0.95)',
          borderTop: '1px solid rgba(0, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontFamily: 'Share Tech Mono',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
            }}
          >
            MISSION CONTROL v3.14.159 | STARSHIP OS | ENCRYPTED CHANNEL | ALL SYSTEMS GO • READY FOR DEEP SPACE OPERATIONS
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
