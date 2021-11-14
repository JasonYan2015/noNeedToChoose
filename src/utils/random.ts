
function rnd( seed ){
  seed = ( seed * 9301 + 49297 ) % 233280; //为何使用这三个数?
  return seed / ( 233280.0 );
};
/**
 * 根据一个数字，随机出一个数字列表
 * 要求：每个输入对应一个确定的输出
 */
 export const initRandomNumber: (number: number) => number = (number) => {
  const time = new Date()
  const date = time.getDate()
  const month = time.getMonth()
  // 用日期作为种子，每天的数据一样
  const fullDate = month * 100 + date

  const seed = ~~fullDate;
  const res = Math.ceil( rnd(seed) * number * 7 );
  return (res * 7) % 178 + 36
}