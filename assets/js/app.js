const works = [
  {
    title: "「わんコメ」CM作ってみた",
    video: "assets/video/wankome.mp4",
    youtube: "https://youtu.be/XJLatn0lAB8",
    type: ["CM"],
    mood: ["かわいい", "ポップ"],
    style: [],
    tags: ["かわいい", "ポップ", "CM"],
    description: `新島NOKO様の「CM作ってみた」企画。\nワンちゃんが歌っているかのような可愛くてわかりやすい楽曲とともに、その魅力をCMにぎゅっと詰め込みました。\n映像制作だけでなく、歌詞に合わせたわんコメ機能の調査～CMの構成、画面デザインや演出考案まで担当しました。`,
    price: "30,000円",
    period: "1か月"
  }
  // 作品を追加するときは、この下に同じ形式で追加してください。
];

const state = { type: new Set(), mood: new Set(), style: new Set() };
const groups = {
  type: ["MV","歌ってみた","CM","PV","Shorts","Vtuber","ゲーム"],
  mood: ["かっこいい","かわいい","きれい","おしゃれ","エモい","ポップ","幻想的","ダーク","病み","ホラー","不穏","コミカル"],
  style: ["2D","3D","2.5D","イラスト","実写","CG","グラフィック","コラージュ","レトロ","サイバー","歌詞演出","タイポグラフィ","音ハメ","エフェクト","ストーリー","カメラワーク","グリッチ","ループ","モーショングラフィックス"]
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
