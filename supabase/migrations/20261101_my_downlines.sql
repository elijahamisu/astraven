-- Signed-in user's own team, levels 1-3 (usernames only, no contact details).
create or replace function public.get_my_downlines()
returns table(user_id uuid, level integer, username text, joined_at timestamptz, total_deposits numeric, is_active boolean)
language plpgsql stable security definer set search_path = public as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'Not signed in.'; end if;
  return query
  with recursive tree as (
    select p.id, 1 as lvl from public.profiles p where p.referred_by = v_uid
    union all
    select p.id, t.lvl + 1 from public.profiles p join tree t on p.referred_by = t.id where t.lvl < 3
  )
  select p.id, t.lvl, p.username::text, p.created_at,
         coalesce((select sum(coalesce(x.amount_paid, x.amount)) from public.deposits x
                   where x.user_id = p.id and x.status in ('approved','completed','success','paid')), 0),
         exists(select 1 from public.investments v where v.user_id = p.id and v.status = 'active'
                and coalesce((v.metadata->>'is_admin_grant')::boolean, false) = false)
  from tree t join public.profiles p on p.id = t.id
  order by t.lvl, p.created_at desc;
end;
$$;
revoke all on function public.get_my_downlines() from public, anon;
grant execute on function public.get_my_downlines() to authenticated;
