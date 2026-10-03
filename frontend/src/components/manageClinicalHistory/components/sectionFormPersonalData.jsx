import { useWatch } from 'react-hook-form';
import { User } from 'lucide-react';
import { Input } from '../../form';
import { calculateAge } from '../../../utils/age';

/**
 * Sección de datos personales del formulario de primera entrevista
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.control - Objeto de control de React Hook Form
 * @param {Object} props.errors - Objeto de errores de React Hook Form
 * @param {string} props.formId - ID del formulario (para generar IDs únicos)
 */
export const SectionFormPersonalData = ({ control, errors, formId }) => {
  // Observar cambios en birth_date para calcular la edad automáticamente
  const birthDate = useWatch({
    control,
    name: 'birth_date',
  });

  // Calcular edad desde birth_date
  const edadCalculada = birthDate ? calculateAge(birthDate) : '';

  return (
    <section className="fi-section">
      <div className="fi-section-header">
        <div className="fi-section-icon fi-section-icon-primary">
          <User size={18} />
        </div>
        <h3>Datos personales</h3>
      </div>
      <div className="row">
        <div className="col-md-4 mb-3">
          <Input
            name="complete_name"
            label="Nombre completo"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            disabled={true}
          />
        </div>
        <div className="col-md-4 mb-3">
          <Input
            name="birth_date"
            label="Fecha de nacimiento"
            control={control}
            errors={errors}
            type="date"
            formId={formId}
            // rules={{ required: "La fecha de nacimiento es requerida." }}
          />
        </div>
        <div className="col-md-4 mb-3">
          <div className="form-group">
            <label className="form-label">Edad</label>
            <span className="age-data-patient">{edadCalculada}</span>
          </div>
        </div>
        <div className="col-12 mb-3">
          <Input
            name="address"
            label="Dirección"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            // rules={{ required: "La dirección de residencia es requerida." }}
          />
        </div>
        <div className="col-md-4 mb-3">
          <Input
            name="phone"
            label="Teléfono de contacto"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            placeholder="3511234567"
            // rules={{ required: "El teléfono de contacto es requerido." }}
          />
        </div>
        <div className="col-md-8 mb-3">
          <Input
            name="domestic_cohabitation"
            label="Con quién vive (convivencia doméstica)"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            placeholder="Ej: con sus padres y dos hermanos..."
            // rules={{ required: "Debe especificar con quién vive el paciente." }}
          />
        </div>
      </div>
    </section>
  );
};