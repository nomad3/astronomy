'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, Typography, Box } from '@mui/material'

// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <Typography>Loading map...</Typography>
});

interface IssPosition {
  latitude: number;
  longitude: number;
}

export default function ISSTrackerMap() {
  const [issPosition, setIssPosition] = useState<IssPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssPosition = async () => {
      try {
        const response = await fetch('/api/iss-tracking');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: IssPosition = await response.json();
        setIssPosition(data);
      } catch (e: any) {
        setError(e.message);
      }
    };

    fetchIssPosition(); // Fetch immediately on mount
    const interval = setInterval(fetchIssPosition, 5000); // Then fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          ISS Live Location
        </Typography>
        {error && <Typography color="error">Error: {error}</Typography>}
        {issPosition ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Latitude: {issPosition.latitude.toFixed(4)}</Typography>
            <Typography variant="body2">Longitude: {issPosition.longitude.toFixed(4)}</Typography>
            <Box sx={{ mt: 2, height: 300 }}>
              <Map lat={issPosition.latitude} lng={issPosition.longitude} />
            </Box>
          </Box>
        ) : (
          <Typography>Loading ISS position...</Typography>
        )}
      </CardContent>
    </Card>
  )
}
