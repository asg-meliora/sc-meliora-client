// > User Creation
// ? User validation
export const validateUserName = (name) => {
  if (!name || name.length < 3 || name.length > 20) {
    return {
      valid: false,
      error: "Por favor, introduce un nombre válido. (Mínimo 3 y máximo 20 caracteres)."
    };
  }
  return { valid: true };
};
// ? Password Validation
export const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "La contraseña es obligatoria y debe ser una cadena de texto." };
  }

  if (password.length < 8) {
    return { valid: false, error: "La contraseña debe tener al menos 8 caracteres." };
  }

  if (!/[A-Za-z]/.test(password)) {
    return { valid: false, error: "La contraseña debe contener al menos una letra (A-Z o a-z)." };
  }

  if (!/\d/.test(password)) {
    return { valid: false, error: "La contraseña debe contener al menos un número." };
  }

  if (!/[@$!%*?&#/]/.test(password)) {
    return {
      valid: false,
      error: "La contraseña debe contener al menos un carácter especial como @$!%*?&#/.",
    };
  }

  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#/])[A-Za-z\d@$!%*?&#/]{8,}$/;
  if (!regex.test(password)) {
    return { valid: false, error: "La contraseña contiene caracteres no permitidos." };
  }

  return { valid: true };
};


// > File Creation
// ? Razon Social Validation
const validateNameRS = (name_rs) => {
  if (!name_rs || name_rs.length < 3) {
    return { valid: false, error: "La Razón Social es obligatioria debe tener al menos 3 caracteres." };
  }
  const invalidChars = name_rs.match(/[^A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9\s\.,-]/);
  if (invalidChars) {
    return { valid: false, error: `La Razón Social contiene caracteres no permitidos: ${invalidChars[0]}` };
  }
  return { valid: true };
};

// ? RFC Validation
const validateRFC = (rfc) => {
  if (!rfc || typeof rfc !== "string") {
    return { valid: false, error: "El RFC es obligatorio." };
  }

  const upperRFC = rfc.toUpperCase();
  if (!/^[A-ZÑ&]{3,4}/.test(upperRFC)) {
    return { valid: false, error: "El RFC debe comenzar con 3 o 4 letras." };
  }
  if (!/\d{6}/.test(upperRFC.substring(3, 9))) {
    return { valid: false, error: "El RFC debe contener una fecha en formato AAMMDD después de las letras." };
  }
  if (!/[A-Z0-9]{3}$/.test(upperRFC)) {
    return { valid: false, error: "El RFC debe terminar con 3 caracteres alfanuméricos." };
  }
  if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i.test(upperRFC)) {
    return { valid: false, error: "El RFC no cumple con el formato completo requerido." };
  }

  return { valid: true };
};

// ? CURP Validation
const validateCURP = (curp) => {
  if (!curp || typeof curp !== "string") {
    return { valid: false, error: "El CURP es obligatorio." };
  }

  const upperCURP = curp.toUpperCase();
  if (!/^[A-Z][AEIOU][A-Z]{2}/.test(upperCURP)) {
    return { valid: false, error: "Los primeros 4 caracteres del CURP deben seguir el patrón: consonante, vocal, dos consonantes." };
  }
  if (!/\d{6}/.test(upperCURP.substring(4, 10))) {
    return { valid: false, error: "El CURP debe incluir una fecha en formato AAMMDD en las posiciones 5 a 10." };
  }
  if (!/[HM]/.test(upperCURP[10])) {
    return { valid: false, error: "El carácter 11 del CURP debe ser H (hombre) o M (mujer)." };
  }
  if (!/^[A-Z]{5}/.test(upperCURP.substring(11, 16))) {
    return { valid: false, error: "Las posiciones 12 a 16 deben ser letras correspondientes a la entidad federativa y consonantes internas." };
  }
  if (!/[A-Z0-9]/.test(upperCURP[16])) {
    return { valid: false, error: "El carácter 17 debe ser una letra o número válido." };
  }
  if (!/\d/.test(upperCURP[17])) {
    return { valid: false, error: "El último carácter del CURP debe ser un dígito." };
  }

  if (!/^[A-Z][AEIOU][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/i.test(upperCURP)) {
    return { valid: false, error: "El CURP no cumple con el formato completo requerido." };
  }

  return { valid: true };
};

// ? Address Validation
// * Street Validation
const validateStreet = (street) => {
  if (!street || typeof street !== "string") {
    return { valid: false, error: "La calle es obligatoria." };
  }
  const trimmed = street.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "La calle no puede estar vacía o solo contener espacios." };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "La calle no debe superar los 100 caracteres." };
  }
  return { valid: true };
};
// * External Number Validation
const validateExtNumber = (ext_number) => {
  if (!ext_number || typeof ext_number !== "string") {
    return { valid: false, error: "El número exterior es obligatorio." };
  }
  const trimmed = ext_number.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "El número exterior no puede estar vacío." };
  }
  if (trimmed.length > 10) {
    return { valid: false, error: "El número exterior no debe exceder los 10 caracteres." };
  }
  const regex = /^[a-zA-Z0-9\-\/]+$/;
  if (!regex.test(trimmed)) {
    return {
      valid: false,
      error: "El número exterior solo puede contener letras, números, guiones (-) y diagonales (/).",
    };
  }
  return { valid: true };
};
// * Internal number Validation
const validateIntNumber = (int_number) => {
  if (!int_number) {
    return { valid: true };
  }
  if (typeof int_number !== "string") {
    return { valid: false, error: "El número interior debe ser un texto." };
  }
  const trimmed = int_number.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "El número interior no puede estar vacío si se proporciona." };
  }
  if (trimmed.length > 10) {
    return { valid: false, error: "El número interior no debe exceder los 10 caracteres." };
  }
  const regex = /^[a-zA-Z0-9\-\/]+$/;
  if (!regex.test(trimmed)) {
    return {
      valid: false,
      error: "El número interior solo puede contener letras, números, guiones (-) y diagonales (/).",
    };
  }
  return { valid: true };
};
// * Neighborhood, Municipality & State Validation
const validateGenericField = (value, fieldName) => {
  if (!value || typeof value !== "string") {
    return { valid: false, error: `El campo "${fieldName}" es obligatorio.` };
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: `El campo "${fieldName}" no puede estar vacío.` };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: `El campo "${fieldName}" no debe superar los 100 caracteres.` };
  }
  return { valid: true };
};
const validateNeighborhood = (neighborhood) => validateGenericField(neighborhood, "colonia");
const validateMunicipality = (municipality) => validateGenericField(municipality, "municipio");
const validateState = (state) => validateGenericField(state, "estado");
// * Zip Code Validation
const validateZipCode = (zip_code) => {
  if (!zip_code) {
    return { valid: false, error: "El código postal es obligatorio." };
  }
  if (typeof zip_code !== "string") {
    return { valid: false, error: "El código postal debe ser un número." };
  }
  const trimmed = zip_code.trim();
  if (!/^\d{5}$/.test(trimmed)) {
    return { valid: false, error: "El código postal debe tener exactamente 5 dígitos numéricos." };
  }
  return { valid: true };
};

// ? Phone Validation
const validatePhone = (phone) => {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (!/^\+?\d{10,15}$/.test(cleaned)) {
    return { valid: false, error: "El número de teléfono no es válido." };
  }
  return { valid: true };
};

// ? Email Validation
export const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "El correo electrónico es obligatorio." };
  }

  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "El correo electrónico no puede estar vacío." };
  }

  if (!trimmed.includes("@")) {
    return { valid: false, error: "El correo electrónico debe contener un símbolo '@'." };
  }

  const [local, domain] = trimmed.split("@");

  if (!domain || !domain.includes(".")) {
    return { valid: false, error: "El dominio del correo debe incluir un punto ('.') después del '@'." };
  }

  if (domain.split(".").pop().length < 2) {
    return { valid: false, error: "La extensión del dominio debe tener al menos 2 caracteres." };
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!regex.test(trimmed)) {
    return { valid: false, error: "El formato del correo electrónico no es válido." };
  }

  return { valid: true };
};

const validateBankAccount = (accountNumber) => {
  if (!accountNumber || typeof accountNumber !== "string") {
    return { valid: false, error: "La cuenta bancaria es obligatoria y debe ser una secuencia de números." };
  }

  const trimmed = accountNumber.trim();

  if (!/^\d+$/.test(trimmed)) {
    return { valid: false, error: "La cuenta bancaria solo debe contener dígitos numéricos." };
  }

  if (trimmed.length < 10 || trimmed.length > 18) {
    return {
      valid: false,
      error: "La cuenta bancaria debe tener entre 10 y 18 dígitos.",
    };
  }

  return { valid: true };
};

const validateFiles = (formData) => {
  const missingFiles = [];
  if (!formData.fileCSF) missingFiles.push("Constancia de Situación Fiscal (CSF)");
  if (!formData.fileCDB) missingFiles.push("Comprobante de Domicilio (CDB)");
  if (!formData.fileCDD) missingFiles.push("Carátula Bancaria (CDD)");

  if (missingFiles.length > 0) {
    return {
      valid: false,
      error: `Faltan los siguientes archivos: ${missingFiles.join(", ")}.`,
    };
  }

  return { valid: true };
};

// > Invoice
// ? Invoice Type Validation
const validateInvoiceType = (value) => {
  if (!value) {
    return { valid: false, error: "El tipo de factura es obligatorio." };
  }
  return { valid: true };
};
// ? Concept validation
const validateConcept = (concept) => {
  if (!concept || typeof concept !== "string") {
    return { valid: false, error: "El concepto es obligatorio y debe ser una cadena de texto." };
  }

  const trimmed = concept.trim();
  if (trimmed.length < 5 || trimmed.length > 100) {
    return { valid: false, error: "El concepto debe tener entre 5 y 100 caracteres." };
  }

  const invalidChars = trimmed.match(/[^a-zA-Z0-9\s.,()\-]/);
  if (invalidChars) {
    return {
      valid: false,
      error: `El concepto contiene caracteres no permitidos: '${invalidChars[0]}'`,
    };
  }

  return { valid: true };
};
// ? Payment Type validation
const validatePaymentType = (value) => {
  if (!value) {
    return { valid: false, error: "El tipo de pago es obligatorio." };
  }
  return { valid: true };
};
// ? Amount validation
const validateAmount = (amount) => {
  if (!amount || typeof amount !== "string") {
    return { valid: false, error: "El total es obligatorio y debe ser una secuecia numérica." };
  }

  const trimmed = amount.trim();
  const invalidChars = trimmed.match(/[^\d.]/);
  if (invalidChars) {
    return {
      valid: false,
      error: `El total contiene caracteres no permitidos: '${invalidChars[0]}'`,
    };
  }

  const regex = /^\d+(\.\d{1,2})?$/;
  if (!regex.test(trimmed)) {
    return {
      valid: false,
      error: "El total debe ser un número válido con hasta dos decimales.",
    };
  }

  return { valid: true };
};
// ? Commission validation
const validateCommission = (value) => {
  if (!value || typeof value !== "string") {
    return { valid: false, error: "El porcentaje de comisión debe ser una secuencia numérica." };
  }

  const trimmed = value.trim();
  const regex = /^\d+(\.\d{1,2})?$/;

  if (!regex.test(trimmed)) {
    return {
      valid: false,
      error: "El porcentaje de comisión debe ser un número válido con hasta dos decimales.",
    };
  }

  const number = parseFloat(trimmed);
  if (number < 0 || number > 100) {
    return {
      valid: false,
      error: "El porcentaje de comisión debe estar entre 0 y 100.",
    };
  }

  return { valid: true };
};
// ? Client Sender validation
const validateClientSender = (value) => {
  if (!value) {
    return { valid: false, error: "El cliente emisor es obligatorio." };
  }
  return { valid: true };
};
// Cient Receiver validation
const validateClientReceiver = (value) => {
  if (!value) {
    return { valid: false, error: "El cliente receptor es obligatorio." };
  }
  return { valid: true };
};

export const validateUserFormData = (formData) => {
  let result;

  result = validateUserName(formData.user_name);
  if (!result.valid) return result;

  result = validatePassword(formData.password_hash);
  if (!result.valid) return result;

  return { valid: true };
}

export const validateFileFormData = (formData) => { //Funcion para devolver true o false para cada campo y saber que error fue
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

  result = validateEmail(formData.email);
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

export const validateInvoiceFormData = (formData) => {
  let result;

  result = validateInvoiceType(formData.invoice_type);
  if (!result.valid) return result;

  result = validateConcept(formData.invoice_concept);
  if (!result.valid) return result;

  result = validatePaymentType(formData.invoice_payment_type)

  result = validateAmount(formData.invoice_total);
  if (!result.valid) return result;

  result = validateCommission(formData.invoice_comision_percentage);
  if (!result.valid) return result;

  result = validateClientSender(formData.invoice_client_sender)
  if (!result.valid) return result;

  result = validateClientReceiver(formData.invoice_client_receiver)

  return { valid: true };
}