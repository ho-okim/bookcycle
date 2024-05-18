function dateProcessing(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date ? new Date(date).toLocaleDateString("ko-KR", options).replaceAll('.', '.') : "";
}

export function dateProcessingYT(date){
  // 데이터의 createdAt이 date 객체로 들어오는 게 아니라 string으로 들어옴에 주의
  let newDate = new Date(date)
  let year = newDate.toLocaleString("ko-kr", {dateStyle:'long'})
  let time = newDate.toLocaleString("ko-kr").slice(12, -3)

  return {year, time}
}

export function dateProcessingYear(date){
  // 데이터의 createdAt이 date 객체로 들어오는 게 아니라 string으로 들어옴에 주의
  let newDate = new Date(date)
  let year = newDate.toLocaleString("ko-kr", {dateStyle:'long'})

  return year
}

export function dateTimeProcessing(date){
  // 데이터의 createdAt이 date 객체로 들어오는 게 아니라 string으로 들어옴에 주의
  let newDate = new Date(date)
  let options = {
    weekday : "short",
    year : "numeric",
    month : "short",
    day : "numeric",
    hour : "2-digit",
    minute : "2-digit",
  }
  newDate = newDate.toLocaleString("ko-kr", options)

  return newDate
}

export default dateProcessing;