const isValidURL = (str) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocolo opcional (http ou https)
      "((([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,})|" + // domínio
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // ou endereço IP (v4)
      "(\\:\\d+)?(\\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?", // porta e caminho
    "i"
  );
  return pattern.test(str);
};

export { isValidURL };
