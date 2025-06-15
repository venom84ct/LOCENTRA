import leoProfanity from 'leo-profanity';

export function containsProfanity(text: string): boolean {
  return leoProfanity.check(text);
}

export function sanitize(text: string): string {
  return leoProfanity.clean(text);
}
