const convertDate = (str: Date): string => {
  const date = new Date(str);
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

export default convertDate;
