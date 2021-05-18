export const storage = Object.freeze({
  prefix: 'livetag.',
  store: sessionStorage,
  get(key, defaultValue) {
    try {
      return JSON.parse(this.store.getItem(`${this.prefix}${key}`)) || defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  set(key, value) {
    this.store.setItem(`${this.prefix}${key}`, JSON.stringify(value));
  },
  clear(key) {
    this.store.removeItem(`${this.prefix}${key}`);
  },
});
