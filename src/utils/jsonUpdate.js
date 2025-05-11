const updateJsonObject = (obj, path, newValue) => {
  let newObj = { ...obj };
  let current = newObj;

  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]];
  }

  current[path[path.length - 1]] = JSON.parse(newValue);
  return newObj;
};

export default updateJsonObject;