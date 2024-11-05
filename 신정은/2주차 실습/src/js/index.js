import { $ } from "./utils/dom.js";
import { MenuAPI } from "./libs/index.js";
import { MESSAGE } from "./constants/index.js";

function App() {
    this.menu = [];

    this.updateMenuCount = () => {
        const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
        $(".menu-count").innerText = `총 ${menuCount}개`;
    };

    this.render = async () => {
        const template = this.menu
            .map((menuItem) => {
                return `
                <li class="menu-list-item d-flex items-center py-2" data-menu-id="${menuItem.id}">
                    <span class="w-100 pl-2 menu-name ${menuItem.soldout ? "sold-out" : ""}">${menuItem.name}</span>
                    <button
                        type="button"
                        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-soldout-button"
                    >
                        ${menuItem.soldout ? "취소" : "품절"}
                    </button>
                    <button
                        type="button"
                        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
                    >
                        수정
                    </button>
                    <button
                        type="button"
                        class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
                    >
                        삭제
                    </button>
                </li>`;
            })
            .join("");

        $("#espresso-menu-list").innerHTML = template;
        this.updateMenuCount();
    };

    this.loadMenu = async () => {
        try {
            this.menu = await MenuAPI.loadMenuAPI("espresso");
            await this.render();
        } catch (error) {
            alert(MESSAGE.ALERT_API);
        }
    };

    this.addMenuName = async () => {
        const menuName = $("#espresso-menu-name").value.trim();
        if (menuName === "") {
            alert(MESSAGE.ALERT_EMPTY);
            return;
        }

        if (this.menu.some((menuItem) => menuItem.name === menuName)) {
            alert(MESSAGE.ALERT_DUPLICATE);
            return;
        }

        try {
            const response = await MenuAPI.createMenuAPI(menuName, "espresso");
            if (response.ok) {
                await this.loadMenu();
                $("#espresso-menu-name").value = "";
            } else {
                alert(MESSAGE.ALERT_API);
            }
        } catch (error) {
            alert(MESSAGE.ALERT_API);
        }
    };

    this.updateMenuName = async (e) => {
        const $menuName = e.target.closest("li").querySelector(".menu-name");
        const menuName = $menuName.innerText;
        const updatedMenuName = prompt(MESSAGE.PROMPT_UPDATE, menuName);

        if (updatedMenuName && updatedMenuName.trim() !== "") {
            const menuId = e.target.closest("li").dataset.menuId;

            if (this.menu.some((menuItem) => menuItem.name === updatedMenuName)) {
                alert(MESSAGE.ALERT_DUPLICATE);
                return;
            }

            try {
                const response = await MenuAPI.updateMenuAPI(updatedMenuName, "espresso", menuId);
                if (response.ok) {
                    await this.loadMenu();
                } else {
                    alert(MESSAGE.ALERT_API);
                }
            } catch (error) {
                alert(MESSAGE.ALERT_API);
            }
        }
    };

    this.removeMenuName = async (e) => {
        if (confirm(MESSAGE.CONFIRM_DELETE)) {
            const menuId = e.target.closest("li").dataset.menuId;

            try {
                const response = await MenuAPI.deleteMenuAPI("espresso", menuId);
                if (response.ok) {
                    await this.loadMenu();
                } else {
                    alert(MESSAGE.ALERT_API);
                }
            } catch (error) {
                alert(MESSAGE.ALERT_API);
            }
        }
    };

    this.soldOutMenu = async (e) => {
        const menuId = e.target.closest("li").dataset.menuId;

        try {
            const response = await MenuAPI.soldOutMenuAPI("espresso", menuId);
            if (response.ok) {
                await this.loadMenu();
            } else {
                alert(MESSAGE.ALERT_API);
            }
        } catch (error) {
            alert(MESSAGE.ALERT_API);
        }
    };

    this.changeCategory = (e) => {
        // 카테고리 변경 로직 추가 필요 시 구현
    };

    this.initEventListeners = async () => {
        $("#espresso-menu-list").addEventListener("click", (e) => {
            if (e.target.classList.contains("menu-edit-button")) {
                this.updateMenuName(e);
            } else if (e.target.classList.contains("menu-remove-button")) {
                this.removeMenuName(e);
            } else if (e.target.classList.contains("menu-soldout-button")) {
                this.soldOutMenu(e);
            }
        });

        $("#espresso-menu-form").addEventListener("submit", (e) => {
            e.preventDefault();
        });

        $("#espresso-menu-submit-button").addEventListener("click", this.addMenuName);

        $("#espresso-menu-name").addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.addMenuName();
            }
        });
    };

    this.init = async () => {
        await this.loadMenu();
        await this.initEventListeners();
    };

    this.init();
}

App();
