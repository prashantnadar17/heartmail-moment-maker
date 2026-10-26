create policy "Anyone can upload card media"
on storage.objects for insert to anon, authenticated
with check (bucket_id = 'card-media');

create policy "Owners can replace their card media"
on storage.objects for update to anon, authenticated
using (bucket_id = 'card-media');