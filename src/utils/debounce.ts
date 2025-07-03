export default function debounce<
  // Ah yes, covariance/contravariance, the eternal struggle
  Fn extends (...args: never[]) => void,
>(func: Fn, delay: number) {
  let timeoutId: number | undefined;

  function clear() {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }

  function debounced(...args: Parameters<Fn>) {
    clear();
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = undefined;
    }, delay);
  }

  debounced.clear = clear;

  return debounced;
}
