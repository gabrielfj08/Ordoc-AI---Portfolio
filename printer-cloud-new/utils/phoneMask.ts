const phoneMask = (value: string | undefined) => {
  value = value!.replace(/\D/g, '');

  if (value.length <= 10) {
    value = value.replace(/(\d{0})(\d)/, '$1($2');
    value = value.replace(/(\d{2})(\d)/, '$1)$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    value = value.replace(/(\d{3})(\d)/, '****');
  } else {
    value = value.replace(/(\d{0})(\d)/, '$1($2');
    value = value.replace(/(\d{2})(\d)/, '$1)$2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    value = value.replace(/(\d{4})(\d)/, '*****');
  }

  return value;
};

export default phoneMask;
