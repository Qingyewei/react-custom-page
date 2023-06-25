function safeEval(code: string) {
  return Function(`"use strict"; ${code}`)();
}

// 解析函数字符串值
export const evaluateString = (string: string, formData = {}, rootValue = {}) =>
  safeEval(`
  const rootValue =${JSON.stringify(rootValue)};
  const formData = ${JSON.stringify(formData)};
  return (${string})
  `);
