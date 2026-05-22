// Silence standard Metro Web & Native warnings to keep terminal console clean
if (__DEV__) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const msg = args.join(' ');
    if (
      msg.includes('shadow* style props') ||
      msg.includes('pointerEvents is deprecated') ||
      msg.includes('expo-notifications')
    ) {
      return;
    }
    originalWarn(...args);
  };

  const originalError = console.error;
  console.error = (...args) => {
    const msg = args.join(' ');
    if (msg.includes('expo-notifications') || msg.includes('remote notifications')) {
      return;
    }
    originalError(...args);
  };
}
