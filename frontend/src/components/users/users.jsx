import { useState } from 'react';
import { Users as UsersIcon } from 'lucide-react';

import { ViewData, Container } from '../';

import { ModalDelete, ModalPost, ModalUpdate } from '../modal';
import { Section } from '../layout/section';

import { useGetAllUsers } from '../../hooks/useGetAllUsers';
import { useGetAllRoles } from '../../hooks/useGetAllRoles';

import { FormUser, FormChangePassword, RowActions, buildUserColumns } from './components';
import { useSubmitPostUser, useSubmitUpdateUser, useSubmitChangePassword, useSubmitDeactivateUser } from './hooks';

import './users.css';


export const Users = () => {
  const [dataUpdateUser, setDataUpdateUser] = useState(null);
  const [dataChangePassword, setDataChangePassword] = useState(null);
  const [dataDeactivate, setDataDeactivate] = useState(null);

  const [showInactive, setShowInactive] = useState(false);
  const [reactivatingId, setReactivatingId] = useState(null);

  // Hook personalizado para obtener la lista de usuarios
  const { 
    users: dataUser, 
    loading: apiLoadingGetUser, 
    error: apiErrorGetUser, 
    refetch: refetchGetUser 
  } = useGetAllUsers();

  // Filtrar los usuarios según el estado de activación
  const filteredUsers = {
    data: Array.isArray(dataUser?.data)
      ? dataUser.data.filter(item => item.status === (showInactive ? 'Inactivo' : 'Activo'))
      : []
  };

  // Construir las columnas de la tabla de usuarios
  const columns = buildUserColumns(dataUser);

  // Hook personalizado para obtener la lista de roles
  const { roles: dataRoles } = useGetAllRoles(true);
  const rolesOptions = Array.isArray(dataRoles) ? dataRoles : Array.isArray(dataRoles?.data) ? dataRoles.data : [];

  // Hook personalizado para crear un nuevo paciente
  const { 
    successMessage,
    errorMessage,
    isLoading: isLoadingPostUser,
    apiLoadingPostUser,
    apiErrorPostUser,
    onSubmitUser
  } = useSubmitPostUser();

  // Hook personalizado de actualización de un usuario
  const { 
    successMessage: successMessageUpdateUser,
    errorMessage: errorMessageUpdateUser,
    isLoading: isLoadingUpdateUser,
    apiLoadingUpdateUser,
    apiErrorUpdateUser,
    onUpdateUser
  } = useSubmitUpdateUser(dataUpdateUser);

  // Hook personalizado de actualización de la contraseña de un usuario
  const { 
    successMessage: successMessageUpdatePassword,
    errorMessage: errorMessageUpdatePassword,
    isLoading: isLoadingUpdatePassword,
    apiLoadingUpdatePassword,
    apiErrorUpdatePassword,
    onChangePassword
  } = useSubmitChangePassword(dataChangePassword);

  // Hook personalizado para enviar el formulario de dar de baja de método de pago
  const {
    successMessage: successMessageDeactivateUser,
    errorMessage: errorMessageDeactivateUser,
    isLoading: isLoadingDeactivateUser,
    apiLoadingDeactivateUser,
    apiErrorDeactivateUser,
    onDeactivateUser,
  } = useSubmitDeactivateUser(dataDeactivate);

  // Manejador para reactivar un método de pago
  const onReactivate = async (row) => {
    setReactivatingId(row.id);
    const response = await onUpdateUser({ ...row, status: "Activo" });
    if (response?.status === "success") {
      await refetchGetUser();
      setShowInactive(false);
    }
  };

  return (
    <>
      <Container>
        <Section
          Icon={UsersIcon}
          title="Gestión de Usuarios"
          description="Gestiona el acceso al sistema registrando profesionales y asignándoles sus roles correspondientes.">

          <ViewData
            data={filteredUsers}
            apiLoading={apiLoadingGetUser}
            apiError={apiErrorGetUser}
            message="No hay usuarios registrados."
            columns={columns}
            title=""
            buttonLabel="Registrar usuario"
            buttonDataBsTarget="#createUserModal"
            buttonClassName="btn-user"
            subSection={true}
            subSectionHandler={{
              setShowInactive,
              showInactive
            }}
            dataBsTargetUpdate='#updateUserModal'
            dataBsTargetDeactivate="#deactivateUserModal"
            renderRowActions={(row) => (
              <RowActions
                row={row}
                setDataUpdateUser={setDataUpdateUser}
                setDataChangePassword={setDataChangePassword}
                setDataDeactivate={setDataDeactivate}
                inactive={
                  {
                    showInactive,
                    reactivatingId,
                    onReactivate
                  }
                }
              />
            )}
          />
        </Section>
      </Container>

      <ModalPost
        id="createUserModal"
        title="Crear usuario"
        formId="createUserForm"
        loading={isLoadingPostUser}
      >
        <FormUser
          idModal="createUserModal"
          formId="createUserForm"
          onSubmit={onSubmitUser}
          loading={apiLoadingPostUser}
          error={apiErrorPostUser}
          errorMessage={errorMessage}
          successMessage={successMessage}
          roles={rolesOptions}
        />
      </ModalPost>

      <ModalUpdate
        id="updateUserModal"
        title="Actualizar usuario"
        formId="updateUserForm"
        loading={isLoadingUpdateUser}
      >
        <FormUser
          idModal="updateUserModal"
          formId="updateUserForm"
          onSubmit={onUpdateUser}
          loading={apiLoadingUpdateUser || isLoadingUpdateUser}
          error={apiErrorUpdateUser}
          errorMessage={errorMessageUpdateUser}
          successMessage={successMessageUpdateUser}
          initialValues={dataUpdateUser || {}}
          mode="update"
          roles={rolesOptions}
        />

      </ModalUpdate>

      <ModalUpdate
        id="changePasswordModal"
        title="Cambiar contraseña"
        formId="changePasswordForm"
        loading={isLoadingUpdatePassword}
      >
        <FormChangePassword
          idModal="changePasswordModal"
          formId="changePasswordForm"
          onSubmit={onChangePassword}
          loading={apiLoadingUpdatePassword || isLoadingUpdatePassword}
          error={apiErrorUpdatePassword}
          errorMessage={errorMessageUpdatePassword}
          successMessage={successMessageUpdatePassword}
          initialValues={dataChangePassword || {}}
        />
      </ModalUpdate>

      <ModalDelete
        id="deactivateUserModal"
        title="Dar de baja usuario"
        formId="deactivateUserForm"
        loading={isLoadingDeactivateUser}
        buttonLabel="Dar de baja"
        buttonLoadingLabel="Dando de baja..."
      >
        <FormUser
          idModal="deactivateUserModal"
          formId="deactivateUserForm"
          onSubmit={onDeactivateUser}
          loading={apiLoadingDeactivateUser || isLoadingDeactivateUser}
          error={apiErrorDeactivateUser}
          errorMessage={errorMessageDeactivateUser}
          successMessage={successMessageDeactivateUser}
          mode="delete"
          initialValues={dataDeactivate || {}}
        />
      </ModalDelete>
    </>
  );
}
