import { Settings as SettingsIcon } from 'lucide-react';
import { Section } from "../layout/section";
import { Container } from "../layout/container";
import { PaymentMethod, ObraSocial, TypeService, DocumentType, ConfigureTimetable } from "../";
import { useScrollToHash } from "../../hooks";

import './configureParameters.css';

export const ConfigureParameters = () => {

  useScrollToHash({ headerOffset: 80, delay: 1200, behavior: 'smooth' });

  return (
    <>
      <Container>
        <Section
          Icon={SettingsIcon}
          title="Configuración"
          description="Configura la aplicación para que se ajuste a tus necesidades.">

          <div className="functionality-container-functions">
            <div className="functionality-container-functions-item">
              <PaymentMethod />
            </div>
            <div className="functionality-container-functions-item">
              <ObraSocial />
            </div>
            <div className="functionality-container-functions-item">
              <DocumentType />
            </div>
          </div>

          <div className="functionality-container-function">
          <div className="functionality-container-functions-item">
              <TypeService />
            </div>
          </div>

          <div className="functionality-container-function">
            <div className="functionality-container-function-item">
              <ConfigureTimetable />
            </div>
          </div>

        </Section>
      </Container>
    </>
  );
};
