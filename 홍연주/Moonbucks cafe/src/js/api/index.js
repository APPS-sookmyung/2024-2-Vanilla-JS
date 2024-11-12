const BASE_URL = "http://localhost:3000/api"

const HTTP_METHOD = {
    POST(data) {
        return {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
    },
    PUT(data) {
        return {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json",
            },
            body: data? JSON.stringify({data}): null
        };
    },
    DELETE() {
        return {
            method: "DELETE",
        };
    },
};

const request = async (url, option) => {
    const response = await fetch(url, option)
    if(!response.ok) {
        alert("에러가 발생했습니다.")
        console.error(e);
    }
    return response.json();
};

const requestWithoutJson = async(url, option) => {
    const response = await fetch(url, option)
    if(!response.ok) {
        alert("에러가 발생했습니다.")
        console.error(e);
    }
    return response();
}

const MenuApi = {
    async getAllMenuByCategory(category) {
        try {
            return await request(`${BASE_URL}/category/${category}/menu`);
        } catch (error) {
            console.error("Error fetching menu by category:", error);
            throw error; // 호출한 곳에서 오류를 처리할 수 있도록 다시 throw
        }
    },
    async createMenu(category, name) {
        try {
            return await request(`${BASE_URL}/category/${category}/menu`, HTTP_METHOD.POST({ name }));
        } catch (error) {
            console.error("Error creating menu:", error);
            throw error;
        }
    },
    async updateMenu(category, name, menuId) {
        try {
            return await request(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.PUT({ name }));
        } catch (error) {
            console.error("Error updating menu:", error);
            throw error;
        }
    },
    async toggleSoldOutMenu(category, menuId) {
        try {
            return await request(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, HTTP_METHOD.PUT());
        } catch (error) {
            console.error("Error toggling sold-out status:", error);
            throw error;
        }
    },
    async deleteMenu(category, menuId) {
        try {
            return await requestWithoutJson(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.DELETE());
        } catch (error) {
            console.error("Error deleting menu:", error);
            throw error;
        }
    },
};

export default MenuApi;