# Week1

~10

### Babel

우리가 쓰는 내용들을 javascript로(컴퓨터가 이해할 수 있는 언어로) 변환하는 컴파일러(번역기)

{ }: javascript문법을 리액트 안에서 사용가능

표현식: 계산 결과가 바로 나오는 식

리액트에서 그릴 수 있는 내용: 최상위 태그가 하나여야만 가능

컴포넌트는 “대문자”로 시작!!

함수에서 props는 children으로 넘어온다

const MainCard = ({ img }) ⇒ ( <img src={img}/>)

- 원래대로라면, (props) ⇒ (<img src={props.img}/>)