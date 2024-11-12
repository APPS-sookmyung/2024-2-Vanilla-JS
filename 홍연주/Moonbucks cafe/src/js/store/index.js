const store = {
    setLocalStorage(menu) {
        return localStorage.setItem("menu", JSON.stringify(menu));
    },
    getLocalStorage() {
        return JSON.parse(localStorage.getItem("menu"));
    },
};

export default store;