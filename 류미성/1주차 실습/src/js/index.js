// step1 요구사항 구현을 위한 전략

// TODO 메뉴 추가
// - [x] 메뉴의 이름을 입력받고 확인버튼을 누르면 메뉴가 추가된다.
// - [x] 메뉴의 이름을 입력 받고 확인 버튼을 클릭하면 메뉴를 추가한다.
// - [x] 메뉴의 이름을 입력받고 엔터키 입력으로 추가한다.
// - [x] 추가되는 메뉴의 마크업은 `<ul id="expresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// 달러표시는 JS에서의 DOM 엘레먼트, HTML DOM 엘레멘트를 가져올 때 관용적으로 사용
const $ = (selector) => document.querySelector(selector);

function App() {
	// form 태그가 자동으로 전송되는걸 막아준다 (새로고침)
	$("#espresso-menu-form").addEventListener("submit", (e) => {
		e.preventDefault();
	});

	// 재사용할 수 있는 함수
	const AddMenuName = () => {
		// input창 밸류가 빈 값인 경우 alert창 띄우기
		if ($("#espresso-menu-name").value === "") {
			alert("값을 입력해주세요");
			// early return을 통해 뒷부분이 수행되지 않도록 함
			return;
		}

		if (e.key === "Enter") {
			const espressoMenuName = $("#espresso-menu-name").value;
			const menuItemTemplate = (espressoMenuName) => {
				return `<li class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${name}</span>
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
			};
			// > 덮어쓰기가 되므로 insertAdjacentHTML 속성 써야함 (공식 문서에 beforeend외에도 종류가 더 있음)
			// $('#espresso-menu-list').innerHTML = menuItemTemplate(espressoMenuName)
			$("#espresso-menu-list").insertAdjacentHTML("beforeend", menuItemTemplate(espressoMenuName));

			// count 변수 = li 갯수를 카운팅해서
			const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
			$(".menu-count").innerText = `총 ${menuCount} 개`;
			$("#espresso-menu-name").value = ""; // input창을 빈 칸으로 만듦
		}
	};

	// 확인 버튼
	$("#espresso-menu-submit-button").addEventListener("click", () => {
		AddMenuName();
	});

	// 메뉴 입력 받기
	$("#espresso-menu-name").addEventListener("keypress", (e) => {
		// enter키를 누르지 않아도 alert창을 띄워지는 문제 해결
		if (e.key !== "Enter") {
			return;
		}
		AddMenuName();
	});
}

// TODO 메뉴 수정
// - [] 메뉴의 수정 버튼클릭 이벤트를 받고, 메뉴수정하는 모달창이 뜬다.
// - [] 모달창에서 신규 메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.

// TODO 메뉴 삭제
// - [] 메뉴 삭제버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
// - [] 확인 버튼을 클릭하면 메뉴가 삭제된다.
