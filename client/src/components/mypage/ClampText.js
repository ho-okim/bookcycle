function ClampText({text, maxCharacters}) {
  if (text.length > maxCharacters) {
    return text.substring(0, maxCharacters) + '...';
  }
  return text;
}

export default ClampText;