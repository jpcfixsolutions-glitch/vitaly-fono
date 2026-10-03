import { useFieldArray } from 'react-hook-form';
import { Input } from '../../form';

/**
 * Sección de datos de hermanos en el formulario de primera entrevista
 * Usa useFieldArray para manejar una lista dinámica de hermanos.
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.control - Objeto de control de React Hook Form
 * @param {Object} props.errors - Objeto de errores de React Hook Form
 * @param {string} props.formId - ID del formulario (para generar IDs únicos)
 */
export const SectionFamilySiblingsData = ({ control, errors, formId }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'siblings',
  });

  const handleAddSibling = () => {
    append({ name: '', age: '', studies: '' });
  };

  const handleRemoveSibling = (index) => {
    remove(index);
  };

  return (
    <div className="fi-card mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Hermanos</h4>
        <button
          type="button"
          className="btn btn-sm btn-add-brother"
          onClick={handleAddSibling}
        >
          + Agregar hermano
        </button>
      </div>
      <div className="row">
        {fields.length > 0 ? (
          <>
            {fields.map((field, index) => (
              <div key={field.id || index} className="col-12">
                <div className="row align-items-end g-2">
                  <div className="col-md-5">
                    <Input
                      name={`siblings.${index}.name`}
                      label="Nombre/s y apellido/s"
                      control={control}
                      errors={errors}
                      type="text"
                      formId={formId}
                    />
                  </div>
                  <div className="col-md-1">
                    <Input
                      name={`siblings.${index}.age`}
                      label="Edad"
                      control={control}
                      errors={errors}
                      type="number"
                      formId={formId}
                    />
                  </div>
                  <div className="col-md-5">
                    <Input
                      name={`siblings.${index}.studies`}
                      label="Estudios"
                      control={control}
                      errors={errors}
                      type="text"
                      formId={formId}
                    />
                  </div>
                  <div className="col-md-1 form-group d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-outline-danger w-100 btn-remove-brother"
                      onClick={() => handleRemoveSibling(index)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="col-12">
            <p className="text-muted">No hay hermanos registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
};

