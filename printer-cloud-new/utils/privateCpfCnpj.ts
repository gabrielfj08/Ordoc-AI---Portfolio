const privateCpfCnpj = (value: any): any => {
  const numericValue = value.replace(/\D/g, '');

  if (numericValue.length === 11) {
    return numericValue.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.***.***-$4'
    );
  } else if (numericValue.length === 14) {
    return numericValue.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.***.***/****-$5'
    );
  }

  return value;
};

export default privateCpfCnpj;
