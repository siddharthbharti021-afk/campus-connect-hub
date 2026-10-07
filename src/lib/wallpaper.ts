export const objectKinds = ['bird', 'butterfly', 'leaf', 'star', 'fish'] as const;
export type ObjectKind = typeof objectKinds[number];
export type WallpaperCommand = { action: 'create'; kind: ObjectKind; count: number; tone: string; speed: number } | { action: 'clear' | 'pause' | 'resume' };

export function parseWallpaperCommand(input: string): WallpaperCommand | string {
  const text = input.trim().toLowerCase();
  if (/^(clear|remove all|reset)$/.test(text)) return { action: 'clear' };
  if (/^(pause|stop)$/.test(text)) return { action: 'pause' };
  if (/^(resume|play)$/.test(text)) return { action: 'resume' };
  const names: Record<ObjectKind, RegExp> = { bird: /\bbirds?\b/, butterfly: /\bbutterfl(?:y|ies)\b/, leaf: /\b(?:leaf|leaves)\b/, star: /\bstars?\b/, fish: /\bfish(?:es)?\b/ };
  const kind = objectKinds.find((name) => names[name].test(text));
  if (!kind) return 'Choose birds, butterflies, leaves, stars or fish.';
  const amount = text.match(/\b\d+\b/);
  const count = amount ? Number(amount[0]) : 3;
  if (count < 1 || count > 12) return 'Choose between 1 and 12 objects.';
  const tones = { mint: /\b(?:mint|green)\b/, lavender: /\b(?:lavender|purple)\b/, peach: /\b(?:peach|orange)\b/, sky: /\b(?:sky|blue)\b/, rose: /\b(?:rose|pink|red)\b/, yellow: /\b(?:yellow|gold)\b/ };
  const tone = Object.entries(tones).find(([, pattern]) => pattern.test(text))?.[0] ?? ({ bird: 'sky', butterfly: 'rose', leaf: 'mint', star: 'yellow', fish: 'peach' }[kind]);
  return { action: 'create', kind, count, tone, speed: /\b(?:fast|quick)\b/.test(text) ? 5 : /\b(?:slow|gentle)\b/.test(text) ? 18 : 10 };
}