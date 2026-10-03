import { useEffect, useRef, useState } from "react";
import { Input } from "../form";
import { useApi } from "../../hooks/useApi";
import { Loading } from "../ui/loading/loading.jsx";

/**
 * Autocompletado de nombre de paciente con búsqueda remota.
 * - Debounce 300ms
 * - Rellena otros campos del form al seleccionar una sugerencia
 */
export const PatientNameAutocomplete = ({ control, errors, setValue, watch }) => {
  const [suggestions, setSuggestions] = useState([]);
  const patientName = watch("name");

  const { trigger: apiCall, loading } = useApi({
    url: "pacientes/search",
    method: "GET"
  });

  // Obtener usuario activo desde localStorage (id para filtrar en backend)
  let currentUserId = undefined;
  let currentUserRole = undefined;
  try {
    const rawUser = localStorage.getItem('user');
    const parsed = rawUser ? JSON.parse(rawUser) : null;
    currentUserId = parsed?.id;
    currentUserRole = parsed?.role;
  } catch { /* noop */ }

  // Evita que, luego de seleccionar una sugerencia (setValue programático),
  // se dispare inmediatamente una nueva búsqueda que vuelva a mostrar la lista.
  const suppressNextFetchRef = useRef(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (suppressNextFetchRef.current) {
        suppressNextFetchRef.current = false;
        if (suggestions.length) setSuggestions([]);
        return;
      }

      if (!patientName || patientName.length < 2) {
        if (suggestions.length) setSuggestions([]);
        return;
      }

      try {
        const qp = new URLSearchParams();
        qp.set('name', patientName);
        if (currentUserId && currentUserRole !== 'Recepción' && currentUserRole !== 'Administrador') {
          qp.set('id_user', currentUserId);
        }
        const data = await apiCall(null, `?${qp.toString()}`);
        if (Array.isArray(data.data)) {
          // Filtrar solo pacientes con estado "Activo"
          const filtered = data.data.filter((p) => p?.status === "Activo");
          const sameLength = filtered.length === suggestions.length;
          const sameIds = sameLength && filtered.every((it, idx) => it.id === suggestions[idx]?.id);
          if (!sameIds) setSuggestions(filtered);
        } else {
          if (suggestions.length) setSuggestions([]);
        }
      } catch (error) {
        console.error("Error al obtener sugerencias:", error);
        if (suggestions.length) setSuggestions([]);
      }
    };

    const timerId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timerId);
  }, [patientName]);

  const handleSelectPatient = (patient) => {
    setSuggestions([]);
    suppressNextFetchRef.current = true;
    setValue("name", patient.name || "", { shouldValidate: true });
    setValue("last_name", patient.last_name || "", { shouldValidate: true });
    setValue("phone", patient.phone?.toString() || "", { shouldValidate: true });
    setValue("id_document_type", patient.id_document_type || patient.document_type_id || "", { shouldValidate: true });
    setValue("document_number", patient.document_number || "", { shouldValidate: true });

    setTimeout(() => {
      setSuggestions([]);
    }, 100);
  };

  return (
    <div style={{ position: "relative" }}>
      <Input
        name="name"
        label="Nombre del paciente *"
        control={control}
        errors={errors}
        type="text"
        autocomplete="off"
        rules={{
          required: "El nombre del paciente es requerido",
          minLength: { value: 3, message: "El nombre del paciente debe tener al menos 3 caracteres" },
          maxLength: { value: 50, message: "El nombre del paciente no puede tener más de 50 caracteres" },
          pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/, message: "El nombre solo puede contener letras y espacios" }
        }}
        placeholder="Ej: Juan"
      />

      {loading && (
        <div style={{ position: "absolute", top: 6, right: 8, pointerEvents: "none" }}>
          <Loading className="mini-loading" />
        </div>
      )}

      {Array.isArray(suggestions) && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((patient) => (
            <li
              key={patient.id}
              className="suggestion-item"
              onClick={() => handleSelectPatient(patient)}
            >
              {patient.name} {patient.last_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


