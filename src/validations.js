// > General
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
export const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#/])[A-Za-z\d@$!%*?&#/]{8,}$/;
  return regex.test(password);
}


// > File Creation
const validateNameRS = (name_rs) => {
  const regex = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9\s\.,-]{3,}$/;
  if (!regex.test(name_rs)) {
    return { valid: false, error: "La Razón Social debe tener al menos 3 caracteres y no contener caracteres especiales." };
  }
  return { valid: true };
};

const validateRFC = (rfc) => {
  const regex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;
  if (!regex.test(rfc)) {
    return { valid: false, error: "El RFC no es válido." };
  }
  return { valid: true };
};

const validateCURP = (curp) => {
  const regex = /^[A-Z][AEIOU][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/i;
  if (!regex.test(curp)) {
    return { valid: false, error: "El CURP no es válido." };
  }
  return { valid: true };
};

const validateStreet = (street) => { //Nuevos campos de Dirección
  if (!street || typeof street !== "string") {
    return { valid: false, error: "La calle es obligatoria." };
  }
  const trimmed = street.trim();
  if (trimmed.length < 1 || trimmed.length > 100) {
    return { valid: false, error: "La calle debe tener entre 1 y 100 caracteres." };
  }
  return { valid: true };
};
const validateExtNumber = (ext_number) => {
  const regex = /^[a-zA-Z0-9\-\/]{1,10}$/;
  if (!ext_number || typeof ext_number !== "string") {
    return { valid: false, error: "El número exterior es obligatorio." };
  }
  if (!regex.test(ext_number)) {
    return { valid: false, error: "El número exterior debe ser alfanumérico (máximo 10 caracteres, puede incluir '-' o '/').", };
  }
  return { valid: true };
};
const validateIntNumber = (int_number) => {
  if (!int_number) {
    return { valid: true }; // Campo opcional
  }
  const regex = /^[a-zA-Z0-9\-\/]{1,10}$/;
  if (!regex.test(int_number)) {
    return {
      valid: false,
      error: "El número interior debe ser alfanumérico (máximo 10 caracteres, puede incluir '-' o '/').",
    };
  }
  return { valid: true };
};
const validateNeighborhood = (neighborhood) => {
  if (!neighborhood || typeof neighborhood !== "string") {
    return { valid: false, error: "La colonia es obligatoria." };
  }
  const trimmed = neighborhood.trim();
  if (trimmed.length < 1 || trimmed.length > 100) {
    return { valid: false, error: "La colonia debe tener entre 1 y 100 caracteres." };
  }
  return { valid: true };
};
const validateMunicipality = (municipality) => {
  if (!municipality || typeof municipality !== "string") {
    return { valid: false, error: "El municipio es obligatorio." };
  }
  const trimmed = municipality.trim();
  if (trimmed.length < 1 || trimmed.length > 100) {
    return { valid: false, error: "El municipio debe tener entre 1 y 100 caracteres." };
  }
  return { valid: true };
};
const validateState = (state) => {
  if (!state || typeof state !== "string") {
    return { valid: false, error: "El estado es obligatorio." };
  }
  const trimmed = state.trim();
  if (trimmed.length < 1 || trimmed.length > 100) {
    return { valid: false, error: "El estado debe tener entre 1 y 100 caracteres." };
  }
  return { valid: true };
};
const validateZipCode = (zip_code) => {
  if (!zip_code) {
    return { valid: false, error: "El código postal es obligatorio." };
  }
  if (!/^\d{5}$/.test(zip_code)) {
    return { valid: false, error: "El código postal debe tener exactamente 5 dígitos numéricos." };
  }
  return { valid: true };
};

const validatePhone = (phone) => {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (!/^\+?\d{10,15}$/.test(cleaned)) {
    return { valid: false, error: "El número de teléfono no es válido." };
  }
  return { valid: true };
};

const validateEmail2 = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!regex.test(email)) {
    return { valid: false, error: "El email no es válido." };
  }
  return { valid: true };
};

const validateBankAccount = (email) => {
  const regex = /^\d{10,18}$/;
  if (!regex.test(email)) {
    return { valid: false, error: "La cuenta bancaria no es válida." };
  }
  return { valid: true };
};

const validateFiles = (formData) => { // Para archivos, ejemplo:
  if (!formData.fileCSF || !formData.fileCDB || !formData.fileCDD) {
    return { valid: false, error: "Debes subir todos los archivos requeridos: CSF, Comprobante de Domicilio y Carátula Bancaria." };
  }
  return { valid: true };
};

export const validateFormData = (formData) => { //Funcion para devolver true o false para cada campo y saber que error fue
  let result;

  result = validateNameRS(formData.name_rs);
  if (!result.valid) return result;

  result = validateRFC(formData.rfc);
  if (!result.valid) return result;

  result = validateCURP(formData.curp);
  if (!result.valid) return result;

  result = validateStreet(formData.street); //Nuevos campos de Direccion
  if (!result.valid) return result;
    result = validateExtNumber(formData.ext_number);
  if (!result.valid) return result;
    result = validateIntNumber(formData.int_number);
  if (!result.valid) return result;
    result = validateNeighborhood(formData.neighborhood);
  if (!result.valid) return result;
    result = validateMunicipality(formData.municipality);
  if (!result.valid) return result;
    result = validateState(formData.state);
  if (!result.valid) return result;
    result = validateZipCode(formData.zip_code);
  if (!result.valid) return result;

  result = validatePhone(formData.phone);
  if (!result.valid) return result;

  result = validateEmail2(formData.email);
  if (!result.valid) return result;

  result = validateBankAccount(formData.bank_account);
  if (!result.valid) return result;

  result = validateFiles(formData);
  if (!result.valid) return result;

  if (!formData.userAssign) {
    return { valid: false, error: "Favor de seleccionar un usuario asignado." };
  }

  return { valid: true };
};

// > Invoice
export const validateConcept = (concept) => {
  const regex = /^[a-zA-Z0-9\s.,()\-]{5,100}$/;
  return regex.test(concept.trim());
};

export const validateAmount = (amount) => {
  const regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(amount.trim());
};

export const validateCommission = (value) => {
  const regex = /^\d+(\.\d{1,2})?$/;
  if (!regex.test(value.trim())) return false;

  const number = parseFloat(value);
  return number >= 0 && number <= 100;
};

