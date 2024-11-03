import { $ } from "./utils/dom.js";
import store from "./store/index.js";

// - [] 웹 세버를 띄운다.
// - [] 서버에 새로운 메뉴가 추가될 수 있도록 요청한다.
// - [] 서버에 카테고리별 메뉴리스트를 불러온다.
// - [] 서버에 메뉴가 수정될 수 있도록 요청한다.
// - [] 서버에 메뉴의 품질상태가 토글될 수 있또록 한다.
// - [] 서버에 메뉴가 삭제될 수 있도록 요청한다.

// TODO 리펙터링 부분
// - [] localStorage에 저장하는 로직은 지운다.
// - [] fetch 비동기 api 사용하는 부분을 async await을 사용하여 구현한다.

// - [] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert로 예외처리를 진행한다.
// - [] 중복되는 메뉴는 추가할 수 없다.

const $ = (selector) => document.querySelector(selector);

const store = {
    setLocalStorage(menu) {
        localStorage.setItem("menu", JSON.stringify(menu));
    },
    getLocalStorage() {
        return JSON.parse(localStorage.getItem("menu")) || [];
    },
};

function App() {
    // 상태는 변하는 데이터, 이 앱에서 변하는 것이 무엇인가: 메뉴명
    this.menu = store.getLocalStorage();

    const updateMenuCount = () => {
        const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
        $(".menu-count").innerText = `총 ${menuCount}개`;
    };

    const render = () => {
        const template = this.menu
            .map((menuItem, index) => {
                return `
                <li class="menu-list-item d-flex items-center py-2" data-menu-id="${index}">
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
        updateMenuCount();
    };

    const addMenuName = () => {
        if ($("#espresso-menu-name").value === "") {
            alert("값을 입력해주세요");
            return;
        }

        const espressoMenuName = $("#espresso-menu-name").value;
        this.menu.push({ name: espressoMenuName, soldout: false });
        store.setLocalStorage(this.menu);

        render();
        $("#espresso-menu-name").value = "";
    };

    fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
        method: "POST", headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: menuName }),
    
    }).then((response)=> {
        response.json()
        console.log(response);
    });

    const updateMenuName = (e) => {
        const $menuName = e.target.closest("li").querySelector(".menu-name");
        const menuName = $menuName.innerText;
        const updatedMenuName = prompt("신규 메뉴명을 입력하세요", menuName);

        if (updatedMenuName) {
            const menuId = e.target.closest("li").dataset.menuId;
            this.menu[menuId].name = updatedMenuName;
            store.setLocalStorage(this.menu);
            render();
        }
    };

    const removeMenuName = (e) => {
        if (confirm("정말 삭제하시겠습니까?")) {
            const menuId = e.target.closest("li").dataset.menuId;
            this.menu.splice(menuId, 1);
            store.setLocalStorage(this.menu);
            render();
        }
    };

    const soldOutMenu = (e) => {
        const menuId = e.target.closest("li").dataset.menuId;
        this.menu[menuId].soldout = !this.menu[menuId].soldout;
        store.setLocalStorage(this.menu);
        render();
    };

    // 메뉴 초기화 및 렌더링
    const init = () => {
        render();
    };

    // 메뉴 수정, 삭제, 품절 이벤트
    $("#espresso-menu-list").addEventListener("click", (e) => {
        if (e.target.classList.contains("menu-edit-button")) {
            updateMenuName(e);
        } else if (e.target.classList.contains("menu-remove-button")) {
            removeMenuName(e);
        } else if (e.target.classList.contains("menu-soldout-button")) {
            soldOutMenu(e);
        }
    });

    // form 태그가 자동으로 전송되는 걸 막기 
    $("#espresso-menu-form").addEventListener("submit", (e) => {
        e.preventDefault();
    });

    // 메뉴 이름 입력받기 (클릭)
    $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

    // 메뉴의 이름 입력받기 (엔터) 
    $("#espresso-menu-name").addEventListener("keypress", (e) => {
        if (e.key !== "Enter") {
            return;
        }
        addMenuName();
    });

    init();
}

App();
