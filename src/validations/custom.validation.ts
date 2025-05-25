import { CustomHelpers } from 'joi';

export const password = (value: string, helpers: CustomHelpers) => {
  if (value.length < 8) {
    return helpers.message({ custom: '密码必须至少包含8个字符' });
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message({
      custom: '密码必须包含至少1个字母和1个数字',
    });
  }
  return value;
};
