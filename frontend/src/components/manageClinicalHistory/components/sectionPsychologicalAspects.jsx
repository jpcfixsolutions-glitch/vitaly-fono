import { Brain } from 'lucide-react';
import { Input } from '../../form';

/**
 * Sección de Aspectos psicológicos generales
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.control - Objeto de control de React Hook Form
 * @param {Object} props.errors - Objeto de errores de React Hook Form
 * @param {string} props.formId - ID del formulario (para generar IDs únicos)
 */
export const SectionPsychologicalAspects = ({ control, errors, formId }) => {
  return (
    <section className="fi-section">
      <div className="fi-section-header">
        <div className="fi-section-icon fi-section-icon-primary">
          <Brain size={18} />
        </div>
        <h3>Aspectos psicológicos generales</h3>
      </div>
      <div className="mb-3">
        <Input
          name="personality_description"
          label="Personalidad (descripción general)"
          control={control}
          errors={errors}
          type="textarea"
          formId={formId}
          placeholder="Describa brevemente rasgos de personalidad, forma de relacionarse, etc."
          // rules={{ required: 'La descripción de la personalidad es requerida.' }}
        />
      </div>
      <div className="mb-3">
        <Input
          name="reason_for_consultation"
          label="Motivo de consulta"
          control={control}
          errors={errors}
          type="textarea"
          formId={formId}
          // rules={{ required: 'El motivo de consulta es requerido.' }}
        />
      </div>
    </section>
  );
};

