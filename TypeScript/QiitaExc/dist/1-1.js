"use strict";
function isPositive1(num) {
    return num >= 0;
}
// 使用例
isPositive1(3);
// エラー例
// isPositive("123");
// const numVar: number = isPositive(-5);
// 返り値の型（boolean）は型推論が働くので明記しなくてもOK
