import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowUpRight, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Service } from '@/lib/campus';

export function ServiceCard({ service, onOpen, movable }: { service: Service; onOpen: () => void; movable: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: service.id, disabled: !movable });
  return <article ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`service-card tone-${service.tone}${isDragging ? ' dragging' : ''}`}><div className="service-card-top"><div className="service-icon"><service.icon size={23} strokeWidth={1.7} /></div>{movable ? <Button {...attributes} {...listeners} variant="ghost" size="icon-sm" className="drag-handle" aria-label={`Move ${service.name}`} title={`Move ${service.name}`}><GripVertical /></Button> : <ArrowUpRight className="service-arrow" size={18} />}</div><h3>{service.name}</h3><p>{service.description}</p><Button variant="ghost" className="service-action" onClick={onOpen}>{service.action}<ArrowRightMini /></Button></article>;
}
function ArrowRightMini() { return <ArrowUpRight size={14} />; }