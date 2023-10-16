// hook for local storage to store the data and retrieve the data
const useLocalStorage = (key, initialValue) => {
    // get the data from local storage
    const getStoredItem = () => {
        try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
        } catch (error) {
        console.log(error);
        return initialValue;
        }
    };
    // set the data to local storage
    const setStoredItem = (value) => {
        try {
        const valueToStore =
            value instanceof Function ? value(getStoredItem) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
        console.log(error);
        }
    };
    // remove the data from local storage
    const removeStoredItem = () => {
        try {
        window.localStorage.removeItem(key);
        } catch (error) {
        console.log(error);
        }
    };
    return { getStoredItem, setStoredItem, removeStoredItem };
};

export default useLocalStorage;
