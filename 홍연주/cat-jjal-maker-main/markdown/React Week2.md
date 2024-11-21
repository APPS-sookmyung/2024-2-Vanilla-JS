# Week2

~23(로컬스토리지에 데이터 싱크하기)

Html: onclike=”sayHi()”

React: onClick={sayHi}

### 리액트에서 스타일링하기

1. class > className
- 2. style={{key: “value”}}
    - style을 적고, {}안에 객체 만들어주기({}), 안에 원하는 key, value값 저장(value값은 string으로!!)
1. emotion 라이브러리 이용 > css prop 이용
2. Tailwindd CSS > classname이용

### 이벤트다루기

1. function만들기 ⇒ 이름은 handel~로 시작
2. on효과={function이름}

```
    const counterState = React.useState(1);
    const counter = counterState[0];
    const setCounter = counterState[1];

```

### 상태끌어올리기

부모 컴포넌트에서 함수 선언,

자식 컴포넌트에 프롭으로 넘겨줌

⇒ 깔끔하고, 재사용하기 쉽도록 센스있게 자~알 만들면 됨!

toUpperCase()

로컬에서 저장할 때 무조건 string으로 저장함.