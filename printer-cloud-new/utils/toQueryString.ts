const toQueryString = (options: Object) => {
  const urlSearchParams = new URLSearchParams();

  Object.entries(options).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        urlSearchParams.append(`${key}`, item);
      });
    } else {
      urlSearchParams.append(`${key}`, value);
    }
  });

  return urlSearchParams.toString();
};

export default toQueryString;
