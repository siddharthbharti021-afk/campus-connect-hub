<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Campus architecture
- Keep command-created wallpaper effects in a client-side overlay with a bounded local command parser; decorative commands must not execute code or access campus records.
- Place campus content and wallpaper in one bounded, user-panned scene; keep command controls and dialogs outside its transform so they remain accessible.
- Use TanStack Start for the web campus and Cloud PostgreSQL for durable records; the hosted runtime is fixed and does not support a separate Next.js/Python/mobile deployment.
- Keep university roles in a separate server-controlled roles table and enforce access with database policies; public workspace previews must never fetch private records.
- Use dnd-kit sortable service widgets for user-driven movement and Cloud Realtime for campus presence/messages; motion must follow interaction rather than idle animation.
- Use the AI SDK Responses protocol with server-only gateway helpers and AI Elements for the campus assistant; transcripts stay in session memory because persistence was declined.
- Distinguish connected campus data from pending institutional integrations; never fabricate attendance, balances, notices, students, or official policies.
