import { School } from 'lucide-react';
import { ViewField } from './ViewField';

/**
 * Sección de Escolarización en modo solo lectura
 */
export const SectionViewSchoolingData = ({ data }) => {
  const repeatCourse = data?.repeat_course === 'true' || data?.repeat_course === true || data?.repeat_course === 1;
  const schoolChanges = data?.school_changes === 'true' || data?.school_changes === true || data?.school_changes === 1;

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
          <ViewField label="Año de escolaridad" value={data?.schooling_year} />
        </div>
        <div className="col-md-2 mb-3">
          <ViewField label="Curso actual" value={data?.current_course} />
        </div>
        <div className="col-md-7 mb-3">
          <ViewField label="Colegio" value={data?.school_name} />
        </div>
        <div className="col-md-12 mb-3">
          <ViewField label="Orientación" value={data?.orientation} />
        </div>
        <div className="col-md-3 mb-3">
          <div className="form-group">
            <label className="form-label">¿Repitió año escolar?</label>
            <div className="form-control" style={{ 
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              padding: '0.375rem 0.75rem'
            }}>
              {repeatCourse ? 'Sí' : 'No'}
            </div>
          </div>
        </div>
        <div className="col-md-9 mb-3">
          <ViewField 
            label="Motivo de repetición" 
            value={repeatCourse ? data?.repeat_course_reason : '-'} 
            type={repeatCourse ? 'text' : 'text'}
          />
        </div>
        <div className="col-md-3 mb-3">
          <div className="form-group">
            <label className="form-label">¿Cambios de colegio?</label>
            <div className="form-control" style={{ 
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              padding: '0.375rem 0.75rem'
            }}>
              {schoolChanges ? 'Sí' : 'No'}
            </div>
          </div>
        </div>
        <div className="col-md-9 mb-3">
          <ViewField 
            label="Motivo de cambios de colegio" 
            value={schoolChanges ? data?.school_changes_reason : '-'} 
            type={schoolChanges ? 'text' : 'text'}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <ViewField label="Nivel inicial (cómo fue, dificultades, etc.)" value={data?.initial_level} type="textarea" />
        </div>
        <div className="col-md-6 mb-3">
          <ViewField label="Nivel primario (cómo fue, dificultades, etc.)" value={data?.primary_level} type="textarea" />
        </div>
        <div className="col-md-6 mb-3">
          <ViewField label="Nivel secundario (cómo fue, dificultades, etc.)" value={data?.secondary_level} type="textarea" />
        </div>
        <div className="col-md-6 mb-3">
          <ViewField label="Observaciones escolares" value={data?.general_remarks} type="textarea" />
        </div>
      </div>
    </section>
  );
};
