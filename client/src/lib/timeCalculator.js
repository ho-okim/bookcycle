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

export default timeCalculator;