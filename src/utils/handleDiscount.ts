export function handleDiscount(
  price: number,
  discount: number,
  code: string,
): number {
  let res = 0
  if (code.search("K") !== -1) {
    res = price - discount * 1000
  }
  else if (code.search("MA") !== -1) {
    const maxDis =
      Number(code.slice(code.search("MA") + 2, code.length) + "000") || 10000
    const dis =
      (price * discount) / 100 > maxDis ? maxDis : (price * discount) / 100
    res = price - dis
  }
  else res = price - (price * discount) / 100
  if (res > 0) {
    return res
  } else {
    return 0
  }
}
