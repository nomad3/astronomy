'use client';

import { Alert, Box, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import TerrainIcon from '@mui/icons-material/Terrain';

interface MarsPhoto {
  id: number;
  sol: number;
  camera: string;
  camera_name: string;
  img_src: string;
  earth_date: string;
  rover: string;
  rover_status: string;
}

const PhotoCard = ({ photo }) => {
  const proxiedImgSrc = `/api/mars/image-proxy?image_url=${encodeURIComponent(photo.img_src)}`;
  return (
    <Card sx={{ height: '100%' }}>
      <Box sx={{ height: 200, overflow: 'hidden' }}>
        <img src={proxiedImgSrc} alt={`Mars Rover Photo ${photo.id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Box>
      <CardContent>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{photo.camera_name}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Sol: {photo.sol} | {photo.earth_date}</Typography>
      </CardContent>
    </Card>
  );
};

export default function MarsRoverGallery() {
  const [photos, setPhotos] = useState<MarsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rover, setRover] = useState('curiosity');
  const [sol, setSol] = useState(1000);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/mars/rover-photos?rover=${rover}&sol=${sol}&limit=12`);
        if (!response.ok) {
          setPhotos([]);
          setError('Unable to fetch rover photos');
          return;
        }
        const data = await response.json();
        setPhotos(data.photos ?? []);
        setError(data.demo ? 'Displaying demo data (Mars Rover Photos API temporarily unavailable)' : null);
      } catch (err: any) {
        setError('Unable to fetch rover photos');
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [rover, sol]);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TerrainIcon />
            <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Mars Rover Images
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Rover</InputLabel>
              <Select value={rover} label="Rover" onChange={(e) => setRover(e.target.value)}>
                <MenuItem value="curiosity">Curiosity</MenuItem>
                <MenuItem value="perseverance">Perseverance</MenuItem>
                <MenuItem value="opportunity">Opportunity</MenuItem>
                <MenuItem value="spirit">Spirit</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Sol</InputLabel>
              <Select value={sol} label="Sol" onChange={(e) => setSol(Number(e.target.value))}>
                <MenuItem value={1000}>1000</MenuItem>
                <MenuItem value={2000}>2000</MenuItem>
                <MenuItem value={3000}>3000</MenuItem>
                <MenuItem value={3500}>3500</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {loading && (
          <Grid container spacing={2}>
            {[...Array(6)].map((_, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
            ))}
          </Grid>
        )}

        {error && <Alert severity="info" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}

        {!loading && !error && photos.length === 0 && (
          <Typography sx={{ textAlign: 'center', p: 4 }}>
            No photos available for Sol {sol}. Try a different sol or rover.
          </Typography>
        )}

        {!loading && photos.length > 0 && (
          <Grid container spacing={2}>
            {photos.map((photo) => (
              <Grid item xs={12} sm={6} md={4} key={photo.id}>
                <PhotoCard photo={photo} />
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
