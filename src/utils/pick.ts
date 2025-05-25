/**
 * 从对象中选择指定的属性
 * @param {Object} object - 源对象
 * @param {string[]} keys - 需要选择的属性键名
 * @returns {Object} - 选择后的对象
 */
const pick = (object: Record<string, any>, keys: string[]) => {
  return keys.reduce((obj: Record<string, any>, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export default pick;
