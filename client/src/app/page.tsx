"use client"

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PublicIcon from '@mui/icons-material/Public'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'
import SecurityIcon from '@mui/icons-material/Security'
import { Box, Button, Container, Fade, Typography, Zoom } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [showCountdown, setShowCountdown] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  const handleLaunch = () => {
    setShowCountdown(true)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  if (showCountdown) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)',
            animation: 'pulse 1s ease-in-out infinite',
          }}
        />
        <Zoom in>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '8rem', md: '15rem' },
              fontWeight: 900,
              color: 'primary.main',
              textShadow: '0 0 80px rgba(0, 255, 255, 0.8)',
              animation: 'glow 0.5s ease-in-out infinite',
            }}
          >
            {countdown}
          </Typography>
        </Zoom>
        <Typography
          variant="h4"
          sx={{
            color: 'warning.main',
            fontFamily: 'Share Tech Mono',
            mt: 4,
            letterSpacing: '0.3em',
          }}
        >
          INITIATING LAUNCH SEQUENCE...
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.05) 0%, transparent 50%)
          `,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 255, 0.03) 2px,
                rgba(0, 255, 255, 0.03) 4px
              )
            `,
            animation: 'scan 20s linear infinite',
            pointerEvents: 'none',
          },
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 8,
        }}
      >
        {/* Hero Section */}
        <Fade in={show} timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            {/* Logo/Icon */}
            <Zoom in={show} timeout={1500}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 3,
                  borderRadius: '50%',
                  border: '3px solid',
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(0, 255, 255, 0.05)',
                  boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)',
                  mb: 4,
                }}
              >
                <SatelliteAltIcon
                  sx={{
                    fontSize: 80,
                    color: 'primary.main',
                    filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.7))',
                  }}
                />
              </Box>
            </Zoom>

            {/* Main Title */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '5rem', lg: '6.5rem' },
                fontWeight: 900,
                background: 'linear-gradient(45deg, #00ffff 30%, #ff00ff 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(0, 255, 255, 0.3)',
                mb: 2,
                letterSpacing: '0.05em',
              }}
            >
              STARSHIP
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem', lg: '4rem' },
                fontWeight: 700,
                color: 'primary.light',
                mb: 3,
                letterSpacing: '0.2em',
              }}
            >
              CONTROL DECK
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                fontFamily: 'Rajdhani',
                letterSpacing: '0.15em',
                mb: 1,
              }}
            >
              DEEP SPACE MISSION COMMAND CENTER
            </Typography>

            <Box
              sx={{
                display: 'inline-block',
                px: 3,
                py: 1,
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: 1,
                bgcolor: 'rgba(0, 255, 255, 0.05)',
                mt: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: 'primary.main',
                  fontFamily: 'Share Tech Mono',
                  fontSize: '0.9rem',
                }}
              >
                [CLASSIFIED] • SECURITY CLEARANCE: LEVEL 5 • [TOP SECRET]
              </Typography>
            </Box>
          </Box>
        </Fade>

        {/* Features Grid */}
        <Fade in={show} timeout={2000}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              mb: 6,
            }}
          >
            {[
              {
                icon: <PublicIcon sx={{ fontSize: 40 }} />,
                title: 'REAL-TIME TRACKING',
                desc: 'Monitor ISS position, missions, and launches with live telemetry',
              },
              {
                icon: <SecurityIcon sx={{ fontSize: 40 }} />,
                title: 'THREAT DETECTION',
                desc: 'Track near-Earth asteroids and space weather events',
              },
              {
                icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />,
                title: 'MISSION CONTROL',
                desc: 'Access launch schedules with T-minus countdowns',
              },
            ].map((feature, index) => (
              <Zoom in={show} timeout={1500 + index * 200} key={index}>
                <Box
                  sx={{
                    p: 3,
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    borderRadius: 2,
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: 'primary.main',
                      mb: 2,
                      filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 700,
                      mb: 1,
                      letterSpacing: '0.1em',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontFamily: 'Rajdhani',
                    }}
                  >
                    {feature.desc}
                  </Typography>
                </Box>
              </Zoom>
            ))}
          </Box>
        </Fade>

        {/* CTA Button */}
        <Fade in={show} timeout={2500}>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleLaunch}
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 6,
                py: 2.5,
                fontSize: '1.3rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                background: 'linear-gradient(45deg, #00ffff 30%, #0088ff 90%)',
                boxShadow: '0 0 40px rgba(0, 255, 255, 0.4)',
                border: '2px solid',
                borderColor: 'primary.main',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00ffff 60%, #0088ff 100%)',
                  boxShadow: '0 0 60px rgba(0, 255, 255, 0.6)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              ENTER CONTROL DECK
            </Button>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 3,
                color: 'text.secondary',
                fontFamily: 'Share Tech Mono',
                letterSpacing: '0.15em',
              }}
            >
              POWERED BY NASA • LAUNCH LIBRARY 2 • REAL-TIME DATA FEEDS
            </Typography>
          </Box>
        </Fade>

        {/* Bottom Stats */}
        <Fade in={show} timeout={3000}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              mt: 8,
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: 'MISSIONS TRACKED', value: '1000+' },
              { label: 'LAUNCH UPDATES', value: 'LIVE' },
              { label: 'DATA SOURCES', value: '5+' },
              { label: 'SYSTEM STATUS', value: 'OPERATIONAL' },
            ].map((stat, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: 'center',
                  px: 3,
                  py: 1.5,
                  border: '1px solid rgba(0, 255, 255, 0.2)',
                  borderRadius: 1,
                  bgcolor: 'rgba(0, 0, 0, 0.2)',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: 'primary.main',
                    fontFamily: 'Share Tech Mono',
                    fontWeight: 700,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    letterSpacing: '0.1em',
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Fade>
      </Container>

      <style jsx global>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(50%);
          }
        }
        @keyframes glow {
          0%,
          100% {
            text-shadow: 0 0 40px rgba(0, 255, 255, 0.8), 0 0 80px rgba(0, 255, 255, 0.6);
          }
          50% {
            text-shadow: 0 0 60px rgba(0, 255, 255, 1), 0 0 120px rgba(0, 255, 255, 0.8);
          }
        }
      `}</style>
    </Box>
  )
}
