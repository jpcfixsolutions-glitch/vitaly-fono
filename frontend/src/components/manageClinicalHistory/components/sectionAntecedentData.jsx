import { Activity } from 'lucide-react';
import { Input } from '../../form';

/**
 * Sección de Antecedentes patológicos y del desarrollo
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.control - Objeto de control de React Hook Form
 * @param {Object} props.errors - Objeto de errores de React Hook Form
 * @param {string} props.formId - ID del formulario (para generar IDs únicos)
 */
export const SectionAntecedentData = ({ control, errors, formId }) => {
  return (
    <section className="fi-section">
      <div className="fi-section-header">
        <div className="fi-section-icon fi-section-icon-primary">
          <Activity size={18} />
        </div>
        <h3>Antecedentes patológicos y del desarrollo</h3>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Input
            name="perinatal_history"
            label="Perinatal"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            placeholder="Ej: Embarazo, Parto, Sufrimiento fetal, Cianosis, Ictericia, Inmadurez, Convulsiones, Fiebres, etc."
            // rules={{ required: 'El campo Perinatal es requerido.' }}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Input
            name="general_development"
            label="Generales (Marcha, Lenguaje, Control de esfínteres, Socialización)"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            placeholder="Desarrollo general del paciente..."
            // rules={{ required: 'El campo Generales es requerido.' }}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Input
            name="diseases_allergies"
            label="Enfermedades / Alergias (Medicamentos, suplementos)"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            placeholder="Ej: Asma, Diabetes, Hipertensión, etc."
            // rules={{ required: 'El campo Enfermedades / Alergias es requerido.' }}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Input
            name="family_pathology_history"
            label="Historia familiar (patologías/enfermedades mentales/físicas)"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            placeholder="Ej: Familiar depresivo, Familiar alcohólico, Familiar esquizofrénico, etc."
            // rules={{ required: 'El campo Historia familiar es requerido.' }}
          />
        </div>
      </div>
    </section>
  );
};

