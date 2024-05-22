import { dateProcessingYT, dateProcessingYear } from "./dateProcessing";

function timeCalculator(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;

    if (diffInSeconds < secondsInMinute) {
        return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < secondsInHour) {
        const minutes = Math.floor(diffInSeconds / secondsInMinute);
        return `${minutes}분 전`;
    } else if (diffInSeconds < secondsInDay) {
        const hours = Math.floor(diffInSeconds / secondsInHour);
        return `${hours}시간 전`;
    } else {
        const days = Math.floor(diffInSeconds / secondsInDay);
        return `${days}일 전`;
    }
}

// 채팅방에서 사용할 timeCaculator
export function chatTimeCalculator(date) {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  const time = dateProcessingYT(date)?.time
  const year = date ? dateProcessingYear(date) : null

  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;

  if (diffInSeconds < secondsInDay) {
      return time;
  } else {
      return year;
  }
}

// date 값의 타입이 string일 때로 간주
export function isSameDate(date, prevDate){
  if(!date || !prevDate){

    // date나 prevDate 중 하나라도 undefined면 false return
    return false;

  } else {
    // string으로 들어온 데이터 Date 형식으로 변환
    const newDate = new Date(date);
    const newPrevDate = new Date(prevDate);

    const day = newDate.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
    const prevDay = newPrevDate.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})

    if(day == prevDay){
      return true;
    }

    return false;
  }
}

export default timeCalculator;