'use client'

import { Alert, Card, CardContent, Divider, List, ListItem, ListItemText, Skeleton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface Mission {
  id: string
  name: string
  status?: string
  launch_vehicle?: string
  window_start?: string
  launch_provider?: string
}

export default function MissionStatus() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await fetch('/api/missions?limit=5')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMissions(data.missions ?? [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMissions()
  }, [])

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Mission Status
        </Typography>
        {loading && (
          <>
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} height={48} sx={{ mb: 1 }} />
            ))}
          </>
        )}
        {error && <Alert severity="error">Error loading missions: {error}</Alert>}
        {!loading && !error && missions.length === 0 && (
          <Typography variant="body2">No missions available.</Typography>
        )}
        {!loading && missions.length > 0 && (
          <List dense>
            {missions.map((mission, index) => (
              <React.Fragment key={mission.id || mission.name}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={mission.name}
                    secondary={
                      <>
                        {mission.status && <Typography variant="body2">Status: {mission.status}</Typography>}
                        {mission.launch_provider && (
                          <Typography variant="body2">Provider: {mission.launch_provider}</Typography>
                        )}
                        {mission.launch_vehicle && (
                          <Typography variant="body2">Vehicle: {mission.launch_vehicle}</Typography>
                        )}
                        {mission.window_start && (
                          <Typography variant="body2">
                            Launch Window: {new Date(mission.window_start).toLocaleString()}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < missions.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
