export function generateShortcode(existingShortcodes: string[]) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortcode = '';
  do {
    shortcode = Array.from({ length: 6 }, () =>
      charset.charAt(Math.floor(Math.random() * charset.length))
    ).join('');
  } while (existingShortcodes.includes(shortcode));
  return shortcode;
}
