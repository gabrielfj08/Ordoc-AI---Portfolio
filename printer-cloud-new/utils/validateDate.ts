const isInvalidDate: (value: string | undefined) => boolean = (value) => {
  if (typeof value !== 'string') return true;

  if (!/^\d{4}\-\d{2}\-\d{2}$/.test(String(value))) {
    return true;
  }

  const dateSplit = value.split('-');

  const date = {
    day: dateSplit[2],
    month: dateSplit[1],
    year: dateSplit[0],
  };

  const day = parseInt(date.day);
  const month = parseInt(date.month);
  const year = parseInt(date.year);

  const monthsDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
    monthsDays[2] = 29;
  }

  if (month < 1 || month > 12 || day < 1) {
    return true;
  } else if (day > monthsDays[month]) {
    return true;
  }

  return false;
};

export default isInvalidDate;
