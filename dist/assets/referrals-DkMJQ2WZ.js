import{r as h,s as i}from"./supabase-client-C6YDjNCm.js";import{i as _}from"./user-navigation-CPu4N22w.js";import{a as d,f as E}from"./formatters-kkpPVsns.js";import"./site-settings-DR2l5HIv.js";import"./mobile-cards-DX-1T3ZF.js";async function x(){await _({requireSession:!0});const c=await h();if(!c)return;const s=c.user.id,{data:r}=await i.from("profiles").select("referral_code").eq("id",s).single();if(r&&r.referral_code){document.getElementById("refCodeInput").value=r.referral_code;const e=`${window.location.origin}/register.html?ref=${r.referral_code}`;document.getElementById("refLinkInput").value=e,document.getElementById("copyCodeBtn").addEventListener("click",()=>{navigator.clipboard.writeText(r.referral_code),alert("Referral code copied!")}),document.getElementById("copyLinkBtn").addEventListener("click",()=>{navigator.clipboard.writeText(e),alert("Referral link copied!")}),document.getElementById("shareLinkBtn").addEventListener("click",async()=>{navigator.share?await navigator.share({title:"ASTRAVEN Aviation Wealth",text:"Join my investment flight syndicate on ASTRAVEN.",url:e}):(navigator.clipboard.writeText(e),alert("Referral link copied to clipboard!"))})}const{data:f}=await i.from("referral_commissions").select("commission_amount").eq("referrer_id",s),v=(f||[]).reduce((e,t)=>e+Number(t.commission_amount),0);document.getElementById("statTotalComm").textContent=d(v);const{data:y}=await i.rpc("get_my_downlines"),a=y||[],n={1:0,2:0,3:0};a.forEach(e=>{n[e.level]=(n[e.level]||0)+1}),document.getElementById("statLv1").textContent=n[1],document.getElementById("statLv2").textContent=n[2],document.getElementById("statLv3").textContent=n[3],document.getElementById("statLvTotal").textContent=a.length,document.getElementById("statTotalRef").textContent=n[1];const{data:l}=await i.rpc("get_user_referral_vip_status",{p_user_id:s});l&&(document.getElementById("statActiveRef").textContent=l.active_downlines||0,document.getElementById("statTeamDep").textContent=d(l.team_deposits||0));const m=document.getElementById("teamContainer"),u=document.getElementById("levelTabs");let o="all";const b=[["all",`All (${a.length})`],[1,`LV 1 (${n[1]})`],[2,`LV 2 (${n[2]})`],[3,`LV 3 (${n[3]})`]];function g(){u.innerHTML=b.map(([e,t])=>`
          <button type="button" data-lv="${e}" style="padding: 8px 14px; border-radius: 999px; font-weight: 700; font-size: 0.8rem; cursor: pointer; border: 1px solid var(--primary-green); ${String(e)===String(o)?"background: var(--primary-green); color: #fff;":"background: transparent; color: var(--primary-green);"}">${t}</button>
        `).join("")}function p(){const e=o==="all"?a:a.filter(t=>t.level===Number(o));if(e.length===0){m.innerHTML=`<p style="text-align: center; color: var(--secondary-text); padding: 30px;">${a.length===0?"You have no registered downlines yet. Share your referral link to begin earning.":"No members on this level yet."}</p>`;return}m.innerHTML=`
          <table class="tx-table">
            <thead>
              <tr><th>Member</th><th>Level</th><th>Joined</th><th>Deposits</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${e.map(t=>`
                <tr>
                  <td style="font-weight: 600;">@${t.username||"Investor_"+t.user_id.substring(0,6)}</td>
                  <td><span class="badge-status badge-pending">LV ${t.level}</span></td>
                  <td style="color: var(--secondary-text); font-size: 0.8rem;">${E(t.joined_at,{includeTime:!1})}</td>
                  <td style="font-weight: 700;">${d(t.total_deposits||0)}</td>
                  <td><span class="badge-status ${t.is_active?"badge-completed":"badge-pending"}">${t.is_active?"Active":"Inactive"}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        `}u.addEventListener("click",e=>{const t=e.target.closest("button[data-lv]");t&&(o=t.dataset.lv==="all"?"all":Number(t.dataset.lv),g(),p())}),g(),p()}x();
