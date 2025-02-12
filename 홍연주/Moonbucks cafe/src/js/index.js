import { $ } from './utils/dom.js';
import store from './store/index.js';
import MenuApi from './api/index.js';

function App() {
  // 객체로 각 카테고리 관리하기
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso'; // 처음 보여지는 카테고리는 무조건 espresso

  this.init = async () => {
    render();
    initEventListeners();
  };

  // 데이터 그려주는 로직 (재사용)
  const render = async () => {
    try {
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
        const template = this.menu[this.currentCategory]
            .map((menuItem) => {
                return `
                    <li data-menu-id="${menuItem.id}" class="menu-list-item d-flex items-center py-2">
                        <span class="w-100 pl-2 menu-name ${menuItem.issoldOut ? "sold-out" : ""}">
                            ${menuItem.name}
                        </span>
                        <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button">
                            품절
                        </button>
                        <button type="button" class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button">
                            수정
                        </button>
                        <button type="button" class="bg-gray-50 text-gray-500 text-sm menu-remove-button">
                            삭제
                        </button>
                    </li>`;
            })
            .join("");
        $("#menu-list").innerHTML = template;
        updateMenuCount();
    } catch (error) {
        console.error("Error rendering menu:", error);
        alert("메뉴를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
};

  // 메뉴 개수 카운팅
  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $('.menu-count').innerText = `총 ${menuCount} 개`;
  };

  // 메뉴를 추가할 때
  const addMenuName = async () => {
    if ($('#menu-name').value === '') {
      alert('값을 입력해주세요!');
      return;
    }

    const duplicatedItem = this.menu[this.currentCategory].find((menuItem) => menuItem.name === $('#menu-name').value);
    if (duplicatedItem) {
      alert('이미 등록된 메뉴입니다. 다시 입력해주세요.');
      $('#menu-name').value = '';
      return;
    }

    const menuName = $('#menu-name').value;

    await MenuApi.createMenu(this.currentCategory, menuName);
    render();
    $('#menu-name').value = '';
  };

  // 메뉴 수정 함수
  const updateMenuName = async (e) => {
    // data-menu-id 속성을 이용해서 값을 가져올 수 있음
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt('메뉴명을 수정하세요.', $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    render();
  };

  // 메뉴 삭제 함수
  const removeMenuName = async (e) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const menuId = e.target.closest('li').dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  };

  // 메뉴 품절 함수
  const soldOutMenu = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains('cafe-category-name');
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  };

  const initEventListeners = () => {
    // 메뉴 수정할 때 & 메뉴 삭제 할 때 & 메뉴 품절 일 때
    $('#menu-list').addEventListener('click', (e) => {
      // 메뉴 수정
      if (e.target.classList.contains('menu-edit-button')) {
        updateMenuName(e);
        return; // 불필요한 if문 밑의 연산들이 작동안하게 하기 위해서 쓴다
      }
      // 메뉴 삭제
      if (e.target.classList.contains('menu-remove-button')) {
        removeMenuName(e);
        return;
      }
      // 메뉴 품절
      if (e.target.classList.contains('menu-sold-out-button')) {
        soldOutMenu(e);
        return;
      }
    });

    // form태그 새로고침 막아주는 것
    $('#menu-form').addEventListener('submit', (e) => {
      e.preventDefault();
    });

    // 확인 버튼을 눌렀을 때
    $('#menu-submit-button').addEventListener('click', addMenuName);

    // 엔터키를 눌렀을 때
    $('#menu-name').addEventListener('keypress', (e) => {
      if (e.key !== 'Enter') {
        return;
      }
      addMenuName();
    });

    // 카테고리별 메뉴판 관리하기
    $('nav').addEventListener('click', changeCategory);
  };
}

// new 키워드를 사용하여 생성자 함수를 호출하게 되면 이때의 this는 "만들어질 객체"를 참조한다.
const app = new App();
// 인스턴스가 생성이되고, app.init()이 실행되면서 로컬스토리지에 있는 값을 불러옴
app.init();