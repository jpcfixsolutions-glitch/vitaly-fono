import { useState } from 'react';
import { Users as UsersIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Section, ModalPost, ModalUpdate, SearchFilters, ViewData, Container } from '../';
import { useGetAllPatients, usePatientSearch, usePatientSubmitUpdate, usePatientSubmitPost } from './hooks';
import { useGetDocumentTypes, useGet } from '../../hooks';
import { useAuth } from '../../context/useAuth';
import { FormPatient, PatientDetailModal, buildPatientColumns, RowActions } from './components';
import { transformSelectOptions, patientFilterConfig } from './utils';
import { handleGoToClinicalHistory, handleOpenView } from './handlers';

import './managePatients.css';

export const ManagePatients = () => {
  const navigate = useNavigate();

  const [selectedPatient, setSelectedPatient] = useState(null);

  // Hook personalizado para obtener la lista de pacientes
  const { 
    dataPatient, 
    loading: apiLoadingGetPatient, 
    error: apiErrorGetPatient 
  } = useGetAllPatients();

  // Hook unificado para búsqueda y filtrado de pacientes
  const { filteredPatients, handleFilterChange } = usePatientSearch(dataPatient);

  // Hook para obtener los tipos de documentos
  const { documentTypes } = useGetDocumentTypes();

  const { user } = useAuth();
  const isReception = user?.role === 'Recepción';

  const { dataGet: usersData, loading: apiLoadingUsers } = useGet({
    url: '/usuarios',
    method: 'GET',
    autoFetch: isReception,
    needFilterByUser: false,
  });
  
  const usersList = Array.isArray(usersData?.data) ? usersData.data : [];
  const speechTherapistsList = usersList.filter(u => u.role === 'Fonoaudiólogo/a');
  const transformedUsers = transformSelectOptions(
    speechTherapistsList.map(u => ({ ...u, full_name: `${u.name} ${u.last_name}` })),
    'full_name'
  );

  // ToDo: hacer un hook para obtener las obras sociales
  const { dataGet: dataObraSocial } = useGet({ 
    url: "/obras-sociales", 
    method: "GET", 
    autoFetch: true 
  });

  // Transformar los datos de los documentos y las obras sociales para el componente Select
  const transformedDocumentTypes = transformSelectOptions(documentTypes);
  const transformedHealthInsurance = transformSelectOptions(dataObraSocial);

  // Construir las columnas de la tabla de pacientes
  const columns = buildPatientColumns(dataPatient);
  
  // Abrir modal de vista
  const onOpenView = handleOpenView(dataPatient, setSelectedPatient);

  // Navegar a la historia clínica del paciente
  const onGoToClinicalHistory = handleGoToClinicalHistory(navigate);

  // Hook personalizado para crear un nuevo paciente
  const { 
    successMessage,
    errorMessage,
    isLoading: isLoadingPostPatient,
    apiLoadingPostPatient,
    apiErrorPostPatient,
    onSubmitPatient
  } = usePatientSubmitPost();

  // Hook personalizado de actualización de un paciente
  const { 
    successMessage: successMessageUpdatePatient,
    errorMessage: errorMessageUpdatePatient,
    isLoading: isLoadingUpdatePatient,
    apiLoadingUpdatePatient,
    apiErrorUpdatePatient,
    onUpdatePatient
  } = usePatientSubmitUpdate(selectedPatient, transformedDocumentTypes, transformedHealthInsurance);

  return (
    <>
      <Container>
        <Section
          Icon={UsersIcon}
          title="Gestión de Pacientes"
          description="Mantén un registro completo y actualizado de los datos personales y de contacto de cada paciente.">

          <SearchFilters
            filters={patientFilterConfig}
            onFilterChange={handleFilterChange} 
          />
          
          <ViewData
            data={{ data: filteredPatients }}
            apiLoading={apiLoadingGetPatient} 
            apiError={apiErrorGetPatient}
            message="No hay pacientes registrados."
            columns={columns}
            title="Listado de Pacientes"
            buttonLabel="Registrar Paciente"
            buttonDataBsTarget="#formAddPatient"
            buttonClassName="btn-add-patient"
            dataBsTargetUpdate='#updatePatientModal'
            dataBsTargetView="#patientDetailModal"
            renderRowActions={(row) => (
              <RowActions
                row={row}
                handleOpenView={onOpenView}
                setUpdateData={setSelectedPatient}
                handleGoToClinicalHistory={onGoToClinicalHistory}
              />
            )}
          />
        </Section>
      </Container>

      <ModalPost
        id='formAddPatient'
        title="Registrar nuevo paciente"
        formId='formAddPatientForm'
        loading={isLoadingPostPatient}
      >
        <FormPatient
          idModal='formAddPatient'
          formId='formAddPatientForm'
          onSubmit={onSubmitPatient}
          loading={apiLoadingPostPatient || isLoadingPostPatient}
          error={apiErrorPostPatient}
          errorMessage={errorMessage}
          successMessage={successMessage}
          documentTypes={transformedDocumentTypes}
          healthInsurance={transformedHealthInsurance}
          users={transformedUsers}
          isReception={isReception}
        />
      </ModalPost>

      <ModalUpdate
        id='updatePatientModal'
        title="Editar Paciente"
        formId='formUpdatePatientForm'
        loading={isLoadingUpdatePatient}
        disabled={selectedPatient?.status === 'Inactivo'}
      >
        <FormPatient
          idModal='updatePatientModal'
          formId='formUpdatePatientForm'
          onSubmit={onUpdatePatient}
          loading={apiLoadingUpdatePatient || isLoadingUpdatePatient}
          error={apiErrorUpdatePatient}
          errorMessage={errorMessageUpdatePatient}
          successMessage={successMessageUpdatePatient}
          initialValues={selectedPatient || {}}
          documentTypes={transformedDocumentTypes}
          healthInsurance={transformedHealthInsurance}
          disabled={selectedPatient?.status === 'Inactivo'}
          users={transformedUsers}
          isReception={isReception}
        />
      </ModalUpdate>

      <PatientDetailModal patient={selectedPatient} />
    </>
  );
};
