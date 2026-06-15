function round2(value: number | string) {
  const number = +value;
  return number ? Math.round((number + Number.EPSILON) * 100) / 100 : 0;
}

export { round2 };
