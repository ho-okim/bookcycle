function dateProcessing(date) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date ? new Date(date).toLocaleDateString("ko-KR", options).replaceAll('.', '.') : "";
}

export default dateProcessing;