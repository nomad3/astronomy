'use client'

import ExploreIcon from '@mui/icons-material/Explore'
import InfoIcon from '@mui/icons-material/Info'
import PublicIcon from '@mui/icons-material/Public'
import StarIcon from '@mui/icons-material/Star'
import { Box, Card, CardContent, Chip, Grid, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'

interface CelestialObject {
  id: number
  name: string
  type: string
  description: string
  imageUrl: string
  distance: string
  size: string
  mass: string
  temperature?: string
  composition?: string
  discoveryDate?: string
  facts: string[]
}

export default function CelestialObjectExplorer() {
  const [selectedCategory, setSelectedCategory] = useState(0)

  const celestialObjects: Record<string, CelestialObject[]> = {
    planets: [
      {
        id: 1,
        name: 'Mercury',
        type: 'Terrestrial Planet',
        description: 'The smallest and closest planet to the Sun, with extreme temperature variations.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/09/mercury-messenger-globe-pia15162.jpg',
        distance: '0.39 AU from Sun',
        size: '4,879 km diameter',
        mass: '3.30 × 10²³ kg',
        temperature: '430°C (day) / -180°C (night)',
        composition: 'Iron core, rocky surface',
        discoveryDate: 'Ancient',
        facts: [
          'Has no atmosphere',
          'One day is 59 Earth days',
          'Heavily cratered surface',
          'Named after Roman messenger god',
        ],
      },
      {
        id: 2,
        name: 'Venus',
        type: 'Terrestrial Planet',
        description: 'The hottest planet in our solar system, with a thick toxic atmosphere.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/09/venus-mariner-10-pia23791.jpg',
        distance: '0.72 AU from Sun',
        size: '12,104 km diameter',
        mass: '4.87 × 10²⁴ kg',
        temperature: '462°C average',
        composition: 'Rocky with thick CO₂ atmosphere',
        discoveryDate: 'Ancient',
        facts: [
          'Rotates backwards (retrograde)',
          'Day longer than year (243 Earth days)',
          'Surface pressure 92x Earth',
          'Brightest planet in night sky',
        ],
      },
      {
        id: 3,
        name: 'Earth',
        type: 'Terrestrial Planet',
        description: 'Our home planet, the only known world with life.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/06/blue-marble-apollo-17-pia00122.jpg',
        distance: '1.00 AU from Sun',
        size: '12,742 km diameter',
        mass: '5.97 × 10²⁴ kg',
        temperature: '15°C average',
        composition: '71% water, 29% land',
        discoveryDate: 'N/A',
        facts: [
          'Only planet with liquid water',
          'Protected by magnetic field',
          'One natural satellite (Moon)',
          '4.5 billion years old',
        ],
      },
      {
        id: 4,
        name: 'Mars',
        type: 'Terrestrial Planet',
        description: 'The Red Planet, prime target for human exploration.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/09/mars-full-globe.jpg',
        distance: '1.52 AU from Sun',
        size: '6,779 km diameter',
        mass: '6.42 × 10²³ kg',
        temperature: '-63°C average',
        composition: 'Iron oxide (rust) surface',
        discoveryDate: 'Ancient',
        facts: [
          'Has polar ice caps',
          'Largest volcano: Olympus Mons (27km high)',
          'Two moons: Phobos and Deimos',
          'Day is 24.6 hours',
        ],
      },
      {
        id: 5,
        name: 'Jupiter',
        type: 'Gas Giant',
        description: 'The largest planet in our solar system, a massive ball of gas.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/09/jupiter-marble.jpg',
        distance: '5.20 AU from Sun',
        size: '139,820 km diameter',
        mass: '1.90 × 10²⁷ kg',
        temperature: '-145°C average',
        composition: 'Hydrogen and helium',
        discoveryDate: 'Ancient',
        facts: [
          'Great Red Spot is giant storm',
          '79 known moons',
          'Fastest rotation (10 hours)',
          'Strong magnetic field',
        ],
      },
      {
        id: 6,
        name: 'Saturn',
        type: 'Gas Giant',
        description: 'Famous for its spectacular ring system.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/06/saturn-farewell-pia21345.jpg',
        distance: '9.54 AU from Sun',
        size: '116,460 km diameter',
        mass: '5.68 × 10²⁶ kg',
        temperature: '-178°C average',
        composition: 'Hydrogen and helium',
        discoveryDate: 'Ancient',
        facts: [
          'Rings made of ice and rock',
          '82 confirmed moons',
          'Least dense planet (would float)',
          'Titan has thick atmosphere',
        ],
      },
      {
        id: 7,
        name: 'Uranus',
        type: 'Ice Giant',
        description: 'An ice giant that rotates on its side.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/06/uranus-pia18182.jpg',
        distance: '19.19 AU from Sun',
        size: '50,724 km diameter',
        mass: '8.68 × 10²⁵ kg',
        temperature: '-224°C average',
        composition: 'Water, methane, ammonia ices',
        discoveryDate: '1781 (William Herschel)',
        facts: [
          'Rotates on its side (98° tilt)',
          '27 known moons',
          'Blue-green from methane',
          'Faint ring system',
        ],
      },
      {
        id: 8,
        name: 'Neptune',
        type: 'Ice Giant',
        description: 'The windiest planet with supersonic storms.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/06/neptune-pia01492.jpg',
        distance: '30.07 AU from Sun',
        size: '49,244 km diameter',
        mass: '1.02 × 10²⁶ kg',
        temperature: '-214°C average',
        composition: 'Water, methane, ammonia ices',
        discoveryDate: '1846 (Johann Galle)',
        facts: [
          'Fastest winds: 2,100 km/h',
          '14 known moons',
          'Great Dark Spot (storm)',
          'Farthest planet from Sun',
        ],
      },
    ],
    stars: [
      {
        id: 101,
        name: 'Sun',
        type: 'G-type Main Sequence Star',
        description: 'Our star, providing energy and light to the solar system.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/09/sun-as-seen-by-nasa-solar-dynamics-observatory-1600-0.jpg',
        distance: '8 light-minutes from Earth',
        size: '1.39 million km diameter',
        mass: '1.99 × 10³⁰ kg',
        temperature: '5,500°C (surface) / 15M°C (core)',
        composition: '73% Hydrogen, 25% Helium',
        discoveryDate: 'N/A',
        facts: [
          '4.6 billion years old',
          'Powers life on Earth',
          'Nuclear fusion in core',
          'Will become red giant in 5 billion years',
        ],
      },
      {
        id: 102,
        name: 'Proxima Centauri',
        type: 'Red Dwarf Star',
        description: 'The closest star to our solar system.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/09/stsci-01evvdxznhqy6bpfya3rma6p54.png',
        distance: '4.24 light-years',
        size: '200,000 km diameter',
        mass: '0.12 × Solar Mass',
        temperature: '3,042°C',
        composition: 'Hydrogen and helium',
        discoveryDate: '1915',
        facts: [
          'Part of Alpha Centauri system',
          'Has exoplanet Proxima b',
          'Very faint, not visible to naked eye',
          'Will be closest star for 33,000 years',
        ],
      },
    ],
    nebulae: [
      {
        id: 201,
        name: 'Orion Nebula',
        type: 'Emission Nebula',
        description: 'A stellar nursery where new stars are born.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/09/orion-nebula-hs-2006-01-a-web.jpg',
        distance: '1,344 light-years',
        size: '24 light-years across',
        mass: '2,000 solar masses',
        temperature: '10,000 K',
        composition: 'Hydrogen, helium, dust',
        discoveryDate: '1610 (Nicolas-Claude Fabri de Peiresc)',
        facts: [
          'Visible to naked eye',
          'Brightest nebula in sky',
          'Contains Trapezium star cluster',
          'Forming 700 new stars',
        ],
      },
      {
        id: 202,
        name: 'Crab Nebula',
        type: 'Supernova Remnant',
        description: 'Remnant of a supernova observed in 1054 AD.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/09/crab-nebula-hs-2005-37-a-web.jpg',
        distance: '6,500 light-years',
        size: '11 light-years across',
        mass: '4.6 solar masses',
        temperature: 'Varies greatly',
        composition: 'Expanding gas and dust',
        discoveryDate: '1731 (John Bevis)',
        facts: [
          'Expanding at 1,500 km/s',
          'Contains pulsar (neutron star)',
          'Pulses 30 times per second',
          'Supernova seen in 1054 AD',
        ],
      },
    ],
    galaxies: [
      {
        id: 301,
        name: 'Milky Way',
        type: 'Barred Spiral Galaxy',
        description: 'Our home galaxy containing 200-400 billion stars.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/04/milky-way-center-spitzer.jpg',
        distance: '0 (we are inside)',
        size: '105,000 light-years diameter',
        mass: '1.5 trillion solar masses',
        temperature: 'Varies',
        composition: 'Stars, gas, dust, dark matter',
        discoveryDate: 'Ancient',
        facts: [
          '200-400 billion stars',
          'Solar system 26,000 ly from center',
          'Supermassive black hole at center',
          'On collision course with Andromeda',
        ],
      },
      {
        id: 302,
        name: 'Andromeda Galaxy',
        type: 'Spiral Galaxy',
        description: 'The nearest large galaxy to the Milky Way.',
        imageUrl: 'https://science.nasa.gov/wp-content/uploads/2023/09/andromeda-galaxy-hs-2012-32-a-web.jpg',
        distance: '2.537 million light-years',
        size: '220,000 light-years diameter',
        mass: '1.5 trillion solar masses',
        temperature: 'Varies',
        composition: 'Stars, gas, dust',
        discoveryDate: '964 AD (Abd al-Rahman al-Sufi)',
        facts: [
          'Largest galaxy in Local Group',
          '1 trillion stars',
          'Will merge with Milky Way in 4.5 billion years',
          'Visible to naked eye',
        ],
      },
    ],
  }

  const categories = [
    { label: 'PLANETS', value: 'planets', icon: <PublicIcon /> },
    { label: 'STARS', value: 'stars', icon: <StarIcon /> },
    { label: 'NEBULAE', value: 'nebulae', icon: <ExploreIcon /> },
    { label: 'GALAXIES', value: 'galaxies', icon: <InfoIcon /> },
  ]

  const currentObjects = celestialObjects[categories[selectedCategory].value] || []

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <ExploreIcon sx={{ color: 'primary.main' }} />
          <Typography
            variant="h6"
            sx={{
              color: 'primary.main',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
            }}
          >
            CELESTIAL OBJECT DATABASE
          </Typography>
        </Box>

        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          textColor="inherit"
          indicatorColor="primary"
          sx={{
            mb: 3,
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            },
          }}
        >
          {categories.map((cat, idx) => (
            <Tab
              key={idx}
              icon={cat.icon}
              label={cat.label}
              iconPosition="start"
              sx={{ fontFamily: 'Share Tech Mono', fontSize: '0.75rem' }}
            />
          ))}
        </Tabs>

        <Grid container spacing={2}>
          {currentObjects.map((obj) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={obj.id}>
              <Card
                sx={{
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 0 25px rgba(0, 255, 255, 0.3)',
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box
                  sx={{
                    height: 200,
                    overflow: 'hidden',
                    borderBottom: '1px solid rgba(0, 255, 255, 0.3)',
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                    position: 'relative',
                  }}
                >
                  <img
                    src={obj.imageUrl}
                    alt={obj.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                    }}
                  >
                    <Chip
                      label={obj.type}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(0, 255, 255, 0.2)',
                        color: 'primary.main',
                        backdropFilter: 'blur(10px)',
                        fontFamily: 'Share Tech Mono',
                        fontSize: '0.65rem',
                      }}
                    />
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'primary.main',
                      mb: 1,
                      fontWeight: 700,
                    }}
                  >
                    {obj.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 2,
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {obj.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    {[
                      { label: 'DISTANCE', value: obj.distance },
                      { label: 'SIZE', value: obj.size },
                      { label: 'MASS', value: obj.mass },
                      obj.temperature ? { label: 'TEMP', value: obj.temperature } : null,
                    ]
                      .filter(Boolean)
                      .map((item: any, idx) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.65rem',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {item.label}:
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'primary.light',
                              fontFamily: 'Share Tech Mono',
                              fontSize: '0.7rem',
                            }}
                          >
                            {item.value}
                          </Typography>
                        </Box>
                      ))}
                  </Box>

                  <Box
                    sx={{
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px solid rgba(0, 255, 255, 0.2)',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.65rem',
                        display: 'block',
                        mb: 0.5,
                      }}
                    >
                      KEY FACTS:
                    </Typography>
                    {obj.facts.slice(0, 2).map((fact, idx) => (
                      <Typography
                        key={idx}
                        variant="caption"
                        sx={{
                          color: 'text.primary',
                          fontSize: '0.7rem',
                          display: 'block',
                          lineHeight: 1.4,
                        }}
                      >
                        • {fact}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 3,
            p: 1.5,
            bgcolor: 'rgba(0, 255, 255, 0.05)',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            borderRadius: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'Share Tech Mono' }}>
            📡 DISPLAYING {currentObjects.length} OBJECTS IN {categories[selectedCategory].label} CATEGORY • NASA IMAGERY
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
