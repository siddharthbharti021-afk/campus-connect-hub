import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { DndContext, PointerSensor, KeyboardSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { LogOut, Move, Plus, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { AuthDialog } from "@/components/campus/auth-dialog";
import { ServiceCard } from "@/components/campus/service-card";
import { ServiceDialog } from "@/components/campus/service-dialog";
import { campusHead, services, type Service } from "@/lib/campus";
import { getCampusAccount, getCampusRequests } from "@/lib/campus.functions";
import heroImg from "@/assets/campus-commons.jpg";

export const Route = createFileRoute("/")({
  head: () => campusHead("Your digital campus", "Attendance, timetable, fees, certificates, hostel, transport and help — one secure, movable campus space."),
  component: CampusHome,
});

type Msg = { id: string; body: string; display_name: string; user_id: string; created_at: string };
const statusLabel: Record<string, string> = { submitted: "Submitted", in_review: "In review", approved: "Approved", resolved: "Resolved" };

function CampusHome() {
  const [userId, setUserId] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [active, setActive] = useState<Service | null>(null);
  const [order, setOrder] = useState(services.map((s) => s.id));
  const [arranging, setArranging] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUserId(session?.user.id ?? null));
    const saved = localStorage.getItem("campus-order");
    if (saved) try { setOrder(JSON.parse(saved)); } catch { /* ignore */ }
    return () => data.subscription.unsubscribe();
  }, []);

  const fetchAccount = useServerFn(getCampusAccount);
  const fetchRequests = useServerFn(getCampusRequests);
  const account = useQuery({ queryKey: ["campus-account", userId], queryFn: () => fetchAccount(), enabled: Boolean(userId) });
  const requests = useQuery({ queryKey: ["campus-requests", userId], queryFn: () => fetchRequests(), enabled: Boolean(userId) });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const onDragEnd = ({ active: a, over }: DragEndEvent) => {
    if (!over || a.id === over.id) return;
    setOrder((prev) => {
      const next = arrayMove(prev, prev.indexOf(String(a.id)), prev.indexOf(String(over.id)));
      localStorage.setItem("campus-order", JSON.stringify(next));
      return next;
    });
  };
  const ordered = order.map((id) => services.find((s) => s.id === id)).filter((s): s is Service => Boolean(s));
  const name = account.data?.profile?.full_name || "there";

  return (
    <div className="campus">
      <header className="campus-nav">
        <div className="brand"><span className="brand-dot" />Campusly</div>
        {userId ? (
          <div className="flex items-center gap-2">
            {account.data?.roles.map((r) => <span key={r} className="role-chip">{r}</span>)}
            <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}><LogOut /> Sign out</Button>
          </div>
        ) : <Button onClick={() => setAuthOpen(true)}>Sign in</Button>}
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">Smart University Digital Campus</p>
          <h1>{userId ? `Hey ${name}, your campus is here.` : "One campus. Every service. Your way."}</h1>
          <p className="lede">Rearrange your space, talk to people around campus, and get help without the queues.</p>
        </div>
        <img src={heroImg} alt="Students gathering in a bright campus commons" width={1536} height={768} />
      </section>

      <main className="campus-grid">
        <section className="services-zone">
          <div className="zone-head">
            <h2>Your services</h2>
            <Button variant={arranging ? "default" : "outline"} size="sm" onClick={() => setArranging((v) => !v)}><Move /> {arranging ? "Done arranging" : "Arrange"}</Button>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={order} strategy={rectSortingStrategy}>
              <div className="service-grid">
                {ordered.map((s) => <ServiceCard key={s.id} service={s} movable={arranging} onOpen={() => setActive(s)} />)}
              </div>
            </SortableContext>
          </DndContext>

          <div className="zone-head mt-8"><h2>My requests</h2></div>
          {!userId ? <p className="muted">Sign in to see and track your requests.</p>
            : requests.isLoading ? <p className="muted">Loading…</p>
            : !requests.data?.length ? <p className="muted">No requests yet. Open a service to start one.</p>
            : <ul className="request-list">{requests.data.map((r) => (
                <li key={r.id}><div><strong>{r.title}</strong><span>{r.category} · {new Date(r.created_at).toLocaleDateString()}</span></div><span className={`status status-${r.status}`}>{statusLabel[r.status] ?? r.status}</span></li>
              ))}</ul>}
        </section>

        <aside className="side-zone">
          <CampusChat userId={userId} name={name} onSignIn={() => setAuthOpen(true)} />
          <Assistant />
        </aside>
      </main>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <ServiceDialog service={active} onClose={() => setActive(null)} signedIn={Boolean(userId)} onSignIn={() => { setActive(null); setAuthOpen(true); }} />
    </div>
  );
}

function CampusChat({ userId, name, onSignIn }: { userId: string | null; name: string; onSignIn: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [online, setOnline] = useState(0);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) { setMsgs([]); return; }
    supabase.from("campus_messages").select("id, body, display_name, user_id, created_at").order("created_at", { ascending: false }).limit(40)
      .then(({ data }) => setMsgs((data ?? []).reverse()));
    const ch = supabase.channel("campus-commons", { config: { presence: { key: userId } } })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "campus_messages" }, (p) => setMsgs((m) => [...m.slice(-60), p.new as Msg]))
      .on("presence", { event: "sync" }, () => setOnline(Object.keys(ch.presenceState()).length))
      .subscribe((s) => { if (s === "SUBSCRIBED") ch.track({ name }); });
    return () => { supabase.removeChannel(ch); };
  }, [userId, name]);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [msgs]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || !userId) return;
    setText("");
    await supabase.from("campus_messages").insert({ body, user_id: userId, display_name: name === "there" ? "Student" : name, zone: "commons" });
  };

  return (
    <div className="panel tone-panel-sky">
      <div className="zone-head"><h2>Campus commons</h2>{userId && <span className="online"><span className="pulse" />{online} here now</span>}</div>
      {!userId ? <><p className="muted">Sign in to see who's around and join the conversation.</p><Button className="mt-3" onClick={onSignIn}>Join the commons</Button></> : <>
        <div ref={listRef} className="chat-list">
          {msgs.length === 0 && <p className="muted">It's quiet — say hello first.</p>}
          {msgs.map((m) => (
            <div key={m.id} className={`bubble${m.user_id === userId ? " mine" : ""}`}>
              <span className="who">{m.display_name}</span>{m.body}
            </div>
          ))}
        </div>
        <form onSubmit={send} className="flex gap-2 mt-3"><Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Say something to campus…" maxLength={500} /><Button type="submit" size="icon" aria-label="Send"><Send /></Button></form>
      </>}
    </div>
  );
}

function Assistant() {
  const [chatKey, setChatKey] = useState(0);
  return <AssistantChat key={chatKey} onNew={() => setChatKey((k) => k + 1)} />;
}

function AssistantChat({ onNew }: { onNew: () => void }) {
  const { messages, sendMessage, status } = useChat({ transport: new DefaultChatTransport({ api: "/api/assistant" }) });
  const [text, setText] = useState("");
  const busy = status === "submitted" || status === "streaming";
  return (
    <div className="panel tone-panel-lavender">
      <div className="zone-head"><h2><Sparkles className="inline size-5" /> Campus assistant</h2><Button variant="ghost" size="sm" onClick={onNew}><Plus /> New chat</Button></div>
      <div className="chat-list">
        {messages.length === 0 && <p className="muted">Ask in any language — "How do I get a bonafide certificate?"</p>}
        {messages.map((m) => (
          <div key={m.id} className={`bubble${m.role === "user" ? " mine" : ""}`}>
            {m.parts.map((p, i) => (p.type === "text" ? <span key={i} className="whitespace-pre-wrap">{p.text}</span> : null))}
          </div>
        ))}
        {status === "submitted" && <div className="bubble muted">Thinking…</div>}
      </div>
      <form className="flex gap-2 mt-3" onSubmit={(e) => { e.preventDefault(); if (!text.trim() || busy) return; sendMessage({ text }); setText(""); }}>
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask the assistant…" />
        <Button type="submit" size="icon" disabled={busy} aria-label="Ask"><Send /></Button>
      </form>
      <p className="tiny">Conversations aren't saved. University records aren't connected yet.</p>
    </div>
  );
}
