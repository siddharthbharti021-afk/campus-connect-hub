import { describe, expect, it } from 'vitest';
import { parseWallpaperCommand } from '../lib/wallpaper';

describe('wallpaper commands', () => {
  it('creates named objects with color, count and speed', () => {
    expect(parseWallpaperCommand('Add 5 blue birds slowly')).toMatchObject({ action: 'create', kind: 'bird', count: 5, tone: 'sky' });
    expect(parseWallpaperCommand('create 2 slow pink butterflies')).toEqual({ action: 'create', kind: 'butterfly', count: 2, tone: 'rose', speed: 18 });
    expect(parseWallpaperCommand('3 green leaves')).toMatchObject({ kind: 'leaf', count: 3, tone: 'mint' });
  });
  it('handles motion and clearing commands', () => {
    expect(parseWallpaperCommand('pause')).toEqual({ action: 'pause' });
    expect(parseWallpaperCommand('resume')).toEqual({ action: 'resume' });
    expect(parseWallpaperCommand('clear')).toEqual({ action: 'clear' });
  });
  it('rejects unsupported and excessive input', () => {
    expect(typeof parseWallpaperCommand('run arbitrary code')).toBe('string');
    expect(typeof parseWallpaperCommand('99 fish')).toBe('string');
    expect(typeof parseWallpaperCommand('0 stars')).toBe('string');
  });
});