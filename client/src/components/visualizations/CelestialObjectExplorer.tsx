'use client';

import { Box, Card, CardContent, Chip, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { Globe } from 'lucide-react';

interface CelestialObject {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  facts: string[];
}

const celestialObjects: { [key: string]: CelestialObject[] } = {
  planets: [
    {
      id: 'mars',
      name: 'Mars',
      category: 'planet',
      description: 'The fourth planet from the Sun and the second-smallest planet in the Solar System.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1200px-OSIRIS_Mars_true_color.jpg',
      facts: ['Red Planet', 'Two moons', 'Thin atmosphere'],
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      category: 'planet',
      description: 'The fifth planet from the Sun and the largest in the Solar System.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_moon_Io.jpg/1200px-Jupiter_and_its_moon_Io.jpg',
      facts: ['Gas giant', 'Great Red Spot', '79 moons'],
    },
  ],
  stars: [
    {
      id: 'sun',
      name: 'Sun',
      category: 'star',
      description: 'The star at the center of the Solar System.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg/1200px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg',
      facts: ['Yellow dwarf', 'Main sequence', 'Source of light and heat'],
    },
    {
      id: 'sirius',
      name: 'Sirius',
      category: 'star',
      description: 'The brightest star in the night sky.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Sirius_A_and_B_Hubble_photo.jpg/1200px-Sirius_A_and_B_Hubble_photo.jpg',
      facts: ['Binary star system', 'Dog Star', '8.6 light-years away'],
    },
  ],
  nebulae: [
    {
      id: 'orion',
      name: 'Orion Nebula',
      category: 'nebula',
      description: 'A large, diffuse nebula situated in the Milky Way.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/1200px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg',
      facts: ['Stellar nursery', 'Visible to naked eye', '780 light-years away'],
    },
    {
      id: 'crab',
      name: 'Crab Nebula',
      category: 'nebula',
      description: 'A supernova remnant and pulsar wind nebula in the constellation of Taurus.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Crab_Nebula.jpg/1200px-Crab_Nebula.jpg',
      facts: ['Supernova remnant', 'Pulsar at center', '6,500 light-years away'],
    },
  ],
  galaxies: [
    {
      id: 'andromeda',
      name: 'Andromeda Galaxy',
      category: 'galaxy',
      description: 'A barred spiral galaxy and is the closest large galaxy to the Milky Way.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/1200px-Andromeda_Galaxy_%28with_h-alpha%29.jpg',
      facts: ['Spiral galaxy', 'Approaching Milky Way', '2.5 million light-years away'],
    },
    {
      id: 'milkyway',
      name: 'Milky Way',
      category: 'galaxy',
      description: 'The galaxy that contains our Solar System.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO_-_Milky_Way_Panorama_%28by_ESO%29.jpg/1200px-ESO_-_Milky_Way_Panorama_%28by_ESO%29.jpg',
      facts: ['Barred spiral galaxy', 'Home galaxy', '100,000 light-years across'],
    },
  ],
};

const ObjectCard = ({ obj }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ height: 200, overflow: 'hidden' }}>
      <img src={obj.imageUrl} alt={obj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </Box>
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {obj.name}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {obj.description}
      </Typography>
      <Box sx={{ mt: 'auto' }}>
        {obj.facts.slice(0, 2).map((fact, idx) => (
          <Typography key={idx} variant="caption" sx={{ display: 'block' }}>
            • {fact}
          </Typography>
        ))}
      </Box>
    </CardContent>
  </Card>
);

export default function CelestialObjectExplorer() {
  const [selectedCategory, setSelectedCategory] = useState(0);

  const categories = [
    { label: 'Planets', value: 'planets' },
    { label: 'Stars', value: 'stars' },
    { label: 'Nebulae', value: 'nebulae' },
    { label: 'Galaxies', value: 'galaxies' },
  ];

  const currentObjects = celestialObjects[categories[selectedCategory].value] || [];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Globe />
          <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Celestial Object Database
          </Typography>
        </Box>

        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          {categories.map((cat, idx) => (
            <Tab key={idx} label={cat.label} />
          ))}
        </Tabs>

        <Grid container spacing={2}>
          {currentObjects.map((obj) => (
            <Grid item xs={12} md={6} lg={4} key={obj.id}>
              <ObjectCard obj={obj} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
