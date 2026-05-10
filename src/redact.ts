const SECRET_PATTERNS: Array<[RegExp, string]> = [
  [/\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}\b/g, "[REDACTED_GITHUB_TOKEN]"],
  [/\bsk-[A-Za-z0-9_-]{20,}\b/g, "[REDACTED_OPENAI_KEY]"],
  [/\bAKIA[0-9A-Z]{16}\b/g, "[REDACTED_AWS_ACCESS_KEY]"],
  [/\b[A-Za-z0-9+/]{32,}={0,2}\b/g, "[REDACTED_LONG_TOKEN]"],
  [/(\b(?:token|api[_-]?key|secret|password|passwd|authorization)\b\s*[:=]\s*)[^\s'\"]+/gi, "$1[REDACTED]"]
];

export function redactText(value: string, enabled = true): string {
  if (!enabled || value.length === 0) {
    return value;
  }

  return SECRET_PATTERNS.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), value);
}
