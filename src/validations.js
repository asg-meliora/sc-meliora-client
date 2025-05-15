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
export const validateNameRS = (name_rs) => {
  const regex = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü0-9\s\.,-]{3,}$/;
  return regex.test(name_rs);
};
export const validateRFC = (rfc) => {
  const regex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i;
  return regex.test(rfc);
};
export const validateCURP = (curp) => {
  const regex = /^[A-Z][AEIOU][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/i;
  return regex.test(curp);
};
export const validateAddress = (address) => {
  return typeof address === "string" && address.trim().length >= 10;
};
export const validateZipCode = (zip) => {
  return /^\d{5}$/.test(zip);
};
export const validatePhone = (phone) => {
  const cleaned = phone.replace(/[^\d+]/g, "");
  return /^\+?\d{10,15}$/.test(cleaned);
};
export const validateBankAccount = (account) => {
  return /^\d{10,18}$/.test(account);
};
export const validateFiles = (formData) => {
  if (!formData.fileCSF || !formData.fileCDB || !formData.fileCDD) {
    return false;
  }
  return true;
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

