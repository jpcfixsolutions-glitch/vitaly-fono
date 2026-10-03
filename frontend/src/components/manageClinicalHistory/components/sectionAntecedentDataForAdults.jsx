import { Activity } from 'lucide-react';
import { Input } from '../../form';

/**
 * Sección de Antecedentes patológicos y del desarrollo
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.control - Objeto de control de React Hook Form
 * @param {Object} props.errors - Objeto de errores de React Hook Form
 * @param {string} props.formId - ID del formulario (para generar IDs únicos)
 */
export const SectionAntecedentDataForAdults = ({ control, errors, formId }) => {
  return (
    <section className="fi-section">
      <div className="fi-section-header">
        <div className="fi-section-icon fi-section-icon-primary">
          <Activity size={18} />
        </div>
        <h3>Antecedentes</h3>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Input
            name="pathologies_diseases"
            label="Patologías/Enfermedades Actuales/Anteriores"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            placeholder="Ej: Diabetes, Hipertensión, Depresión, etc."
            // rules={{ required: 'El campo Generales es requerido.' }}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Input
            name="medication"
            label="Medicación (Qué/cuánto/por qué)"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            placeholder="Ej: Ibuprofeno 400mg, 3 veces al día por 5 días, por dolor de cabeza."
            // rules={{ required: 'El campo Generales es requerido.' }}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Input
            name="substance_alcohol_consumption"
            label="Consumo de sustancias/alcohol (frecuencia/qué consume)"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            placeholder="Ej: Fuma 20 cigarrillos al día, bebe 3 copas de vino por semana."
            // rules={{ required: 'El campo Generales es requerido.' }}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Input
            name="hobbies_sports"
            label="Pasatiempo/Deportes (qué/frecuencia)"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            placeholder="Ej: Le gusta leer, juega tenis 3 veces por semana."
            // rules={{ required: 'El campo Generales es requerido.' }}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Input
            name="genogram"
            label="Familia (Genograma)"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            placeholder="Ej. Padre: Juan Pérez, Madre: María López, Hermano: Carlos Pérez."
            // rules={{ required: 'El campo Generales es requerido.' }}
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
            placeholder="Ej: Padre con hipertensión, Madre con depresión, Hermano con diabetes."
            // rules={{ required: 'El campo Generales es requerido.' }}
          />
        </div>
        <div className="col-md-12 mb-3">
          <Input
            name="negative_thoughts"
            label="Has tenido pensamientos o intentos de suicidio / Te has hecho daño / Has intentado quitarte la vida"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            placeholder="Ej: He tenido pensamientos de suicidio en las últimas semanas, me he hecho daño con un cuchillo."
            // rules={{ required: 'El campo Generales es requerido.' }}
          />
        </div>
        <div className="col-md-12 mb-3">
          <Input
            name="abuse_mistreatment"
            label="Has sufrido abuso/maltrato físico/psicológico"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            placeholder="Ej: He sufrido abuso físico por parte de mi pareja, he sido maltratado psicológicamente por mis padres."
            // rules={{ required: 'El campo Generales es requerido.' }}
          />
        </div>
        <div className="col-md-12 mb-3">
          <Input
            name="reason_for_consultation"
            label="Motivo de consulta"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            placeholder="Ej: Necesito ayuda para lidiar con mi ansiedad y depresión."
            // rules={{ required: 'El campo Generales es requerido.' }}
          />
        </div>
      </div>
    </section>
  );
};

