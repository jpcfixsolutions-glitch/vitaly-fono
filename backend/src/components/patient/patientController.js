import { patientService } from "./patientService.js";

import { formatDateForDB, isValidDate, getCurrentDate } from "../../utils/date.js";
import { isValidEmail, isValidDocumentType, isValidDocumentNumber, isValidNameOrLastName, isValidPhone, isValidHealthInsurance } from "../../utils/patientUtils.js";
import { sendSuccess, sendError, handleControllerError } from "../../utils/response.js";
import { patientValidations } from "./patientValidations.js";
import { patientSanitized } from "./patientSanitized.js";

/**
 * Obtiene todos los pacientes registrados en el sistema.
 * 
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna la respuesta HTTP con la lista de pacientes o un mensaje de error.
 */
const getAllPatients = async (req, res) => {
  try {
    const patients = await patientService.getAllPatients();

    if (!patients || patients.length === 0) {
      return sendError(res, 404, "No se encontraron pacientes registrados", []);
    }

    return sendSuccess(res, "Pacientes obtenidos correctamente", patients);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene un paciente por su ID.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna la respuesta HTTP con el paciente encontrado o un mensaje de error.
 */
const getPatientById = async (req, res) => {
  try {
    const id = req.params.id;

    const patient = await patientService.getPatientById(id);

    if (!patient) {
      return sendError(res, 404, "No se encontró el paciente buscado", []);
    }
    return sendSuccess(res, "Paciente obtenido correctamente", patient);
  } catch (error) {
    return handleControllerError(res, error);
  }
};


/**
 * Crea un nuevo paciente en el sistema.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna la respuesta HTTP con el paciente creado o un mensaje de error.
 */
const createPatient = async (req, res) => {
  try {
    const { name, last_name, id_document_type, document_number, phone, birth_date, email, address, id_health_insurance, id_user } = req.body;

    await patientValidations(name, last_name, id_document_type, document_number, phone, birth_date, email, address, id_health_insurance, id_user);

    const { objectSanitized } = patientSanitized(name, last_name, id_document_type, document_number, phone, birth_date, email, address, id_health_insurance, id_user, "create");

    const result = await patientService.createPatient(objectSanitized);

    return sendSuccess(res, "Paciente registrado correctamente", result, 201);

  } catch (error) {
    return handleControllerError(res, error);
  }
};


/**
 * Actualiza los datos de un paciente existente.
 *
 * Valida los datos recibidos en el cuerpo de la solicitud, limpia los valores, 
 * y actualiza el paciente correspondiente en la base de datos. 
 * Si alguno de los datos no es válido, retorna un error apropiado.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP que contiene el ID del paciente en los parámetros y datos de actualización en el cuerpo.
 * @param {import('express').Response} res - Objeto de respuesta HTTP usado para devolver el resultado o errores.
 * @returns {Promise<void>} Retorna una respuesta HTTP con el paciente actualizado o un mensaje de error.
 */
const updatePatient = async (req, res) => {
  try {
    const id = req.params.id;

    const exists = await patientService.getPatientById(id);
    if (!exists) {
      return sendError(res, 404, "No se encontró el paciente", []);
    }

    const updateData = req.body;

    const cleanUpdates = {};

    if (updateData.name) {
      if (!isValidNameOrLastName(updateData.name)) {
        return sendError(res, 400, "El nombre debe contener solo letras, espacios, apóstrofes y guiones", []);
      }
      cleanUpdates.name = updateData.name;
    }

    if (updateData.last_name) {
      if (!isValidNameOrLastName(updateData.last_name)) {
        return sendError(res, 400, "El apellido debe contener solo letras, espacios, apóstrofes y guiones", []);
      }
      cleanUpdates.last_name = updateData.last_name;
    }

    if (updateData.id_document_type) {
      if (!(await isValidDocumentType(updateData.id_document_type))) {
        return sendError(res, 400, "El tipo de documento debe ser válido", []);
      }
      cleanUpdates.id_document_type = updateData.id_document_type;
    }

    if (updateData.id_document_type && !updateData.document_number && exists.document_number) {
      const isValidExistingNumber = await isValidDocumentNumber(
        exists.document_number,
        updateData.id_document_type
      );

      if (!isValidExistingNumber) {
        return sendError(res, 400, "El número de documento existente no coincide con el nuevo tipo de documento", []);
      }
      cleanUpdates.id_document_type = updateData.id_document_type;
    }

    if (updateData.document_number && await patientService.getPatientByDocument(updateData.document_number) && exists.document_number !== updateData.document_number) {
      return sendError(res, 400, "Ya existe un paciente registrado con este número de documento", []);
    }

    if (updateData.document_number) {
      const docTypeId = (updateData.id_document_type || exists.id_document_type);

      const isValidNumber = await isValidDocumentNumber(
        updateData.document_number,
        docTypeId
      );

      if (!isValidNumber) {
        return sendError(res, 400, "El número de documento debe tener un formato válido", []);
      }
      cleanUpdates.document_number = updateData.document_number.toString().trim();
    }

    if (updateData.birth_date) {
      if (!isValidDate(updateData.birth_date)) {
        return sendError(res, 400, "La fecha de nacimiento debe tener formato válido", []);
      }

      if (new Date(formatDateForDB(updateData.birth_date)) > new Date()) {
        return sendError(res, 400, "La fecha de nacimiento no puede ser futura", []);
      }
      cleanUpdates.birth_date = formatDateForDB(updateData.birth_date);
    }

    if (updateData.phone) {
      if (!isValidPhone(updateData.phone)) {
        return sendError(res, 400, "El número de teléfono debe ser válido", []);
      }
      cleanUpdates.phone = parseInt(updateData.phone);
    }

    if (updateData.id_health_insurance) {
      if (!(await isValidHealthInsurance(updateData.id_health_insurance))) {
        return sendError(res, 400, "La obra social debe ser válida", []);
      }
      cleanUpdates.id_health_insurance = updateData.id_health_insurance || '';
    }

    if (updateData.email && updateData.email !== "null") {
      if (!isValidEmail(updateData.email)) {
        return sendError(res, 400, "El email debe tener un formato válido", []);
      }
      cleanUpdates.email = updateData.email ? updateData.email.toLowerCase().trim() : '';
    } else {
      cleanUpdates.email = '';
    }

    if (updateData.status) {
      cleanUpdates.status = updateData.status;
    }

    if (updateData.address) {
      cleanUpdates.address = updateData.address ? updateData.address.trim() : '';
    }

    cleanUpdates.id_user = exists.id_user;
    cleanUpdates.updated_at = getCurrentDate();


    const result = await patientService.updatePatient(id, cleanUpdates);
    
    return sendSuccess(res, "Paciente actualizado correctamente", result);

  } catch (error) {
    return handleControllerError(res, error);
  }
};


/**
 * Da de baja un paciente del sistema.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP que contiene el ID del paciente en los parámetros.
 * @param {import('express').Response} res - Objeto de respuesta HTTP usado para devolver el resultado o errores.
 * @returns {Promise<void>} Retorna una respuesta HTTP con el paciente dado de baja o un mensaje de error.
 */
const deactivatePatient = async (req, res) => {
  try {
    const id = req.params.id;
    const exists = await patientService.getPatientById(id);

    if (!exists) {
      return sendError(res, 404, "No se encontró el paciente", []);
    };

    await patientService.deactivatePatient(id);
    return sendSuccess(res, "Paciente dado de baja correctamente", []);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Busca pacientes por diferentes criterios.
 *
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP que contiene los criterios de búsqueda en los parámetros.
 * @param {import('express').Response} res - Objeto de respuesta HTTP usado para devolver el resultado o errores.
 * @returns {Promise<void>} Retorna una respuesta HTTP con los pacientes encontrados o un mensaje de error.
 */
const searchPatients = async (req, res) => {
  try {
    const { name, last_name, document_number, id_document_type, status, id_user } = req.query;

    const result = await patientService.searchPatients({
      name,
      last_name,
      document_number,
      id_document_type,
      status,
      id_user,
    });

    return sendSuccess(res, "Búsqueda realizada correctamente", result);

  } catch (error) {
    return handleControllerError(res, error);
  }
};

/**
 * Obtiene un paciente por número de documento y tipo de documento.
 * 
 * @async
 * @function
 * @param {import('express').Request} req - Objeto de solicitud HTTP que contiene el número de documento y tipo de documento en los parámetros.
 * @param {import('express').Response} res - Objeto de respuesta HTTP usado para devolver el resultado o errores.
 * @returns {Promise<void>} Retorna una respuesta HTTP con el paciente encontrado o un mensaje de error.
 */
const getPatientByDocumentAndDocumentType = async (req, res) => {
  try {
    const { document_number, id_document_type } = req.params;
    const patient = await patientService.getPatientByDocumentAndDocumentType(document_number, id_document_type);
    if (!patient) {
      return sendError(res, 404, "No se encontró el paciente", []);
    }
    return sendSuccess(res, "Paciente encontrado correctamente", patient);
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const patientController = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deactivatePatient,
  searchPatients,
  getPatientByDocumentAndDocumentType
};