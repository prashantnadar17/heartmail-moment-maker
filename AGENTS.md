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

## Architecture decisions

- Interactive card experiences are single components registered in `src/components/experiences/registry.ts` (keyed by `templates.experience_type`). Adding a card template = new component + registry entry; pages render through the registry.
- Guest card creation stores drafts via `createDraft` server fn using the admin client (drafts table is admin-managed); recipients read drafts by unguessable `session_reference` through `getDraftByReference`. No auth required by design.
- Card photos go to the private `card-media` storage bucket; DB stores bucket-relative paths and signed URLs (24h) are minted server-side when a draft is fetched. Never make the bucket public (blocked by platform anyway).
- Prices are integer paise and render via `formatPaise` (`src/lib/format.ts`); tests live in `src/test/`.
