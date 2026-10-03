import { School } from 'lucide-react';
import { Input } from '../../form';
import { useWatch, Controller } from 'react-hook-form';

/**
 * Sección de Escolarización
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.control - Objeto de control de React Hook Form
 * @param {Object} props.errors - Objeto de errores de React Hook Form
 * @param {string} props.formId - ID del formulario (para generar IDs únicos)
 */
export const SectionSchoolingData = ({ control, errors, formId }) => {
  // Observar si repite para habilitar / requerir el motivo
  const repeatCourse = useWatch({
    control,
    name: 'repeat_course',
  });

  // Observar si hubo cambios de colegio para habilitar / requerir el motivo
  const schoolChanges = useWatch({
    control,
    name: 'school_changes',
  });

  // const repeatCourseMotivoRules = repeatCourse
  //   ? { required: 'El motivo de repetición es requerido si el alumno repite.' }
  //   : {};

  // const schoolChangesMotivoRules = schoolChanges
  //   ? { required: 'El motivo de cambios de colegio es requerido si hubo cambios de colegio.' }
  //   : {};

  return (
    <section className="fi-section">
      <div className="fi-section-header">
        <div className="fi-section-icon fi-section-icon-secondary">
          <School size={18} />
        </div>
        <h3>Escolarización</h3>
      </div>
      <div className="row">
        <div className="col-md-3 mb-3">
          <Input
            name="schooling_year"
            label="Año de escolaridad"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            placeholder="Ej: 5to año"
            // rules={{ required: 'El año de escolaridad es requerido.' }}
          />
        </div>
        <div className="col-md-2 mb-3">
          <Input
            name="current_course"
            label="Curso actual"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            placeholder="Ej: B"
            // rules={{ required: 'El curso actual es requerido.' }}
          />
        </div>
        <div className="col-md-7 mb-3">
          <Input
            name="school_name"
            label="Colegio"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            // rules={{ required: 'El colegio es requerido.' }}
          />
        </div>
        <div className="col-md-12 mb-3">
          <Input
            name="orientation"
            label="Orientación"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            // rules={{ required: 'La orientación es requerida.' }}
          />
        </div>
        <div className="col-md-3 mb-3">
          <div className="form-group">
            <label htmlFor={formId ? `${formId}_repeat_course` : 'repeat_course'}>
              {/* ¿Repitió año escolar? <span className="required-asterisk">*</span> */}
              ¿Repitió año escolar?
            </label>
            <Controller
              name="repeat_course"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <select
                  id={formId ? `${formId}_repeat_course` : 'repeat_course'}
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
        <div className="col-md-9 mb-3">
          <Input
            name="repeat_course_reason"
            label="Motivo de repetición"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            disabled={!repeatCourse}
            // rules={repeatCourseMotivoRules} 
          />
        </div>
        <div className="col-md-3 mb-3">
          <div className="form-group">
            <label htmlFor={formId ? `${formId}_school_changes` : 'school_changes'}>
              {/* ¿Cambios de colegio? <span className="required-asterisk">*</span> */}
              ¿Cambios de colegio?
            </label>
            <Controller
              name="school_changes"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <select
                  id={formId ? `${formId}_school_changes` : 'school_changes'}
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
        <div className="col-md-9 mb-3">
          <Input
            name="school_changes_reason"
            label="Motivo de cambios de colegio"
            control={control}
            errors={errors}
            type="text"
            formId={formId}
            disabled={!schoolChanges}
            // rules={schoolChangesMotivoRules}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Input
            name="initial_level"
            label="Nivel inicial (cómo fue, dificultades, etc.)"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            // rules={{ required: 'El nivel inicial es requerido.' }}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Input
            name="primary_level"
            label="Nivel primario (cómo fue, dificultades, etc.)"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            // rules={{ required: 'El nivel primario es requerido.' }}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Input
            name="secondary_level"
            label="Nivel secundario (cómo fue, dificultades, etc.)"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            // rules={{ required: 'El nivel secundario es requerido.' }}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Input
            name="general_remarks"
            label="Observaciones escolares"
            control={control}
            errors={errors}
            type="textarea"
            formId={formId}
            // rules={{ required: 'Las observaciones escolares son requeridas.' }}
          />
        </div>
      </div>
    </section>
  );
};

