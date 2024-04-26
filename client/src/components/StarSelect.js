import { useState } from "react";
import { StarFill } from "react-bootstrap-icons";

function StarSelect({size}) {
  const totalStar = 5;
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [score, setScore] = useState(0);

  const defaultStyle = { color: "#bebdbd" }; // 짙은 노란색
  const hoverStyle = { color: "#FFC100" }; // 회색

  // function handleMouseEnter(index) { // 마우스 올려 놓을 때 색 바뀌기 처리
  //     setHoverIndex(index);
  // }

  // function handleMouseLeave() { // 마우스 벗어날 때 색 바뀌기 처리
  //     setHoverIndex(-1);
  // }

  function handleClick(index) {
    // 클릭 처리
    setScore(index + 1);
    setHoverIndex(index);
    // console.log(score)
  }

  const star = Array.from({ length: totalStar }, (_, index) => (
    <StarFill
      key={index}
			size={size}
      style={index <= hoverIndex ? hoverStyle : defaultStyle}
      // onMouseEnter={()=>{handleMouseEnter(index)}}
      // onMouseLeave={handleMouseLeave}
      onClick={() => {
        handleClick(index);
      }}
    />
  ));

  return <div>{star}</div>;
}

export default StarSelect;
