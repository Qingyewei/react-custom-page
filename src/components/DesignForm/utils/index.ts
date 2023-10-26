import _ from "lodash";

function safeEval(code: string) {
  return Function(`"use strict"; ${code}`)();
}

// 解析函数字符串值
// evaluateString('formData.a===rootValue.b',{a:2},{b:2})
export const evaluateString = (string: string, formData = {}, rootValue = {}) =>
  safeEval(`
  const rootValue =${JSON.stringify(rootValue)};
  const formData = ${JSON.stringify(formData)};
  return (${string})
  `);

export const parseExpression = (
  func: any,
  formData = {},
  parentPath: string
) => {
  const parentData = _.get(formData, parentPath) || {};

  if (typeof func === "string") {
    const funcBody = func.replace(/^{\s*{/g, "").replace(/}\s*}$/g, "");

    const funcStr = `
        return ${funcBody
          .replace(/formData/g, JSON.stringify(formData))
          .replace(/rootValue/g, JSON.stringify(parentData))}
      `;

    try {
      const result = Function(funcStr)();
      return result;
    } catch (error) {
      console.log(error, parentPath);
      return null; // 如果计算有错误，return null 最合适
    }
  }

  return func;
};
