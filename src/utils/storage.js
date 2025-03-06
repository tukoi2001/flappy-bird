export const setLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    window.localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error serializing data for localStorage", error);
  }
};

export const getLocalStorage = (key) => {
  const value = window.localStorage.getItem(key);
  try {
    if (value) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.error("Error parsing JSON from localStorage", error);
  }
  return null;
};

export const removeLocalStorage = (key) => {
  window.localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
  window.localStorage.clear();
};
