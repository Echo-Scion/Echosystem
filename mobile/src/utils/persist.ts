import AsyncStorage from '@react-native-async-storage/async-storage';

let storageNamespace = 'echosystem';

const getKey = (name: string) => `${storageNamespace}_${name}`;

export const setStorageNamespace = (namespace: string) => {
  storageNamespace = namespace;
};

export const asyncStoragePersist = {
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItem(getKey(name));
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) =>
    AsyncStorage.setItem(getKey(name), JSON.stringify(value)),
  removeItem: (name: string) => AsyncStorage.removeItem(getKey(name)),
};
