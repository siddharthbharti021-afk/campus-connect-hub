import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { createCampusRequest } from '@/lib/campus.functions';
import type { Service } from '@/lib/campus';

export function ServiceDialog({ service, onClose, signedIn, onSignIn }: { service: Service | null; onClose: () => void; signedIn: boolean; onSignIn: () => void }) {
  const client = useQueryClient(); const [success, setSuccess] = useState(false);
  const mutation = useMutation({ mutationFn: createCampusRequest, onSuccess: () => { setSuccess(true); client.invalidateQueries({ queryKey: ['campus-requests'] }); toast.success('Your request has been submitted.'); }, onError: error => toast.error(error.message) });
  return <Dialog open={Boolean(service)} onOpenChange={open => { if (!open) { onClose(); setSuccess(false); } }}><DialogContent>{service && <><div className={`service-icon tone-${service.tone}`}><service.icon /></div><DialogTitle>{service.name}</DialogTitle><DialogDescription>{service.description}</DialogDescription>{success ? <div className="success-state"><CheckCircle2 /><h3>Request received</h3><p>You can follow its progress in My requests.</p><Button onClick={onClose}>Done</Button></div> : <><div className="integration-note"><ShieldCheck /><p>{['attendance', 'timetable', 'fees', 'academics'].includes(service.id) ? 'Your university’s records have not been connected yet. You can send a request to the relevant team.' : 'Submit a request to the campus team and track every update in one place.'}</p></div>{signedIn ? <form className="space-y-4" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); mutation.mutate({ data: { category: service.category, title: String(data.get('title')), description: String(data.get('description')) } }); }}><div><Label htmlFor="request-title">Request title</Label><Input id="request-title" name="title" defaultValue={service.id === 'certificates' ? 'Request a bonafide certificate' : ''} placeholder="What can we help with?" minLength={3} maxLength={160} required /></div><div><Label htmlFor="request-description">Details</Label><Textarea id="request-description" name="description" placeholder="Tell the campus team a little more…" minLength={10} maxLength={4000} required rows={4} /></div><Button type="submit" disabled={mutation.isPending} className="w-full">{mutation.isPending ? 'Submitting…' : 'Submit request'}<ArrowRight /></Button></form> : <Button onClick={onSignIn}>Sign in to access this service <ArrowRight /></Button>}</>}</>}</DialogContent></Dialog>;
}