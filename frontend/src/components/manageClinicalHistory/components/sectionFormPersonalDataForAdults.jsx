import { useWatch, Controller } from 'react-hook-form';
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
export const SectionFormPersonalDataForAdults = ({ control, errors, formId }) => {
  // Observar cambios en birth_date para calcular la edad automáticamente
  const birthDate = useWatch({
    control,
    name: 'birth_date',
  });

  // Observar si repite para habilitar / requerir el motivo
  const hasHadTherapy = useWatch({
    control,
    name: 'has_had_therapy',
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
            name="civil_status"
            label="Estado civil"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            placeholder="Ej: Soltero, Casado, Divorciado, etc."
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
        <div className="col-md-4 mb-3">
          <Input
            name="second_phone"
            label="Segundo teléfono de contacto"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            placeholder="3511234567"
            // rules={{ required: "El teléfono de contacto es requerido." }}
          />
        </div>
        <div className="col-md-12 mb-3">
          <Input
            name="living_with"
            label="Con quién vive"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            placeholder="Ej: con su pareja..."
            // rules={{ required: "Debe especificar con quién vive el paciente." }}
          />
        </div>
        <div className="col-md-12 mb-3">
          <Input
            name="profession"
            label="A qué se dedica"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            placeholder="Ej: médico, profesor, etc."
            // rules={{ required: "Debe especificar la profesión del paciente." }}
          />
        </div>
        <div className="col-md-12 mb-3">
          <Input
            name="derivation"
            label="Derivación / Cómo llegó acá"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            placeholder="Ej: derivado por un profesional, por un familiar, etc."
            // rules={{ required: "Debe especificar la derivación del paciente." }}
          />
        </div>
        <div className="col-md-3 mb-3">
          <div className="form-group">
            <label htmlFor={formId ? `${formId}_has_had_therapy` : 'has_had_therapy'}>
              {/* ¿Ha tenido terapia? <span className="required-asterisk">*</span> */}
              ¿Ha tenido terapia psicológica?
            </label>
            <Controller
              name="has_had_therapy"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <select
                  id={formId ? `${formId}_has_had_therapy` : 'has_had_therapy'}
                  className="form-select"
                  value={field.value ? 'true' : 'false'}
                  onChange={(e) => field.onChange(e.target.value === 'true')}
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              )}
            />
          </div>
        </div>
        <div className="col-md-2 mb-3">
          <Input
            name="therapy_duration"
            label="Cuánto"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            disabled={!hasHadTherapy}
            // rules={hasHadTherapyMotivoRules} 
          />
        </div>
        <div className="col-md-7 mb-3">
          <Input
            name="reason_for_leaving_therapy"
            label="Motivo de salida de la terapia"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            disabled={!hasHadTherapy}
            // rules={hasHadTherapyMotivoRules} 
          />
        </div>
        <div className="col-md-12 mb-3">
          <Input
            name="current_therapy_type"
            label="Corriente"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            disabled={!hasHadTherapy}
            // rules={hasHadTherapyMotivoRules} 
          />
        </div>      
      </div>
    </section>
  );
};