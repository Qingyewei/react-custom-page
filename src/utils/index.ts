export function getDataType(value:any) {
    const type = typeof value;
    if (type !== 'object') { // 如果是基本数据类型，直接返回
        return type;
    }
    // 如果是引用数据类型，再进一步判断，正则返回结果
    return Object.prototype.toString.call(value).replace(/^\[object (\S+)\]$/, '$1');
}
