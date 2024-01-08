export const isSpecialCharacter = (text: string) => {
  const specialCharsRegex = /[!@#$%^&*`~()_+\-—=\[\]{};':"\\|,.<>\/?]/;

  if (specialCharsRegex.test(text)) {
    return true;
  }

  return false;
};
