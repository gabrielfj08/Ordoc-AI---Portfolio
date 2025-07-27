// TODO: IMPROVE FUNCTION LOGIC
export const camelToSnake = (obj: Record<string, any>) => {
  const newObj = Object.assign({}, obj);

  if (typeof newObj != 'object') return newObj;

  for (var oldName in newObj) {
    // Camel to underscore
    const newName = oldName.replace(/([A-Z])/g, function ($1) {
      return '_' + $1.toLowerCase();
    });

    // Only process if names are different
    if (newName != oldName) {
      // Check for the old property name to avoid a ReferenceError in strict mode.
      if (newObj.hasOwnProperty(oldName)) {
        newObj[newName] = newObj[oldName];
        delete newObj[oldName];
      }
    }

    // Recursion
    if (typeof newObj[newName] == 'object') {
      newObj[newName] = camelToSnake(newObj[newName]);
    }
  }

  return newObj;
};
