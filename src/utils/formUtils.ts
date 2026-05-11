
/**
 * Prevents non-numeric input for phone/mobile fields.
 * Usage: onKeyDown={handlePhoneKeyDown}
 */
export const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  // Allow: Backspace, Tab, Enter, Escape, Delete
  if (["Backspace", "Tab", "Enter", "Escape", "Delete"].includes(e.key)) {
    return;
  }
  // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
  if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) {
    return;
  }
  // Allow: home, end, left, right, up, down
  if (["Home", "End", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    return;
  }
  // Prevent if not a number
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
};

/**
 * Sanitizes pasted content to keep only digits.
 * Usage: onPaste={handlePhonePaste}
 */
export const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  const pasteData = e.clipboardData.getData("text");
  if (/[^\d]/.test(pasteData)) {
    e.preventDefault();
    const sanitized = pasteData.replace(/[^\d]/g, "");
    // Manually insert sanitized text at cursor position if needed, 
    // but usually preventing and letting user know is better, 
    // or we can just filter it in the onChange.
    // For simplicity, we'll just let onChange handle the final sanitization too.
  }
};

/**
 * Ensures the value contains only digits.
 * Usage: onChange={(e) => setVal(sanitizePhone(e.target.value))}
 */
export const sanitizePhone = (value: string) => {
  return value.replace(/[^\d]/g, "");
};

/**
 * Validates email format.
 */
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone format (e.g., minimum 7 digits).
 */
export const isValidPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
};
