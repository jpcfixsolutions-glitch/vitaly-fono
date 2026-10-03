import { AppError } from "../../../errors.js";
import db from "../../database/database.js";
import { patientAdditionalInfo } from "../additionalPatientInformation/additionalPatientInformationSchema.js";
import { adultAntecedentsAdditionalInfo } from "../adultAntecedentsAdditionalInfo/adultAntecedentsAdditionalInfoSchema.js";
import { firstInterview } from "./firstInterviewSchema.js";
import { patient } from "../patient/patientSchema.js";
import { schooling } from "../schooling/schoolingSchema.js";
import { cohabitant } from "../cohabitant/cohabitantSchema.js";
import { sibling } from "../sibling/siblingSchema.js";
import { father } from "../father/fatherSchema.js";
import { mother } from "../mother/motherSchema.js";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";


/**
 * Obtiene todas las primeras entrevistas registradas.
 *
 * @async
 * @function
 * @returns {Promise<Array<Object>>} Array de objetos de primeras entrevistas.
 * @throws {AppError} Si ocurre un error al obtener los datos.
 */
const getAllFirstInterviews = async () => {
  try {
    const firstInterviews = await db.select().from(firstInterview).all();
    return firstInterviews;
  } catch (error) {
    throw new AppError("Error al obtener las primeras entrevistas", 400, []);
  }
}

/**
 * Obtiene una primera entrevista por su ID.
 *
 * @async
 * @function
 * @param {string} id - Identificador único de la primera entrevista.
 * @returns {Promise<Object|null>} Objeto de la primera entrevista o null si no existe.
 * @throws {AppError} Si ocurre un error al consultar la entrevista.
 */
const getFirstInterviewById = async (id) => {
  try {
    const firstInterviewRow = await db.select().from(firstInterview).where(eq(firstInterview.id, id)).get();
    return firstInterviewRow;
  } catch (error) {
    throw new AppError("Error al obtener la primera entrevista", 400, []);
  }
}

/**
 * Obtiene la primera entrevista asociada a un paciente por su ID.
 *
 * @async
 * @function
 * @param {string} patientId - Identificador del paciente.
 * @returns {Promise<Object|null>} Objeto de la primera entrevista o null si no existe.
 * @throws {AppError} Si ocurre un error al realizar la consulta.
 */
const getFirstInterviewByPatientId = async (patientId) => {
  try {
    const item = await db.select().from(firstInterview).where(eq(firstInterview.id_patient, patientId)).get();
    return item;
  } catch (error) {
    throw new AppError("Error al obtener la primera entrevista por paciente", 400, []);
  }
}

/**
 * Obtiene todas las primeras entrevistas por el identificador del usuario.
 *
 * @async
 * @function
 * @param {string} id_user - Identificador del usuario.
 * @returns {Promise<Array<Object>>} Array de objetos de primeras entrevistas.
 * @throws {AppError} Si ocurre un error al obtener las primeras entrevistas.
 */
const getAllFirstInterviewsByUserId = async (id_user) => {
  try {
    const items = await db.select().from(firstInterview).where(eq(firstInterview.id_user, id_user)).all();
    return items;
  } catch (error) {
    throw new AppError("Error al obtener las primeras entrevistas por usuario", 400, []);
  }
}

/**
 * Obtiene la primera entrevista detallada de un paciente, incluyendo paciente, escolaridad, convivencia, padres y hermanos.
 *
 * @async
 * @function
 * @param {string} patientId - Identificador del paciente.
 * @returns {Promise<Object>} Objeto con datos detallados de la entrevista y relaciones asociadas.
 * @throws {AppError} Si no se encuentra algún dato relacionado o si ocurre un error durante la consulta.
 */
const getFirstInterviewDetailsByPatientId = async (patientId) => {
  try {
    const interview = await db.select().from(firstInterview).where(eq(firstInterview.id_patient, patientId)).get();
    if (!interview) {
      throw new AppError("No se encontró la primera entrevista para el paciente", 404, []);
    };

    const patientRow = await db.select().from(patient).where(eq(patient.id, patientId)).get();
    if (!patientRow) {
      throw new AppError("No se encontró el paciente", 404, []);
    };

    // no pongo el trhow porque hay algunos registros que no tienen esta informacion y si lo pongo me muestra erroneamente en el front.
    // simplemente si no tiene la informacion, los campos son nulls.
    const adultAntecedentsAdditionalInfoRow = await db.select().from(adultAntecedentsAdditionalInfo).where(eq(adultAntecedentsAdditionalInfo.id_interview, interview.id)).get();

    const patientAdditionalInfoRow = await db.select().from(patientAdditionalInfo).where(eq(patientAdditionalInfo.id_interview, interview.id)).get();

    const schoolingRow = await db.select().from(schooling).where(eq(schooling.id_interview, interview.id)).get();

    const cohabitationRow = await db.select().from(cohabitant).where(eq(cohabitant.id_interview, interview.id)).get();

    const fatherRow = await db.select().from(father).where(eq(father.id_interview, interview.id)).get();

    const motherRow = await db.select().from(mother).where(eq(mother.id_interview, interview.id)).get();

    const siblingsRows = await db.select().from(sibling).where(eq(sibling.id_interview, interview.id)).all(); 
    if (!siblingsRows) {
      throw new AppError("No se encontraron hermanos para la entrevista", 404, []);
    };

    return {
      interview:{
        id: interview?.id ?? null,
        id_patient: interview?.id_patient ?? null,
        id_user: interview?.id_user ?? null,
        date: interview?.date ?? null,
        family_dynamics: interview?.family_dynamics ?? null,
        perinatal_history: interview?.perinatal_history ?? null,
        general_development: interview?.general_development ?? null,
        diseases_allergies: interview?.diseases_allergies ?? null,
        family_pathology_history: interview?.family_pathology_history ?? null,
        personality_description: interview?.personality_description ?? null,
        reason_for_consultation: interview?.reason_for_consultation ?? null,
        genogram: interview?.genogram ?? null,
        status: interview?.status ?? null,
        created_at: interview?.created_at ?? null,
        updated_at: interview?.updated_at ?? null,
      },
      patient: {
        id: patientRow.id,
        name: patientRow.name || null,
        last_name: patientRow.last_name || null,
        id_document_type: patientRow.id_document_type || null,
        document_number: patientRow.document_number || null,
        phone: patientRow.phone ?? null,
        birth_date: patientRow.birth_date ?? null,
        id_health_insurance: patientRow.id_health_insurance ?? null,
        status: patientRow.status ?? null,
        email: patientRow.email ?? null,
        address: patientRow.address ?? null,
      },
      schooling: {
        id_interview: schoolingRow?.id_interview ?? null,
        schooling_year: schoolingRow?.schooling_year ?? null,
        current_course: schoolingRow?.current_course ?? null,
        orientation: schoolingRow?.orientation ?? null,
        school_name: schoolingRow?.school_name ?? null,
        repeat_course: schoolingRow?.repeat_course ?? null,
        repeat_course_reason: schoolingRow?.repeat_course_reason ?? null,
        school_changes: schoolingRow?.school_changes ?? null,
        school_changes_reason: schoolingRow?.school_changes_reason ?? null,
        initial_level: schoolingRow?.initial_level ?? null,
        primary_level: schoolingRow?.primary_level ?? null,
        secondary_level: schoolingRow?.secondary_level ?? null,
        general_remarks: schoolingRow?.general_remarks ?? null,
      },
      cohabitation: {
        id_interview: cohabitationRow?.id_interview ?? null,
        domestic_cohabitation: cohabitationRow?.domestic_cohabitation ?? null,
        non_domestic_cohabitation: cohabitationRow?.non_domestic_cohabitation ?? null,
      },
      family: {
        father: {
          id: fatherRow?.id ?? null,
          father_name: fatherRow?.father_name || null,
          father_age: fatherRow?.father_age || null,
          father_lives: fatherRow?.father_lives ?? null,
          father_profession: fatherRow?.father_profession || null,
          father_work_hours: fatherRow?.father_work_hours ?? null,
        },
        mother: {
          id: motherRow?.id ?? null,
          mother_name: motherRow?.mother_name || null,
          mother_age: motherRow?.mother_age || null,
          mother_lives: motherRow?.mother_lives ?? null,
          mother_profession: motherRow?.mother_profession || null,
          mother_work_hours: motherRow?.mother_work_hours ?? null,
        },
        siblings: siblingsRows.map((s) => ({ 
          id_sibling: s.id,
          name: s.name || null,
          age: s.age || null,
          studies: s.studies || null,
        })),
      },
      patientAdditionalInfo: {
        id_interview: patientAdditionalInfoRow?.id_interview ?? null,
        civil_status: patientAdditionalInfoRow?.civil_status ?? null,
        second_phone: patientAdditionalInfoRow?.second_phone ?? null,
        living_with: patientAdditionalInfoRow?.living_with ?? null,
        profession: patientAdditionalInfoRow?.profession ?? null,
        derivation: patientAdditionalInfoRow?.derivation ?? null,
        has_had_therapy: patientAdditionalInfoRow?.has_had_therapy ?? null,
        therapy_duration: patientAdditionalInfoRow?.therapy_duration ?? null,
        reason_for_leaving_therapy: patientAdditionalInfoRow?.reason_for_leaving_therapy ?? null,
        current_therapy_type: patientAdditionalInfoRow?.current_therapy_type ?? null,
      },
      adultAntecedentsAdditionalInfo: {
        id_interview: adultAntecedentsAdditionalInfoRow?.id_interview ?? null,
        pathologies_diseases: adultAntecedentsAdditionalInfoRow?.pathologies_diseases ?? null,
        medication: adultAntecedentsAdditionalInfoRow?.medication ?? null,
        substance_alcohol_consumption: adultAntecedentsAdditionalInfoRow?.substance_alcohol_consumption ?? null,
        hobbies_sports: adultAntecedentsAdditionalInfoRow?.hobbies_sports ?? null,
        negative_thoughts: adultAntecedentsAdditionalInfoRow?.negative_thoughts ?? null,
        abuse_mistreatment: adultAntecedentsAdditionalInfoRow?.abuse_mistreatment ?? null
      }
    }
  } catch (error) {
    // El frontend necesita distinguir un 404 real de una falla al cargar una
    // entrevista existente. Preservamos los errores de dominio originales.
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error al obtener la primera entrevista detallada por paciente", 500, []);
  }
}

/**
 * Crea una nueva primera entrevista y todos sus datos relacionados de forma transaccional.
 *
 * @async
 * @function
 * @param {Object} fullData - Objeto con toda la información necesaria.
 * @param {Object} fullData.interview - Datos de la entrevista.
 * @param {Object} fullData.patient - Datos para actualizar del paciente.
 * @param {Object} fullData.family - Datos familiares (padre, madre, hermanos).
 * @param {Object} fullData.cohabitants - Datos de convivencia.
 * @param {Object} fullData.schooling - Datos de escolaridad.
 * @returns {Promise<Object>} Objeto de la primera entrevista creada.
 * @throws {AppError} Si ocurre un error en la transacción.
 */
const createFirstInterview = async (fullData) => {
  const { 
    interview: interviewData, 
    patient: patientData, 
    family, 
    cohabitants: cohabitantData, 
    schooling: schoolingData,
    adultAntecedentsAdditionalInfo: adultAntecedentsAdditionalInfoData
  } = fullData;

  try {
    // Iniciamos la transacción. Si algo falla dentro, se hace rollback automático.
    const result = await db.transaction(async (tx) => {
      
      // 1. Actualizar datos del paciente (si se proporcionaron)
      if (patientData && interviewData.id_patient) {
        // Filtramos campos undefined/null para no sobreescribir con vacíos si no es intencional
        const updateData = {};
        if (patientData.birth_date) updateData.birth_date = patientData.birth_date;
        if (patientData.address) updateData.address = patientData.address;
        if (patientData.phone) updateData.phone = patientData.phone;
        
        if (Object.keys(updateData).length > 0) {
            await tx.update(patient)
            .set(updateData)
            .where(eq(patient.id, interviewData.id_patient));
        }
      }

      // 2. Crear la Entrevista
      const newInterviewId = uuid();
      const newInterview = {
        id: newInterviewId,
        id_patient: interviewData.id_patient,
        id_user: interviewData.id_user,
        date: interviewData.date,
        family_dynamics: interviewData.family_dynamics,
        perinatal_history: interviewData.perinatal_history,
        general_development: interviewData.general_development,
        diseases_allergies: interviewData.diseases_allergies,
        family_pathology_history: interviewData.family_pathology_history,
        personality_description: interviewData.personality_description,
        reason_for_consultation: interviewData.reason_for_consultation,
        genogram: interviewData.genogram,
        created_at: interviewData.created_at,
        updated_at: interviewData.updated_at
      };

      const [insertedInterview] = await tx.insert(firstInterview)
        .values(newInterview)
        .returning();

      const hasPatientAdditionalData = patientData && [
        "civil_status",
        "second_phone",
        "living_with",
        "profession",
        "derivation",
        "has_had_therapy",
        "therapy_duration",
        "reason_for_leaving_therapy",
        "current_therapy_type"
      ].some((field) => patientData[field] !== undefined);

      if (hasPatientAdditionalData) {
        await tx.insert(patientAdditionalInfo).values({
          id: uuid(),
          id_interview: newInterviewId,
          civil_status: patientData.civil_status ?? null,
          second_phone: patientData.second_phone ?? null,
          living_with: patientData.living_with ?? null,
          profession: patientData.profession ?? null,
          derivation: patientData.derivation ?? null,
          has_had_therapy: patientData.has_had_therapy ?? 0,
          therapy_duration: patientData.therapy_duration ?? null,
          reason_for_leaving_therapy: patientData.reason_for_leaving_therapy ?? null,
          current_therapy_type: patientData.current_therapy_type ?? null
        });
      }

      if (adultAntecedentsAdditionalInfoData) {
        await tx.insert(adultAntecedentsAdditionalInfo).values({
          id: uuid(),
          id_interview: newInterviewId,
          pathologies_diseases: adultAntecedentsAdditionalInfoData.pathologies_diseases ?? null,
          medication: adultAntecedentsAdditionalInfoData.medication ?? null,
          substance_alcohol_consumption: adultAntecedentsAdditionalInfoData.substance_alcohol_consumption ?? null,
          hobbies_sports: adultAntecedentsAdditionalInfoData.hobbies_sports ?? null,
          negative_thoughts: adultAntecedentsAdditionalInfoData.negative_thoughts ?? null,
          abuse_mistreatment: adultAntecedentsAdditionalInfoData.abuse_mistreatment ?? null
        });
      }
      
      // 3. Insertar Padre
      if (family?.father) {
        await tx.insert(father).values({
          id: uuid(),
          id_interview: newInterviewId,
          father_name: family?.father.father_name || "",
          father_age: family?.father.father_age || "",
          father_lives: family?.father.father_lives || "",
          father_profession: family?.father.father_profession || "",
          father_work_hours: family?.father.father_work_hours || "",
        });
      }

      // 4. Insertar Madre
      if (family?.mother) {
        await tx.insert(mother).values({
          id: uuid(),
          id_interview: newInterviewId,
          mother_name: family?.mother.mother_name || "",
          mother_age: family?.mother.mother_age || "",
          mother_lives: family?.mother.mother_lives || "",
          mother_profession: family?.mother.mother_profession || "",
          mother_work_hours: family?.mother.mother_work_hours || "",
        });
      }

      // 5. Insertar Hermanos (Array)
      if (family?.siblings && Array.isArray(family.siblings) && family.siblings.length > 0) {
        const siblingsToInsert = family.siblings.map(sib => ({
          id: uuid(),
          id_interview: newInterviewId,
          name: sib.name,
          age: sib.age,
          studies: sib.studies
        }));
        await tx.insert(sibling).values(siblingsToInsert);
      }

      // 6. Insertar Convivientes
      if (cohabitantData) {
        await tx.insert(cohabitant).values({
          id: uuid(),
          id_interview: newInterviewId,
          domestic_cohabitation: cohabitantData?.domestic_cohabitation || "",
          non_domestic_cohabitation: cohabitantData?.non_domestic_cohabitation || ""
        });
      }

      // 7. Insertar Escolaridad
      if (schoolingData) {
        await tx.insert(schooling).values({
          id: uuid(),
          id_interview: newInterviewId,
          ...schoolingData
        });
      }

      return insertedInterview;
    });

    return result;

  } catch (error) {
    throw new AppError("Error al crear la primera entrevista y sus datos asociados", 500, error);
  }
}

/**
 * Actualiza una primera entrevista existente y sus datos asociados de forma transaccional.
 *
 * @async
 * @function
 * @param {string} id - Identificador de la primera entrevista.
 * @param {Object} fullData - Objeto con toda la información necesaria para actualizar.
 * @returns {Promise<Object>} Objeto de la primera entrevista actualizada.
 * @throws {AppError} Si ocurre un error en la transacción.
 */
const updateFirstInterview = async (id, fullData) => {
  const { 
    interview: interviewData, 
    patient: patientData, 
    family, 
    cohabitants: cohabitantData, 
    schooling: schoolingData,
    adultAntecedentsAdditionalInfo: adultAntecedentsAdditionalInfoData 
  } = fullData;

  try {
    const result = await db.transaction(async (tx) => {
      
      // 1. Actualizar Entrevista Principal
      if (interviewData) {
        // Aseguramos que no se intente actualizar el ID
        const { id: _, ...dataToUpdate } = interviewData;
        await tx.update(firstInterview)
          .set(dataToUpdate)
          .where(eq(firstInterview.id, id));
      }
      
      // hasta aca todo ok

      // 2. Actualizar Paciente (si corresponde)
      if (patientData && interviewData?.id_patient) {
        const updateData = {};
        if (patientData.birth_date) updateData.birth_date = patientData.birth_date;
        if (patientData.address) updateData.address = patientData.address;
        if (patientData.phone) updateData.phone = patientData.phone;

        if (Object.keys(updateData).length > 0) {
          await tx.update(patient)
            .set(updateData)
            .where(eq(patient.id, interviewData.id_patient));
        }
      }
      
      // hasta aca todo ok

      const hasPatientAdditionalData = patientData && [
        "civil_status",
        "second_phone",
        "living_with",
        "profession",
        "derivation",
        "has_had_therapy",
        "therapy_duration",
        "reason_for_leaving_therapy",
        "current_therapy_type"
      ].some((field) => patientData[field] !== undefined);

      if (hasPatientAdditionalData && interviewData?.id_patient) {
        const patientAdditionalData = {
          civil_status: patientData.civil_status ?? null,
          second_phone: patientData.second_phone ?? null,
          living_with: patientData.living_with ?? null,
          profession: patientData.profession ?? null,
          derivation: patientData.derivation ?? null,
          has_had_therapy: patientData.has_had_therapy ?? 0,
          therapy_duration: patientData.therapy_duration ?? null,
          reason_for_leaving_therapy: patientData.reason_for_leaving_therapy ?? null,
          current_therapy_type: patientData.current_therapy_type ?? null
        };

        const existingInfo = await tx
          .select()
          .from(patientAdditionalInfo)
          .where(eq(patientAdditionalInfo.id_interview, id))
          .get();

        if (existingInfo) {
          await tx
            .update(patientAdditionalInfo)
            .set(patientAdditionalData)
            .where(eq(patientAdditionalInfo.id_interview, id));
        } else {
          await tx
            .insert(patientAdditionalInfo)
            .values({
              id: uuid(),
              id_interview: id,
              ...patientAdditionalData
            });
        }
      }

      // 3. Actualizar Padre
      if (family?.father) {
        // En lugar de update, hacemos delete + insert o update directo. 
        // Como es 1:1, update directo es más limpio si existe, pero si no existía antes (raro), fallaría.
        // Haremos UPDATE directo asumiendo que siempre existe si se creó la entrevista.
        // Ojo: Si la estructura de father tiene 'id', lo quitamos para no actualizar la PK
        const { id: _, ...fatherData } = family.father;

        await tx.update(father)
          .set({
            father_name: family?.father.father_name || "",
            father_age: family?.father.father_age || "",
            father_lives: family?.father.father_lives || "",
            father_profession: family?.father.father_profession || "",
            father_work_hours: family?.father.father_work_hours || "",
          })
          .where(eq(father.id_interview, id));
      }

      // 4. Actualizar Madre
      if (family?.mother) {
        const { id: _, ...motherData } = family.mother;
        await tx.update(mother)
          .set({
            mother_name: family?.mother.mother_name || "",
            mother_age: family?.mother.mother_age || "",
            mother_lives: family?.mother.mother_lives || "",
            mother_profession: family?.mother.mother_profession || "",
            mother_work_hours: family?.mother.mother_work_hours || "",
          })
          .where(eq(mother.id_interview, id));
      }

      // 5. Actualizar Convivientes
      if (cohabitantData) {
        const { id: _, ...cohabData } = cohabitantData;
        await tx.update(cohabitant)
          .set({
            domestic_cohabitation: cohabitantData?.domestic_cohabitation || "",
            non_domestic_cohabitation: cohabitantData?.non_domestic_cohabitation || ""
          })
          .where(eq(cohabitant.id_interview, id));
      }

      // 6. Actualizar Escolaridad
      if (schoolingData) {
        const { id: _, ...schoolData } = schoolingData;
        await tx.update(schooling)
          .set(schoolData)
          .where(eq(schooling.id_interview, id));
      }

      // 7. Actualizar Hermanos (Estrategia: Eliminar todos e insertar los nuevos)
      if (family?.siblings && Array.isArray(family.siblings)) {
        // a. Eliminar hermanos existentes de esta entrevista
        await tx.delete(sibling).where(eq(sibling.id_interview, id));

        // b. Insertar los nuevos (si hay)
        if (family.siblings.length > 0) {
          const siblingsToInsert = family.siblings.map(sib => ({
            id: uuid(),
            id_interview: id,
            name: sib.name || "",
            age: sib.age || "",
            studies: sib.studies || ""
          }));
          await tx.insert(sibling).values(siblingsToInsert);
        }
      }

      // 8. Actualiza información adicional de antecedentes del paciente adulto si corresponde
      if (adultAntecedentsAdditionalInfoData) {
        const adultAntecedentsAdditionalData = {
          pathologies_diseases: adultAntecedentsAdditionalInfoData.pathologies_diseases ?? null,
          medication: adultAntecedentsAdditionalInfoData.medication ?? null,
          substance_alcohol_consumption: adultAntecedentsAdditionalInfoData.substance_alcohol_consumption ?? null,
          hobbies_sports: adultAntecedentsAdditionalInfoData.hobbies_sports ?? null,
          negative_thoughts: adultAntecedentsAdditionalInfoData.negative_thoughts ?? null,
          abuse_mistreatment: adultAntecedentsAdditionalInfoData.abuse_mistreatment ?? null
        };

        const existingAdultAntecedents = await tx
          .select()
          .from(adultAntecedentsAdditionalInfo)
          .where(eq(adultAntecedentsAdditionalInfo.id_interview, id))
          .get();

        if (existingAdultAntecedents) {
          await tx.update(adultAntecedentsAdditionalInfo)
            .set(adultAntecedentsAdditionalData)
            .where(eq(adultAntecedentsAdditionalInfo.id_interview, id));
        } else {
          await tx.insert(adultAntecedentsAdditionalInfo).values({
            id: uuid(),
            id_interview: id,
            ...adultAntecedentsAdditionalData
          });
        }
      }

      // Retornar la entrevista actualizada
      const [updatedInterview] = await tx.select().from(firstInterview).where(eq(firstInterview.id, id));
      return updatedInterview;
    });

    return result;

  } catch (error) {
    console.error("Error transaccional actualizando primera entrevista:", error);
    throw new AppError("Error al actualizar la primera entrevista y sus datos asociados", 500, error);
  }
}

export const firstInterviewService = {
  getAllFirstInterviews,
  getFirstInterviewById,
  getFirstInterviewByPatientId,
  getAllFirstInterviewsByUserId,
  getFirstInterviewDetailsByPatientId,
  createFirstInterview,
  updateFirstInterview
}
