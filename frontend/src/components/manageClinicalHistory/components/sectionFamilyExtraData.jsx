import { Input } from '../../form';

/**
 * Sección de información extra de datos familiares:
 * - Otras personas convivientes
 * - Genograma
 * - Dinámicas familiares
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.control - Objeto de control de React Hook Form
 * @param {Object} props.errors - Objeto de errores de React Hook Form
 * @param {string} props.formId - ID del formulario (para generar IDs únicos)
 */
export const SectionFamilyExtraData = ({ control, errors, formId }) => {
  return (
    <>
      <section className="fi-section">
        <div className="fi-card">
          <h4>Información extra</h4>
          <div className="mt-3 mb-3">
            <Input
              name="non_domestic_cohabitation"
              label="Otras personas convivientes (convivencia no doméstica)"
              control={control}
              errors={errors}
              type="textarea"
              formId={formId}
              placeholder="Nombre, edad, parentesco..."
              // rules={{ required: "Debe especificar otras personas convivientes." }}
            />
          </div>
          <div className="row">
            <div className="col-md-6">
              <Input
                name="genogram"
                label="Genograma"
                control={control}
                errors={errors}
                type="textarea"
                formId={formId}
                placeholder="Descripción del genograma familiar..."
                // rules={{ required: "El genograma es requerido." }}
              />
            </div>
            <div className="col-md-6">
              <Input
                name="family_dynamics"
                label="Dinámicas familiares"
                control={control}
                errors={errors}
                type="textarea"
                formId={formId}
                placeholder="Ej: Límites, acuerdos, actividades, sobreprotección, exigencia, resignación, frustración, ansiedad, indiferencia, comprensión, aceptación o rechazo, etc."
                // rules={{ required: "Las dinámicas familiares son requeridas." }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

