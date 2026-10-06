import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

export const getCampusAccount = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const profile = await context.supabase.from('profiles').select('*').eq('id', context.userId).maybeSingle();
  if (profile.error) throw new Error(profile.error.message);
  if (!profile.data) {
    const created = await context.supabase.from('profiles').insert({ id: context.userId, full_name: String(context.claims.user_metadata?.['full_name'] ?? '') }).select().single();
    if (created.error) throw new Error(created.error.message);
    profile.data = created.data;
  }
  const roles = await context.supabase.from('user_roles').select('role').eq('user_id', context.userId);
  if (roles.error) throw new Error(roles.error.message);
  return { profile: profile.data, roles: roles.data.map(row => row.role) };
});
export const getCampusRequests = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data, error } = await context.supabase.from('service_requests').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
});
export const createCampusRequest = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ category: z.string().min(1).max(80), title: z.string().min(3).max(160), description: z.string().min(10).max(4000) }).parse(data))
  .handler(async ({ context, data }) => {
    const result = await context.supabase.from('service_requests').insert({ ...data, user_id: context.userId }).select().single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });
export const updateCampusRequest = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid(), status: z.enum(['in_review', 'approved', 'resolved']) }).parse(data))
  .handler(async ({ context, data }) => {
    const role = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (role.error || !role.data) throw new Error('Administrator access required.');
    const result = await context.supabase.from('service_requests').update({ status: data.status, updated_at: new Date().toISOString() }).eq('id', data.id).select().single();
    if (result.error) throw new Error(result.error.message);
    return result.data;
  });
export const getAuditEvents = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const role = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
  if (role.error || !role.data) throw new Error('Administrator access required.');
  const { data, error } = await context.supabase.from('audit_events').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) throw new Error(error.message);
  return data;
});