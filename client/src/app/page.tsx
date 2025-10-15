import SolarSystem from '@/components/visualizations/SolarSystem';
import ISSTrackerMap from '@/components/visualizations/ISSTrackerMap';
import MissionStatus from '@/components/dashboard/MissionStatus';
import LaunchCalendar from '@/components/dashboard/LaunchCalendar';
import PlanetCard from '@/components/ui/PlanetCard';

export default function Home() {
  return (
    <main>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>Space Exploration Data Dashboard</h1>
      </header>
      
      <div style={{ display: 'flex' }}>
        <div style={{ width: '70%' }}>
          <SolarSystem />
        </div>
        <div style={{ width: '30%', padding: '1rem' }}>
          <ISSTrackerMap />
          <MissionStatus />
          <LaunchCalendar />
        </div>
      </div>

      <section style={{ padding: '1rem' }}>
        <h2>Celestial Objects</h2>
        <div style={{ display: 'flex' }}>
          <PlanetCard name="Mars" description="The fourth planet from the Sun." />
          <PlanetCard name="Jupiter" description="The largest planet in our solar system." />
        </div>
      </section>
    </main>
  )
}
