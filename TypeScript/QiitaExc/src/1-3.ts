type IsPositiveFunc = (num: number) => boolean;

const isPositive3: IsPositiveFunc = (num) => num >= 0;

// 使用例
isPositive3(5);

// エラー例
// isPositive3("foo");
// const res: number = isPositive3(123);
