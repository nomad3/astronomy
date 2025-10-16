'use client'

import { Alert, Card, CardContent, Divider, List, ListItem, ListItemText, Skeleton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface Launch {
  id: string
  name: string
  status?: string
  window_start?: string
  window_end?: string
  location?: string
}

export default function LaunchCalendar() {
  const [launches, setLaunches] = useState<Launch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const response = await fetch('/api/launches?limit=5')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setLaunches(data.launches ?? [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLaunches()
  }, [])

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Launch Calendar
        </Typography>
        {loading && (
          <>
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} height={48} sx={{ mb: 1 }} />
            ))}
          </>
        )}
        {error && <Alert severity="error">Error loading launches: {error}</Alert>}
        {!loading && !error && launches.length === 0 && (
          <Typography variant="body2">No upcoming launches found.</Typography>
        )}
        {!loading && launches.length > 0 && (
          <List dense>
            {launches.map((launch, index) => (
              <React.Fragment key={launch.id || launch.name}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={launch.name}
                    secondary={
                      <>
                        {launch.status && <Typography variant="body2">Status: {launch.status}</Typography>}
                        {launch.location && <Typography variant="body2">Location: {launch.location}</Typography>}
                        {launch.window_start && (
                          <Typography variant="body2">
                            Window Start: {new Date(launch.window_start).toLocaleString()}
                          </Typography>
                        )}
                        {launch.window_end && (
                          <Typography variant="body2">
                            Window End: {new Date(launch.window_end).toLocaleString()}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < launches.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
