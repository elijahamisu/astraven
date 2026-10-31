import{s as l}from"../supabase-client-C6YDjNCm.js";import{i as E}from"../admin-navigation-COK15cyH.js";import{a as o,f as x}from"../formatters-kkpPVsns.js";import"../mobile-cards-DX-1T3ZF.js";let m=null,d=null;async function h(){var c;const s=await E();if(!s)return;m=s.session,d=new URLSearchParams(window.location.search).get("id");const n=document.getElementById("userDossierContainer");if(!d){n.innerHTML='<p style="color: var(--error-red);">No user ID provided.</p>';return}const{data:e}=await l.from("profiles").select("*").eq("id",d).single(),{data:a}=await l.from("wallets").select("*").eq("user_id",d).single(),{data:r}=await l.from("user_roles").select("role").eq("user_id",d).maybeSingle();if(!e){n.innerHTML='<p style="color: var(--error-red);">Account not found.</p>';return}n.innerHTML=`
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ECECEC; padding-bottom: 14px; margin-bottom: 18px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h2 style="font-size: 1.4rem; color: var(--deep-forest);">@${e.username}</h2>
            <span style="font-size: 0.8rem; color: var(--secondary-text); font-family: monospace;">UUID: ${e.id}</span>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="suspendToggleBtn" class="${e.is_suspended?"btn-gold":"btn-emerald"}" style="padding: 8px 16px; font-size: 0.82rem;">
              ${e.is_suspended?"Reactivate Account":"Suspend Account"}
            </button>
          </div>
        </div>

        <div class="dossier-grid">
          <div class="dossier-cell">
            <span style="font-size: 0.72rem; color: var(--secondary-text); text-transform: uppercase;">FULL NAME</span>
            <div style="font-weight: 700; color: var(--deep-forest); font-size: 1rem;">${e.full_name||"—"}</div>
          </div>
          <div class="dossier-cell">
            <span style="font-size: 0.72rem; color: var(--secondary-text); text-transform: uppercase;">PHONE</span>
            <div style="font-weight: 700; color: var(--deep-forest);">${e.phone||"—"}</div>
          </div>
          <div class="dossier-cell">
            <span style="font-size: 0.72rem; color: var(--secondary-text); text-transform: uppercase;">AFFILIATE CODE</span>
            <div style="font-weight: 700; color: var(--metallic-gold); font-family: monospace;">${e.referral_code}</div>
          </div>
          <div class="dossier-cell">
            <span style="font-size: 0.72rem; color: var(--secondary-text); text-transform: uppercase;">SYSTEM ROLE</span>
            <div style="font-weight: 700; color: var(--primary-green);">${((c=r==null?void 0:r.role)==null?void 0:c.toUpperCase())||"USER"}</div>
          </div>
          <div class="dossier-cell">
            <span style="font-size: 0.72rem; color: var(--secondary-text); text-transform: uppercase;">AVAILABLE WALLET</span>
            <div style="font-weight: 700; color: var(--primary-green); font-size: 1.2rem;">${o((a==null?void 0:a.balance)||0)}</div>
          </div>
          <div class="dossier-cell">
            <span style="font-size: 0.72rem; color: var(--secondary-text); text-transform: uppercase;">RESERVED FUNDS</span>
            <div style="font-weight: 700;">${o((a==null?void 0:a.reserved_balance)||0)}</div>
          </div>
          <div class="dossier-cell">
            <span style="font-size: 0.72rem; color: var(--secondary-text); text-transform: uppercase;">TOTAL DEPOSITED</span>
            <div style="font-weight: 700;">${o((a==null?void 0:a.total_deposited)||0)}</div>
          </div>
          <div class="dossier-cell">
            <span style="font-size: 0.72rem; color: var(--secondary-text); text-transform: uppercase;">TOTAL WITHDRAWN</span>
            <div style="font-weight: 700;">${o((a==null?void 0:a.total_withdrawn)||0)}</div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="/admin/wallet-adjustments.html?userId=${e.id}" class="btn-emerald" style="padding: 10px 18px; font-size: 0.85rem; text-decoration: none;">Adjust Wallet</a>
          <button id="triggerGrantModalBtn" class="btn-gold" style="padding: 10px 18px; font-size: 0.85rem;">Grant Flight Package</button>
        </div>
      `,document.getElementById("suspendToggleBtn").addEventListener("click",async()=>{const v=prompt("State administrative reason:");if(!v)return;const{data:p,error:b}=await l.rpc("admin_toggle_user_suspension",{p_admin_id:m.user.id,p_user_id:d,p_suspend:!e.is_suspended,p_reason:v});b||!p.success?alert((p==null?void 0:p.error)||"Failed"):(alert("Account status updated."),h())}),document.getElementById("triggerGrantModalBtn").addEventListener("click",f),document.getElementById("openGrantModalBtn").addEventListener("click",f),g(),w(),_()}async function g(){const s=document.getElementById("userInvestmentsContainer"),{data:t,error:n}=await l.from("investments").select("*").eq("user_id",d).order("created_at",{ascending:!1});if(n||!t||t.length===0){s.innerHTML='<p style="text-align: center; color: var(--secondary-text); padding: 24px;">No active or past flight packages for this user.</p>';return}s.innerHTML=`
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; min-width: 600px;">
          <thead>
            <tr style="background: #FAFAFA; text-align: left; color: var(--secondary-text); font-size: 0.72rem; text-transform: uppercase;">
              <th style="padding: 12px;">Package Name</th>
              <th style="padding: 12px;">Value</th>
              <th style="padding: 12px;">Settled</th>
              <th style="padding: 12px;">Total Payout</th>
              <th style="padding: 12px;">Maturity Date</th>
              <th style="padding: 12px;">Status</th>
              <th style="padding: 12px;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${t.map(e=>{var a;return`
              <tr style="border-bottom: 1px solid #ECECEC;">
                <td style="padding: 12px;">
                  <strong style="color: var(--deep-forest);">${e.product_name}</strong>
                  ${(a=e.metadata)!=null&&a.is_admin_grant?'<span class="badge-status badge-completed" style="font-size:0.65rem; margin-left:4px;">ADMIN GRANT</span>':""}
                </td>
                <td style="padding: 12px; font-weight: 700; color: var(--primary-green);">${o(e.purchase_price)}</td>
                <td style="padding: 12px;">${e.days_settled} / ${e.duration_days} Days</td>
                <td style="padding: 12px; font-weight: 700;">${o(e.total_payout)}</td>
                <td style="padding: 12px; color: var(--secondary-text); font-size: 0.75rem;">${x(e.maturity_date,{includeTime:!1})}</td>
                <td style="padding: 12px;"><span class="badge-status ${e.status==="active"?"badge-completed":"badge-pending"}">${e.status}</span></td>
                <td style="padding: 12px;"><button type="button" class="del-inv-btn" data-id="${e.id}" data-name="${String(e.product_name||"").replace(/"/g,"&quot;")}" style="padding: 6px 12px; border-radius: 8px; border: 1px solid var(--error-red); background: #FDE8E8; color: var(--error-red); font-weight: 700; font-size: 0.75rem; cursor: pointer;">Delete</button></td>
              </tr>
            `}).join("")}
          </tbody>
        </table>
      `}document.getElementById("userInvestmentsContainer").addEventListener("click",async s=>{var r;const t=s.target.closest(".del-inv-btn");if(!t)return;const n=t.dataset.name||"this package";if(!confirm(`Delete "${n}" from this user? It stops all future income from it. Income already paid stays in their wallet.`))return;t.disabled=!0,t.textContent="Deleting...";const{data:e,error:a}=await l.rpc("admin_delete_investment",{p_investment_id:t.dataset.id});if(a||!(e!=null&&e.success))return t.disabled=!1,t.textContent="Delete",window.showToast?window.showToast((e==null?void 0:e.message)||(a==null?void 0:a.message)||"Could not delete package.","error"):alert("Could not delete package.");(r=window.showToast)==null||r.call(window,`"${n}" deleted.`,"success"),g()});async function _(){const s=document.getElementById("productSelect"),{data:t}=await l.from("products").select("id, code, name, price, duration_days, product_categories(name)").is("archived_at",null).order("price",{ascending:!0});t&&(s.innerHTML='<option value="">-- Choose Package to Grant --</option>'+t.map(n=>{var e;return`
            <option value="${n.id}">
              [${((e=n.product_categories)==null?void 0:e.name)||"VIP"}] ${n.name} - ${o(n.price)} (${n.duration_days} Days)
            </option>
          `}).join(""))}function f(){document.getElementById("grantModal").classList.add("active")}document.getElementById("closeModalBtn").addEventListener("click",()=>{document.getElementById("grantModal").classList.remove("active")});document.getElementById("grantProductForm").addEventListener("submit",async s=>{s.preventDefault();const t=document.getElementById("submitGrantBtn"),n=document.getElementById("productSelect").value,e=document.getElementById("grantReason").value.trim();if(!n)return alert("Please select a product.");t.disabled=!0,t.textContent="Granting Package...";try{const r=await(await fetch("/api/admin/grant-product",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${m.access_token}`},body:JSON.stringify({targetUserId:d,productId:n,reason:e})})).json();r.success?(alert(`Package "${r.product_name}" granted successfully! Ref: ${r.reference}`),document.getElementById("grantModal").classList.remove("active"),document.getElementById("grantProductForm").reset(),g()):alert(r.error||"Failed to grant product.")}catch{alert("Server error executing package grant.")}finally{t.disabled=!1,t.textContent="Confirm & Activate Package"}});let i=[],u="all";async function w(){const s=document.getElementById("userDownlineContainer"),{data:t,error:n}=await l.rpc("admin_get_user_downlines",{p_user_id:d});if(n){s.innerHTML=`<p style="text-align: center; color: var(--error-red); padding: 24px;">Could not load downline: ${n.message}</p>`;return}i=t||[];const e=i.filter(r=>r.is_active).length;document.querySelector('[data-count="all"]').textContent=i.length,document.querySelector('[data-count="active"]').textContent=e,document.querySelector('[data-count="inactive"]').textContent=i.length-e;const a=i.reduce((r,c)=>r+Number(c.total_deposits||0),0);document.getElementById("downlineSummary").textContent=`${i.length} members · ${e} active · Team deposits ${o(a)}`,y()}function y(){const s=document.getElementById("userDownlineContainer"),t=Number(document.getElementById("downlineLevel").value),n=i.filter(e=>(u==="all"||u==="active"===e.is_active)&&(!t||e.level===t));if(!n.length){s.innerHTML=`<p style="text-align: center; color: var(--secondary-text); padding: 24px;">${i.length?"No downline members match this filter.":"This user has no downline yet."}</p>`;return}s.innerHTML=`
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; min-width: 650px;">
          <thead>
            <tr style="background: #FAFAFA; text-align: left; color: var(--secondary-text); font-size: 0.72rem; text-transform: uppercase;">
              <th style="padding: 12px;">Member</th>
              <th style="padding: 12px;">Level</th>
              <th style="padding: 12px;">Status</th>
              <th style="padding: 12px;">Deposits</th>
              <th style="padding: 12px;">Running Packages</th>
              <th style="padding: 12px;">Joined</th>
              <th style="padding: 12px;"></th>
            </tr>
          </thead>
          <tbody>
            ${n.map(e=>`
              <tr style="border-bottom: 1px solid #ECECEC;">
                <td style="padding: 12px;">
                  <strong style="color: var(--deep-forest);">@${e.username||"—"}</strong>
                  <div style="font-size: 0.75rem; color: var(--secondary-text);">${e.full_name||""}${e.phone?" · "+e.phone:""}</div>
                </td>
                <td style="padding: 12px;">L${e.level}</td>
                <td style="padding: 12px;">
                  <span class="badge-status ${e.is_active?"badge-completed":"badge-pending"}">${e.is_active?"ACTIVE":"INACTIVE"}</span>
                  ${e.is_suspended?'<span class="badge-status badge-failed" style="margin-left:4px;">SUSPENDED</span>':""}
                </td>
                <td style="padding: 12px; font-weight: 700; color: var(--primary-green);">${o(e.total_deposits)} <small style="color: var(--secondary-text); font-weight: 400;">(${e.deposit_count})</small></td>
                <td style="padding: 12px;">${e.active_investments} · ${o(e.invested_amount)}</td>
                <td style="padding: 12px; color: var(--secondary-text); font-size: 0.75rem;">${x(e.joined_at,{includeTime:!1})}</td>
                <td style="padding: 12px;"><a href="/admin/user-details.html?id=${e.user_id}" class="btn-emerald" style="padding: 6px 12px; font-size: 0.75rem; text-decoration: none;">View</a></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `}document.getElementById("downlineFilters").addEventListener("click",s=>{const t=s.target.closest(".dl-chip");t&&(u=t.dataset.filter,document.querySelectorAll(".dl-chip").forEach(n=>n.classList.toggle("active",n===t)),y())});document.getElementById("downlineLevel").addEventListener("change",y);h();
