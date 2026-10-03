import { Home as HomeIcon } from 'lucide-react'
import { Section } from '../layout/section'
import { Container } from '../layout/container'
import { HomeCard } from './component'

import './home.css'

export const Home = ({ userName }) => {
  return (
    <Container>

      <Section
        Icon={HomeIcon}
        title="Inicio"
        description="Sistema de gestión integral para consultorio médico."
      />

      <HomeCard userName={userName} />

    </Container>
  );
}