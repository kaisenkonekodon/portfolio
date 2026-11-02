const works = [
  {
    title: "「わんコメ」CM作ってみた/新島らんぷ様",
    video: "assets/video/wankome.mp4",
    youtube: "https://youtu.be/XJLatn0lAB8",
    type: ["CM"],
    mood: ["かわいい", "ポップ"],
    style: ["2D"],
    tags: ["CM", "かわいい", "ポップ", "2D"],
    description: `新島NOKO様の「CM作ってみた」企画。
ワンちゃんが歌っているかのような可愛くてわかりやすい楽曲とともに、その魅力をCMにぎゅっと詰め込みました。
映像制作だけでなく、歌詞に合わせたわんコメ機能の調査～CMの構成、画面デザインや演出考案まで担当しました。`,
    price: "30,000円",
    period: "1か月"
  },
  {
    title: "どきどきキュン!で大暴走♡/奏雨-sou-様 他",
    video: "assets/video/dokidoki-kyun.mp4",
    youtube: "https://youtu.be/XWSi5UIVPhk",
    type: ["MV", "歌ってみた"],
    mood: ["かわいい", "ポップ"],
    style: ["2D", "2.5D", "CG"],
    tags: ["MV", "歌ってみた", "かわいい", "ポップ", "2D", "2.5D", "CG"],
    description: ``,
    price: "40,000円",
    period: "1.5か月"
  },
  {
    title: "ラブドール/145様",
    video: "assets/video/lovedoll.mp4",
    youtube: "https://youtu.be/mkvbVoxm3tk",
    type: ["MV", "歌ってみた"],
    mood: ["ダーク", "ストーリー性"],
    style: ["2D"],
    tags: ["MV", "歌ってみた", "ダーク","2D", "2.5D", "ストーリー性"],
    description: ``,
    price: "30,000円",
    period: "2か月"
  },
  {
    title: "春よ、私の懺悔を聴いて feat.初音ミク/DEAR様",
    video: "assets/video/haru-zange.mp4",
    youtube: "https://youtu.be/OFVcrbvBkSs",
    type: ["MV", "オリジナル曲"],
    mood: ["きれい", "エモい", "幻想的"],
    style: ["2D","2.5D"],
    tags: ["MV", "オリジナル曲", "きれい", "エモい", "幻想的", "2D", "2.5D"],
    description: ``,
    price: "15,000円",
    period: "3週間"
  },
  {
    title: "とあるVTuberとの誕生日/新島らんぷ様",
    video: "assets/video/vtuber-birthday.mp4",
    youtube: "https://youtu.be/38RSVb23N2M",
    type: ["MV", "オリジナル曲"],
    mood: ["ポップ", "エモい", "きれい"],
    style: ["2.5D"],
    tags: ["MV", "オリジナル曲", "ポップ", "エモい", "きれい", "2.5D"],
    description: ``,
    price: "30,000円",
    period: "2か月"
  },
  {
    title: "【自己紹介PV】/ユムレ・カオスアニマ様",
    video: "assets/video/yumure-profile-pv.mp4",
    youtube: "https://youtu.be/-ssw5IHPUGs",
    type: ["PV"],
    mood: ["かっこいい", "ダーク"],
    style: ["2.5D"],
    tags: ["PV", "かっこいい", "ダーク",  "2D","2.5D"],
    description: ``,
    price: "20,000円",
    period: "1か月"
  }
];

const state = { type: new Set(), mood: new Set(), style: new Set() };
const groups = {
  type: ["オリジナル曲", "MV", "歌ってみた", "CM", "PV", "Shorts"],
  mood: ["かっこいい", "かわいい", "きれい", "おしゃれ", "エモい", "ポップ", "幻想的", "ダーク","ストーリー性"],
  style: ["2D", "CG", "2.5D", ]
};

const $ = s => document.querySelector(s);
function allTags(work){ return [...new Set([...work.tags, ...work.type, ...work.mood, ...work.style])]; }

function renderFilters(){
  for(const [key,tags] of Object.entries(groups)){
    const el = document.getElementById(key+"Filters");
    el.innerHTML = tags.map(tag=>`<button class="filter-button ${state[key].has(tag)?"active":""}" data-group="${key}" data-tag="${tag}">${tag}</button>`).join("");
  }
  document.querySelectorAll(".filter-button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const group=btn.dataset.group, tag=btn.dataset.tag;
      state[group].has(tag) ? state[group].delete(tag) : state[group].add(tag);
      renderFilters(); renderWorks();
    });
  });
}
function matches(work){
  for(const [group,set] of Object.entries(state)){
    if(set.size && ![...set].every(t => allTags(work).includes(t))) return false;
  }
  return true;
}
function renderWorks(){
  const list=works.filter(matches);
  $("#resultCount").textContent=`${list.length} / ${works.length} WORKS`;
  const active=[...state.type,...state.mood,...state.style];
  $("#activeFilters").textContent=active.length ? "選択中: "+active.map(x=>`#${x}`).join("  ") : "";
  $("#worksGrid").innerHTML=list.length ? list.map((w,i)=>`
    <article class="work-card" data-index="${works.indexOf(w)}">
      <div class="work-media">
        <video src="${w.video}" autoplay muted loop playsinline preload="metadata"></video>
      </div>
      <div class="work-info">
        <div class="work-number">${String(works.indexOf(w)+1).padStart(2,"0")}</div>
        <h3 class="work-title">${w.title}</h3>
        <div class="tag-list">${w.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
      </div>
    </article>`).join("") : `<div class="empty">該当する作品がありません。</div>`;
  document.querySelectorAll(".work-card").forEach(card=>card.addEventListener("click",()=>openModal(Number(card.dataset.index))));
}
function openModal(index){
  const w=works[index];
  $("#modalType").textContent=w.type.join(" / ");
  $("#modalTitle").textContent=w.title;
  $("#modalTags").innerHTML=w.tags.map(t=>`<span class="tag">${t}</span>`).join("");
  $("#modalDescription").textContent=w.description;
  $("#modalPrice").textContent=w.price || "—";
  $("#modalPeriod").textContent=w.period || "—";
  $("#modalYoutube").href=w.youtube || "#";
  $("#modalMedia").innerHTML=`<video src="${w.video}" autoplay muted loop playsinline controls></video>`;
  $("#modal").classList.add("open"); $("#modal").setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
}
function closeModal(){
  $("#modal").classList.remove("open"); $("#modal").setAttribute("aria-hidden","true"); $("#modalMedia").innerHTML=""; document.body.style.overflow="";
}
document.querySelectorAll("[data-close]").forEach(x=>x.addEventListener("click",closeModal));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#clearFilters").addEventListener("click",()=>{for(const s of Object.values(state))s.clear();renderFilters();renderWorks()});
renderFilters(); renderWorks();
