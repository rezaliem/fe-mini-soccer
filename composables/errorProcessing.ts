export default (e) => {
  if (e.data) {
    if (e.data.description) return e.data.description;
    return e.data;
  }
  return e;
};
