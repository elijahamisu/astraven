-- Admin removes a user's investment (package). Stops future income.
-- Income already paid stays in the user's wallet and transaction history.
create or replace function public.admin_delete_investment(p_investment_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_inv public.investments%rowtype;
  v_had_reservation boolean;
begin
  if not public.is_admin() then
    raise exception 'Access denied: Admin role required.';
  end if;

  select * into v_inv from public.investments where id = p_investment_id for update;
  if not found then
    return jsonb_build_object('success', false, 'message', 'Investment not found.');
  end if;

  select exists(select 1 from public.product_capacity_reservations where investment_id = v_inv.id) into v_had_reservation;

  delete from public.investment_payouts where investment_id = v_inv.id;
  delete from public.investments where id = v_inv.id;

  if v_had_reservation then
    update public.products set current_capacity = greatest(current_capacity - 1, 0), updated_at = now()
     where id = v_inv.product_id;
  end if;

  insert into public.audit_logs (admin_id, action, details)
  values (auth.uid(), 'investment_deleted', jsonb_build_object(
    'investment_id', v_inv.id, 'user_id', v_inv.user_id, 'product_id', v_inv.product_id,
    'product_name', v_inv.product_name, 'purchase_price', v_inv.purchase_price,
    'status', v_inv.status, 'total_paid_out', v_inv.total_paid_out));

  return jsonb_build_object('success', true);
end;
$$;
revoke all on function public.admin_delete_investment(uuid) from public, anon;
grant execute on function public.admin_delete_investment(uuid) to authenticated;
