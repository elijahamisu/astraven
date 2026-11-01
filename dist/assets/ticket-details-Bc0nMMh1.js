import{s as d,r as v}from"./supabase-client-C6YDjNCm.js";import{i as _}from"./user-navigation-CPu4N22w.js";import{f as g}from"./formatters-kkpPVsns.js";import"./site-settings-DR2l5HIv.js";import"./mobile-cards-DX-1T3ZF.js";let m=null,l=null;async function p(){await _({requireSession:!0});const n=await v();if(!n)return;if(m=n.user.id,l=new URLSearchParams(window.location.search).get("id"),!l){document.getElementById("ticketSummary").innerHTML='<p style="color: var(--error-red);">No ticket specified.</p>';return}const{data:r,error:c}=await d.from("support_tickets").select("*").eq("id",l).maybeSingle();if(c||!r){document.getElementById("ticketSummary").innerHTML='<p style="color: var(--error-red);">Ticket not found or unauthorized.</p>';return}const e=["closed","resolved"].includes(r.status);document.getElementById("replyForm").style.display=e?"none":"",document.getElementById("endedBar").style.display=e?"block":"none",document.getElementById("ticketSummary").innerHTML=`
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-family: monospace; font-size: 0.8rem; font-weight: 700; color: var(--metallic-gold);">${r.ticket_ref}</span>
          <span class="badge-status ${e?"badge-failed":"badge-pending"}">${e?"session ended":r.status.replace(/_/g," ")}</span>
        </div>
        <h2 style="font-size: 1.15rem; color: var(--deep-forest); margin-bottom: 4px;">${y(r.subject)}</h2>
        <span style="font-size: 0.75rem; color: var(--secondary-text);">Category: <strong>${r.category}</strong> | Opened: ${g(r.created_at)}</span>
      `;const{data:s}=await d.from("support_messages").select("*").eq("ticket_id",l).order("created_at",{ascending:!0}),u=document.getElementById("chatThread");if(!s||s.length===0){u.innerHTML='<p style="text-align: center; color: var(--secondary-text);">No messages recorded.</p>';return}const f=await Promise.all(s.map(async t=>{let a=null;if(t.attachment_url)try{const{data:o}=await d.storage.from("support-attachments").createSignedUrl(t.attachment_url,3600);a=(o==null?void 0:o.signedUrl)||null}catch(o){console.warn("Failed to load image preview:",o)}return{...t,imageUrl:a}}));u.innerHTML=f.map(t=>{const a=t.sender_id===m&&!t.is_staff;return`
          <div class="msg-bubble ${a?"user":"staff"}">
            <span style="font-size: 0.72rem; font-weight: 700; color: ${a?"var(--soft-gold)":"var(--primary-green)"}; display: block; margin-bottom: 2px;">
              ${a?"You":"✦ Support Desk Officer"}
            </span>
            <div>${y(t.message)}</div>

            <!-- Direct Image Display -->
            ${t.imageUrl?`
              <div style="margin-top: 6px;">
                <img src="${t.imageUrl}" alt="Attachment preview" class="msg-inline-img" onclick="window.open('${t.imageUrl}', '_blank')" title="Tap to view full screen">
              </div>
            `:""}

            <span class="msg-meta">${g(t.created_at)}</span>
          </div>
        `}).join(""),window.scrollTo(0,document.body.scrollHeight)}document.getElementById("replyForm").addEventListener("submit",async n=>{n.preventDefault();const i=document.getElementById("replyMsg"),r=document.getElementById("sendBtn"),c=i.value.trim();if(!c)return;r.disabled=!0;const{data:e,error:s}=await d.rpc("reply_support_ticket",{p_ticket_id:l,p_sender_id:m,p_message:c,p_attachment_url:null});r.disabled=!1,s||!(e!=null&&e.success)?(alert((e==null?void 0:e.error)||(s==null?void 0:s.message)||"Failed to send reply"),e!=null&&e.ended&&p()):(i.value="",p())});function y(n){return n?n.replace(/[&<>"']/g,i=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[i]):""}p();
