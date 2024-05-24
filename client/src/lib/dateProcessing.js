// 데이터의 createdAt이 date 객체로 들어오는 게 아니라 string으로 들어옴에 주의

// 출력 형식 : 2024. 5. 9.
function dateProcessing(date) { 
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date ? new Date(date).toLocaleDateString("ko-KR", options).replaceAll('.', '.') : "";
}

// 출력 형식 : 2024-05-09
export function dateProcessingDash(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  let formattedDate = new Date(date).toLocaleDateString("ko-KR", options).replace(/\./g, '-').replace(/ /g, '');

  if (formattedDate.endsWith('-')) { // 맨 마지막 '-'를 제거
    formattedDate = formattedDate.slice(0, -1);
  }
  return date ? formattedDate : "";
}

// 출력 형식 : 2024-05-09 16:47
export function dateTimeProcessingDash(date) {
  const options = { 
    year: 'numeric', month: '2-digit', day: '2-digit', 
    hour : "2-digit", minute : "2-digit", hour12: false
  };
  let formattedDate = new Date(date).toLocaleDateString("ko-KR", options).replace(/\./g, '-').replace(/ /g, '');

  if (formattedDate.endsWith('-')) { // 맨 마지막 '-'를 제거
    formattedDate = formattedDate.slice(0, -1);
  }
  // 일과 시간 사이의 '-'를 제거
  formattedDate = formattedDate.replace(/-(\d{2}:\d{2})$/, ' $1');

  return date ? formattedDate : "";
}

// 출력 형식(객체) : {year : '2024년 5월 21일', time: '14:03'}
export function dateProcessingYT(date){
  let newDate = new Date(date)
  let year = newDate.toLocaleString("ko-kr", {dateStyle:'long'})
  let time = newDate.toLocaleString("ko-kr").slice(12, -3)

  return {year, time}
}

// 출력 형식 : 2024년 5월 21일
export function dateProcessingYear(date){
  let newDate = new Date(date)
  let year = newDate.toLocaleString("ko-kr", {dateStyle:'long'})

  return year
}

// 출력 형식 : 2024년 5월 21일 (화) 14:03
export function dateTimeProcessing(date){ 
  let newDate = new Date(date);
  let options = {
    weekday : "short", year : "numeric", month : "short", day : "numeric",
    hour : "2-digit", minute : "2-digit", hour12: false
  }
  newDate = newDate.toLocaleString("ko-kr", options);

  return newDate;
}

export default dateProcessing;