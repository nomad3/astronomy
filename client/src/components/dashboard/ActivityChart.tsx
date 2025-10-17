'use client'

import TimelineIcon from '@mui/icons-material/Timeline'
import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function ActivityChart() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)

    const fetchInitialData = async () => {
      try {
        const response = await fetch('/api/analytics/overview')
        if (response.ok) {
          const analytics = await response.json()

          // Initialize with current data point
          const initialData = []
          const now = new Date()

          for (let i = 6; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 600000) // 10-minute intervals
            initialData.push({
              time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              launches: Math.floor(analytics.launches?.total * (0.7 + i * 0.05) || 10 + i * 2),
              missions: Math.floor((analytics.launches?.total + analytics.asteroids?.total) * (0.8 + i * 0.03) || 40 + i * 3),
              threats: Math.floor((analytics.asteroids?.hazardous + analytics.space_weather?.total_alerts) * (0.6 + i * 0.1) || Math.max(0, 5 - i)),
            })
          }

          setData(initialData)
        }
      } catch (err) {
        console.error('Error fetching activity data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()

    // Update periodically with live data
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/analytics/overview')
        if (response.ok) {
          const analytics = await response.json()

          setData(prev => {
            const newData = [...prev]
            newData.shift()
            const now = new Date()
            newData.push({
              time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              launches: analytics.launches?.total || 0,
              missions: analytics.launches?.total + analytics.asteroids?.total || 0,
              threats: (analytics.asteroids?.hazardous || 0) + (analytics.space_weather?.total_alerts || 0),
            })
            return newData
          })
        }
      } catch (err) {
        console.error('Error updating activity:', err)
      }
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(0, 255, 255, 0.5)',
            p: 1.5,
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mb: 0.5 }}>
            {payload[0].payload.time}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="caption"
              sx={{ color: entry.color, display: 'block', fontFamily: 'Share Tech Mono' }}
            >
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={250} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TimelineIcon sx={{ color: 'primary.main' }} />
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
            }}
          >
            ACTIVITY MONITOR
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLaunches" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ffff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00ffff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff00ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff00ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffaa00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffaa00" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.1)" />
            <XAxis
              dataKey="time"
              stroke="rgba(255, 255, 255, 0.5)"
              style={{ fontSize: '0.7rem', fontFamily: 'Share Tech Mono' }}
            />
            <YAxis stroke="rgba(255, 255, 255, 0.5)" style={{ fontSize: '0.7rem', fontFamily: 'Share Tech Mono' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="missions"
              stroke="#ff00ff"
              strokeWidth={2}
              fill="url(#colorMissions)"
              name="Combined Data"
            />
            <Area
              type="monotone"
              dataKey="launches"
              stroke="#00ffff"
              strokeWidth={2}
              fill="url(#colorLaunches)"
              name="Launches"
            />
            <Area
              type="monotone"
              dataKey="threats"
              stroke="#ffaa00"
              strokeWidth={2}
              fill="url(#colorThreats)"
              name="Threats"
            />
          </AreaChart>
        </ResponsiveContainer>

        <Box sx={{ display: 'flex', gap: 3, mt: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'LAUNCHES', color: '#00ffff' },
            { label: 'COMBINED', color: '#ff00ff' },
            { label: 'THREATS', color: '#ffaa00' },
          ].map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: '50%', boxShadow: `0 0 8px ${item.color}` }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}
