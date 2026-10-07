import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Bird, Fish, Leaf, Star, Terminal, ArrowUp, Pause, Play, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseWallpaperCommand, type ObjectKind } from '@/lib/wallpaper';

type WallpaperObject = { id: number; kind: ObjectKind; tone: string; speed: number; left: number; top: number };
const initialObjects: WallpaperObject[] = [0, 1, 2].map((id) => ({ id, kind: 'bird', tone: 'sky', speed: 16, left: 12 + id * 32, top: 14 + id * 23 }));

function ObjectArt({ kind }: { kind: ObjectKind }) {
  if (kind === 'butterfly') return <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true"><path d="M23 23C12 0 0 8 7 23c-8 13 7 19 16 4v12h2V27c9 15 24 9 16-4C48 8 36 0 25 23Z" /><path d="m24 24-4-13m4 13 4-13" fill="none" stroke="currentColor" strokeWidth="2" /></svg>;
  const Icon = { bird: Bird, fish: Fish, leaf: Leaf, star: Star }[kind];
  return <Icon size={44} strokeWidth={1.5} />;
}

export function AnimatedWallpaper() {
  const [objects, setObjects] = useState(initialObjects);
  const [text, setText] = useState('');
  const [paused, setPaused] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [dragged, setDragged] = useState<number | null>(null);
  const nextId = useRef(3);
  const bounds = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  function runCommand(event: React.FormEvent) {
    event.preventDefault();
    const command = parseWallpaperCommand(text);
    if (typeof command === 'string') { setFeedback(command); return; }
    if (command.action === 'create') {
      if (objects.length + command.count > 24) { setFeedback('The wallpaper is full. Clear some objects first.'); return; }
      const created = Array.from({ length: command.count }, () => ({ id: nextId.current++, kind: command.kind, tone: command.tone, speed: command.speed, left: 6 + Math.random() * 83, top: 8 + Math.random() * 72 }));
      setObjects((current) => [...current, ...created]);
      setFeedback(`Added ${command.count} ${command.kind === 'butterfly' ? 'butterflies' : command.kind === 'leaf' ? 'leaves' : command.kind === 'fish' ? 'fish' : `${command.kind}${command.count === 1 ? '' : 's'}`}.`);
    } else if (command.action === 'clear') { setObjects([]); setFeedback('Wallpaper cleared.'); }
    else { setPaused(command.action === 'pause'); setFeedback(command.action === 'pause' ? 'Motion paused.' : 'Motion resumed.'); }
    setText('');
  }

  return <>
    <div ref={bounds} className="wallpaper-layer" aria-label="Animated wallpaper">
      {objects.map((object) => <motion.div key={object.id} drag dragConstraints={bounds} dragMomentum={false} onDragStart={() => setDragged(object.id)} onDragEnd={() => setDragged(null)} className={`wallpaper-object tone-${object.tone}`} style={{ left: `${object.left}%`, top: `${object.top}%` }} role="img" aria-label={`Movable ${object.kind}`}>
        <motion.div animate={paused || reducedMotion || dragged === object.id ? { x: 0, y: 0, rotate: 0 } : { x: [0, 35, -12, 0], y: [0, -20, 14, 0], rotate: [0, 8, -5, 0] }} transition={{ duration: object.speed, repeat: paused || reducedMotion ? 0 : Infinity, ease: 'easeInOut' }}><ObjectArt kind={object.kind} /></motion.div>
      </motion.div>)}
    </div>
    <div className={`wallpaper-console${collapsed ? ' is-collapsed' : ''}`}>
      {collapsed ? <Button size="icon" variant="outline" aria-label="Open wallpaper commands" title="Wallpaper commands" onClick={() => setCollapsed(false)}><Terminal /></Button> : <>
        <form onSubmit={runCommand} className="wallpaper-command-row">
          <Terminal size={18} className="text-muted-foreground shrink-0" aria-hidden="true" />
          <Input aria-label="Wallpaper command" placeholder="Add 5 blue birds…" value={text} onChange={(event) => setText(event.target.value)} maxLength={160} />
          <Button type="submit" size="icon" disabled={!text.trim()} aria-label="Run wallpaper command" title="Run command"><ArrowUp /></Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => setPaused((value) => !value)} aria-label={paused ? 'Resume wallpaper' : 'Pause wallpaper'} title={paused ? 'Resume' : 'Pause'}>{paused ? <Play /> : <Pause />}</Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => { setObjects([]); setFeedback('Wallpaper cleared.'); }} aria-label="Clear wallpaper" title="Clear wallpaper"><Trash2 /></Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => setCollapsed(true)} aria-label="Minimize wallpaper commands" title="Minimize"><X /></Button>
        </form>
        {feedback && <p className="wallpaper-feedback" role="status">{feedback}</p>}
      </>}
    </div>
  </>;
}