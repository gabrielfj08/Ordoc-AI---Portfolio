const buildParams = (data: any) => {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]: (string | any)[]) => {
    if (value) {
      if (value.toString().includes(',')) {
        value.split(',').forEach((item: any) => {
          if (item) {
            params.append(`${key}[]`, item);
          }
        });
      } else {
        params.append(key, value);
      }
    }
  });

  return params.toString();
};

export default buildParams;
