const noEmojiValidator = (value: string | number | undefined) => {
  if (value && typeof value == 'number') {
    return true;
  }
  if (value && typeof value === 'string') {
    if (
      value.match(
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi
      )
    ) {
      return false;
    } else return true;
  } else return true;
};

export default noEmojiValidator;
