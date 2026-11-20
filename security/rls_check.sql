-- 1단계: 지금 정책 확인 (읽기만 함 · Supabase SQL Editor에서 실행)
select tablename, rowsecurity from pg_tables where schemaname='public';
select tablename, policyname, cmd, roles, qual, with_check
  from pg_policies where schemaname='public' order by tablename, cmd;

-- 2단계: 아래는 권장 정책 예시. 1단계 결과와 비교해서 빠진 것만 적용할 것.
-- (이미 같은 이름 정책이 있으면 오류가 나므로 drop policy 후 실행)

-- homes: 누구나 읽기 · 자기 것만 쓰기/고치기/지우기
alter table public.homes enable row level security;
create policy homes_read   on public.homes for select using (true);
create policy homes_insert on public.homes for insert with check (id = auth.uid());
create policy homes_update on public.homes for update using (id = auth.uid()) with check (id = auth.uid());
create policy homes_delete on public.homes for delete using (id = auth.uid());

-- notes: 누구나 읽기 · 보낸 사람 위조 금지 · 자기가 보낸 것만 삭제
alter table public.notes enable row level security;
create policy notes_read   on public.notes for select using (true);
create policy notes_insert on public.notes for insert with check (from_id = auth.uid() and char_length(text) <= 100);
create policy notes_delete on public.notes for delete using (from_id = auth.uid());

-- requests(연락처 들어있음): 넣기만 가능 · 익명 사용자는 읽기 불가
alter table public.requests enable row level security;
create policy requests_insert on public.requests for insert with check (uid = auth.uid());
-- select 정책은 만들지 않음 → 운영자는 대시보드(service role)로만 열람

-- 보유기간 자동 파기 (처리방침 1번과 맞춤) · pg_cron 확장 필요
-- select cron.schedule('notes-1y', '0 4 * * *', $$delete from public.notes where at < now() - interval '1 year'$$);
