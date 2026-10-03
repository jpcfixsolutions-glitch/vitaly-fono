import React, { useState } from 'react';
import { Form, Input } from '../../form'; 
import { Calendar, Clock } from 'lucide-react';
import { extractDate, extractTime } from '../../../utils';
import SessionFiles from './SessionFiles';
import FilePreviewModal from './FilePreviewModal';

export const FormSession = ({
  idModal,
  formId,
  onSubmit,
  loading = false,
  error = null,
  errorMessage = null,
  successMessage = null,
  initialValues = null,
}) => {

  const [previewFile, setPreviewFile] = useState(null);

  return (
    <Form
      idModal={idModal}
      formId={formId}
      onSubmit={onSubmit}
      loading={loading}
      error={error}
      errorMessage={errorMessage}
      successMessage={successMessage}
      initialValues={initialValues}
    >
      {({ control, errors }) => (
        <div className="row g-3">
          
          <div className="col-12">
            <div className="form-group">
              <label className="mb-2">
                Fecha y hora de la sesión
              </label>
              
              <div className="d-flex align-items-center gap-3 p-2 bg-light rounded border">
                {(() => {
                  const dateSrc = initialValues?.session_date || initialValues?.date;
                  if (!dateSrc) return <span className="text-muted">-</span>;
                  
                  return (
                    <>
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={18} style={{ color: '#Eab308' }} /> 
                        <span className="fw-medium text-dark">
                          {extractDate(dateSrc)}
                        </span>
                      </div>

                      <div style={{ width: '1px', height: '16px', backgroundColor: '#e5e7eb' }}></div>

                      <div className="d-flex align-items-center gap-2">
                        <Clock size={18} className="text-muted" />
                        <span className="fw-medium font-weight-bold text-dark">
                          {extractTime(dateSrc)} hs
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="col-12 mt-1 mb-0">
            <Input
              name="clinical_notes"
              label="Observaciones de la sesión"
              type="textarea"
              control={control}
              errors={errors}
              placeholder="Escriba aquí la evolución del paciente..."
              rules={{ required: 'Las notas clínicas son obligatorias' }}
              formId={formId}
              rows={10} 
            />
          </div>

          <hr></hr>

          <div className="col-12 mt-1">
            <SessionFiles
              sessionId={initialValues.id}
              onPreview={(file) => setPreviewFile(file)}
              readOnly={false}
            />
          </div>

          {previewFile && (
            <FilePreviewModal
              file={previewFile}
              onClose={() => setPreviewFile(null)}
            />
          )}
        </div>
      )}
    </Form>
  );
};
