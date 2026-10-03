import { Home } from 'lucide-react';
import { SectionFamilyFatherData } from './sectionFamilyFatherData';
import { SectionFamilyMotherData } from './sectionFamilyMotherData';
import { SectionFamilySiblingsData } from './sectionFamilySiblingsData';
import { SectionFamilyExtraData } from './sectionFamilyExtraData';

/**
 * Sección de datos familiares del formulario de primera entrevista
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.control - Objeto de control de React Hook Form
 * @param {Object} props.errors - Objeto de errores de React Hook Form
 * @param {string} props.formId - ID del formulario (para generar IDs únicos)
 */
export const SectionFamilyData = ({ control, errors, formId }) => {
  return (
    <section className="fi-section">
      <div className="fi-section-header">
        <div className="fi-section-icon fi-section-icon-secondary">
          <Home size={18} />
        </div>
        <h3>Datos familiares</h3>
      </div>
      <div className="row">
        <SectionFamilyFatherData 
          control={control} 
          errors={errors} 
          formId={formId}
        />
        <SectionFamilyMotherData 
          control={control} 
          errors={errors} 
          formId={formId}
        />
      </div>
      <SectionFamilySiblingsData 
        control={control} 
        errors={errors} 
        formId={formId}
      />
      <SectionFamilyExtraData 
        control={control} 
        errors={errors} 
        formId={formId}
      />
    </section>
  );
};
