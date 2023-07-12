export function getDataType(value: any) {
  const type = typeof value;
  if (type !== "object") {
    // 如果是基本数据类型，直接返回
    return type;
  }
  // 如果是引用数据类型，再进一步判断，正则返回结果
  return Object.prototype.toString
    .call(value)
    .replace(/^\[object (\S+)\]$/, "$1");
}

// 参考lodash库实现的set
function setObjMapValue(object: any, path: string, value: any) {
  if (!object || !path) {
    return;
  }

  const pathArray = Array.isArray(path)
    ? path
    : path
        .replace(/\[(\w+)\]/g, ".$1")
        .replace(/^\./, "")
        .split(".");
  const length = pathArray.length;
  let currentObject = object;

  for (let i = 0; i < length; i++) {
    const pathKey = pathArray[i];
    const isLastKey = i === length - 1;

    if (isLastKey) {
      currentObject[pathKey] = value;
      return;
    }

    if (
      typeof currentObject[pathKey] !== "object" ||
      currentObject[pathKey] === null
    ) {
      const nextKey = pathArray[i + 1];
      currentObject[pathKey] = /^\d+$/.test(nextKey) ? [] : {};
    }

    currentObject = currentObject[pathKey];
  }
}
