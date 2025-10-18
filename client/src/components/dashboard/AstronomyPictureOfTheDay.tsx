'use client';

import { Card, CardContent, CardMedia, Typography, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';

interface ApodData {
  title: string;
  explanation: string;
  url: string;
  hdurl: string;
  media_type: string;
}

export default function AstronomyPictureOfTheDay() {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/astronomy-images/apod');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </CardContent>
      </Card>
    );
  }

  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!data) return <Typography>No data found.</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Astronomy Picture of the Day
        </Typography>
      </CardContent>
      {data.media_type === 'image' && (
        <CardMedia component="img" height="200" image={data.url} alt={data.title} />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {data.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.explanation}
        </Typography>
      </CardContent>
    </Card>
  );
}
