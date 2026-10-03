import { Info, UserRound } from 'lucide-react';
import { Section } from '../layout/section';
import { useState } from 'react';
import { ViewData, Container } from '../';
import { ModalDelete, ModalPost, ModalUpdate } from '../modal';
import { FormRole, RowActions, buildRoleColumns } from './components';

import { useGetAllRoles, useGetPrivileges } from '../../hooks';

import { useSubmitPostRole,  useSubmitUpdateRole, useSubmitDeactivateRole } from './hooks';

import './roles.css';

export const Roles = () => {
  const [dataUpdateRole, setDataUpdateRole] = useState(null);
  const [dataDeactivate, setDataDeactivate] = useState(null);

  const [showInactive, setShowInactive] = useState(false);
  const [reactivatingId, setReactivatingId] = useState(null);

  // Hook personalizado para obtener la lista de roles
  const { 
    roles: dataRoles, 
    loading: apiLoadingGetRoles, 
    error: apiErrorGetRoles, 
    refetch: refetchRoles 
  } = useGetAllRoles(false);

  // Filtrar los roles según el estado de activación
  const filteredRoles = {
    data: Array.isArray(dataRoles?.data)
      ? dataRoles.data.filter(item => item.status === (showInactive ? 'Inactivo' : 'Activo'))
      : []
  };

  // Construir las columnas de la tabla de roles
  const columns = buildRoleColumns();

  // Hook personalizado para obtener privilegios (para el formulario)
  const { privileges: dataPrivileges } = useGetPrivileges();

  // Hook personalizado para crear un nuevo rol
  const { 
    successMessage,
    errorMessage,
    isLoading: isLoadingPostRole,
    apiLoadingPostRole,
    apiErrorPostRole,
    onSubmitRole
  } = useSubmitPostRole();

  // Hook personalizado de actualización de un rol
  const { 
    successMessage: successMessageUpdateRole,
    errorMessage: errorMessageUpdateRole,
    isLoading: isLoadingUpdateRole,
    apiLoadingUpdateRole,
    apiErrorUpdateRole,
    onUpdateRole
  } = useSubmitUpdateRole(dataUpdateRole);

  // Hook personalizado para enviar el formulario de dar de baja
  const {
    successMessage: successMessageDeactivateRole,
    errorMessage: errorMessageDeactivateRole,
    isLoading: isLoadingDeactivateRole,
    apiLoadingDeactivateRole,
    apiErrorDeactivateRole,
    onDeactivateRole,
  } = useSubmitDeactivateRole(dataDeactivate);

  // Manejador para reactivar un rol
  const onReactivate = async (row) => {
    setReactivatingId(row.id);

    // eslint-disable-next-line no-unused-vars
    const { privileges, ...dataToReactivate } = row;

    const response = await onUpdateRole({ ...dataToReactivate, status: "Activo" });
    if (response?.status === "success") {
      await refetchRoles();
      setShowInactive(false);
    }
    setReactivatingId(null);
  };

  return (
    <>
      <Container>
        <Section
          Icon={UserRound}
          title="Roles"
          description="Visualiza los perfiles de acceso junto con sus privilegios establecidos en el sistema">

          <div className="col-12 mt-0" style={{ backgroundColor: '#cc679b6c', padding: '10px', borderRadius: '5px' }}>
            <span className="text-muted"> <Info size={16} className="mb-1"/> Nota importante: Para crear un nuevo rol y que este tenga los permisos necesarios, se debe comunicar con los desarrolladores de la aplicación.</span>
          </div>

          <ViewData
            data={filteredRoles}
            apiLoading={apiLoadingGetRoles}
            apiError={apiErrorGetRoles}
            message="No hay roles registrados."
            columns={columns}
            classNameEspecificTable="table-roles"
            title=""
            buttonLabel="Crear Rol"
            buttonDataBsTarget="#createRoleModal"
            buttonClassName="btn-role"
            subSection={true}
            subSectionHandler={{
              setShowInactive,
              showInactive
            }}
            dataBsTargetUpdate='#updateRoleModal'
            dataBsTargetDeactivate="#deactivateRoleModal"
            hideActions={true} // Si vamos a conservar las acciones, poner hideActions en false y descomentar lo de abajo.
            hideHeader={true}
            // renderRowActions={(row) => (
            //   <RowActions
            //     row={row}
            //     setDataUpdateRole={setDataUpdateRole}
            //     setDataDeactivate={setDataDeactivate}
            //     inactive={
            //       {
            //         showInactive,
            //         reactivatingId,
            //         onReactivate
            //       }
            //     }
            //   />
            // )}
          />
        </Section>
      </Container>

      <ModalPost
        id="createRoleModal"
        title="Agregar rol"
        formId="createRoleForm"
        loading={isLoadingPostRole}
      >
        <FormRole
          idModal="createRoleModal"
          formId="createRoleForm"
          onSubmit={onSubmitRole}
          loading={apiLoadingPostRole}
          error={apiErrorPostRole}
          errorMessage={errorMessage}
          successMessage={successMessage}
          mode="create"
          privileges={dataPrivileges?.data || []}
        />
      </ModalPost>

      <ModalUpdate
        id="updateRoleModal"
        title="Actualizar rol"
        formId="updateRoleForm"
        loading={isLoadingUpdateRole}
      >
        <FormRole
          idModal="updateRoleModal"
          formId="updateRoleForm"
          onSubmit={onUpdateRole}
          loading={apiLoadingUpdateRole || isLoadingUpdateRole}
          error={apiErrorUpdateRole}
          errorMessage={errorMessageUpdateRole}
          successMessage={successMessageUpdateRole}
          initialValues={dataUpdateRole ? {
            ...dataUpdateRole,
            privileges: dataUpdateRole.privileges
              ? (Array.isArray(dataUpdateRole.privileges)
                ? dataUpdateRole.privileges.map(privName => {
                  const privilege = (dataPrivileges?.data || []).find(p => p.name === privName);
                  return privilege ? privilege.id : null;
                }).filter(id => id !== null)
                : [])
              : []
          } : {}}
          mode="update"
          privileges={dataPrivileges?.data || []}
        />

      </ModalUpdate>

      <ModalDelete
        id="deactivateRoleModal"
        title="Dar de baja rol"
        formId="deactivateRoleForm"
        loading={isLoadingDeactivateRole}
        buttonLabel="Dar de baja"
        buttonLoadingLabel="Dando de baja..."
      >
        <FormRole
          idModal="deactivateRoleModal"
          formId="deactivateRoleForm"
          onSubmit={onDeactivateRole}
          loading={apiLoadingDeactivateRole || isLoadingDeactivateRole}
          error={apiErrorDeactivateRole}
          errorMessage={errorMessageDeactivateRole}
          successMessage={successMessageDeactivateRole}
          mode="delete"
          initialValues={dataDeactivate || {}}
        />
      </ModalDelete>
    </>
  );
}
