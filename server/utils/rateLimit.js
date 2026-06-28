const attempts = new Map();
const RATE_WINDOW = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const CLEANUP_INTERVAL = 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (now - entry.start > RATE_WINDOW) attempts.delete(key);
  }
}, CLEANUP_INTERVAL);

export const checkLoginAttempts = (email) => {
  const now = Date.now();
  const key = email.toLowerCase();
  const entry = attempts.get(key);
  if (entry) {
    if (now - entry.start > RATE_WINDOW) {
      attempts.delete(key);
      return { allowed: true, remaining: MAX_ATTEMPTS };
    }
    if (entry.count >= MAX_ATTEMPTS) {
      const retryAfter = Math.ceil((RATE_WINDOW - (now - entry.start)) / 1000);
      return { allowed: false, retryAfter };
    }
    return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
  }
  return { allowed: true, remaining: MAX_ATTEMPTS };
};

export const recordFailedAttempt = (email) => {
  const key = email.toLowerCase();
  const now = Date.now();
  const entry = attempts.get(key);
  if (entry) {
    if (now - entry.start > RATE_WINDOW) {
      attempts.set(key, { count: 1, start: now });
    } else {
      entry.count++;
    }
  } else {
    attempts.set(key, { count: 1, start: now });
  }
};

export const clearAttempts = (email) => {
  attempts.delete(email.toLowerCase());
};
