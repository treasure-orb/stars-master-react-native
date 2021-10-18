const validatePhone = (phoneNumber) => {
  const phoneNo = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  if (phoneNumber.match(phoneNo)) return true;
  else return false;
};

export default validatePhone;
