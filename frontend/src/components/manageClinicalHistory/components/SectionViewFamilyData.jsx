import { Home } from 'lucide-react';
import { SectionViewFatherData } from './SectionViewFatherData';
import { SectionViewMotherData } from './SectionViewMotherData';
import { SectionViewSiblingsData } from './SectionViewSiblingsData';
import { SectionViewFamilyExtraData } from './SectionViewFamilyExtraData';

/**
 * Sección de datos familiares en modo solo lectura
 */
export const SectionViewFamilyData = ({ data }) => {
  return (
    <section className="fi-section">
      <div className="fi-section-header">
        <div className="fi-section-icon fi-section-icon-secondary">
          <Home size={18} />
        </div>
        <h3>Datos familiares</h3>
      </div>
      <div className="row">
        <SectionViewFatherData data={data} />
        <SectionViewMotherData data={data} />
      </div>
      <SectionViewSiblingsData data={data} />
      <SectionViewFamilyExtraData data={data} />
    </section>
  );
};
