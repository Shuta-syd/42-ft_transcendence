const getNow = (): string => {
  const date = new Date();
  return `${date.getMonth() + 1}/${date.getDate()}
   ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
  `
};

export default getNow;
