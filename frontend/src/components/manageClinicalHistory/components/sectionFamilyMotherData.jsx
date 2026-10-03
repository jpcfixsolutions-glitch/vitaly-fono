import { Input, Select } from '../../form';

/**
 * Sección de datos de la madre en el formulario de primera entrevista
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.control - Objeto de control de React Hook Form
 * @param {Object} props.errors - Objeto de errores de React Hook Form
 * @param {string} props.formId - ID del formulario (para generar IDs únicos)
 */
export const SectionFamilyMotherData = ({ control, errors, formId }) => {
  return (
    <div className="col-md-6 mb-3">
      <div className="fi-card">
        <h4>Madre</h4>
        <div className="row">
          <div className="col-12 mb-3">
            <Input
              name="mother_name"
              label="Nombre/s y apellido/s"
              control={control}
              errors={errors}
              type="text"
              formId={formId}
              // rules={{ required: "El nombre de la madre es requerido." }}
            />
          </div>
          <div className="col-md-6 mb-3">
            <Select
              name="mother_lives"
              label="Vive"
              control={control}
              errors={errors}
              formId={formId}
              options={['Si', 'No']}
              placeholder="Seleccione..."
              // rules={{ required: "Debe indicar si la madre vive." }}
            />
          </div>
          <div className="col-md-6 mb-3">
            <Input
              name="mother_age"
              label="Edad"
              control={control}
              errors={errors}
              type="number"
              formId={formId}
              rules={{ 
                // required: "La edad de la madre es requerida.",
                min: { value: 1, message: "La edad debe ser mayor a 0." },
                max: { value: 100, message: "La edad debe ser menor a 100." }
              }}
            />
          </div>
          <div className="col-12 mb-3">
            <Input
              name="mother_profession"
              label="Profesión / Estudios"
              control={control}
              errors={errors}
              type="textarea"
              formId={formId}
              // rules={{ required: "La profesión/estudios de la madre es requerida." }}
            />
          </div>
          <div className="col-12 mb-0">
            <Input
              name="mother_work_hours"
              label="Horarios laborales"
              control={control}
              errors={errors}
              type="text"
              formId={formId}
              placeholder="Ej: 9-18hs"
              // rules={{ required: "Los horarios laborales de la madre son requeridos." }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
