/* Livrable de fin de projet Studio ES : typographie, bascule ordinateur / téléphone, zoom, module de retours. */
(function(){
  var $ = function(s, r){ return (r || document).querySelector(s); }, $$ = function(s, r){ return [].slice.call((r || document).querySelectorAll(s)); };

  /* typographie française : insécables avant : ; ? ! », après «, entre chiffre et unité, et sur les mots courts et débuts de phrase */
  var SKIP = /^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|SVG|CODE)$/;
  function fix(t){ return t
    .replace(/\b(0\d) (\d\d) (\d\d) (\d\d) (\d\d)\b/g, "$1 $2 $3 $4 $5").replace(/ ([:;?!»])/g, " $1").replace(/« /g, "« ")
    .replace(/(\d) (€|%|h\b|cm\b|min\b|jours?\b|mois\b|ans\b|milliards\b)/g, "$1 $2")
    .replace(/([.!?]) ([^\s ]{1,14}) /g, "$1 $2 ").replace(/([.!?]) ([^\s ]+ [^\s ]{1,12}) /g, "$1 $2 ")
    .replace(/(^|[\s(])(à|a|de|du|le|la|les|un|une|des|et|ou|en|au|aux|par|pour|sur|ce|ces|son|sa|ses|vos|votre|nos|notre|je|j'ai|il|on|ne|y|me|vous) /gi, "$1$2 "); }
  function walk(n){ if(n.nodeType === 3){ var v = fix(n.nodeValue); if(v !== n.nodeValue) n.nodeValue = v; return; }
    if(n.nodeType !== 1 || SKIP.test(n.nodeName.toUpperCase())) return; for(var i = 0; i < n.childNodes.length; i++) walk(n.childNodes[i]); }
  window.typo = walk; walk(document.body);

  /* téléphone de couverture : hauteur visible pour le défilement */
  var roll = $(".roll div"); function rh(){ if(roll) roll.style.setProperty("--h", roll.clientHeight + "px"); var im = $(".roll img"); if(im) im.style.setProperty("--h", roll.clientHeight + "px"); }
  rh(); addEventListener("resize", rh);

  /* bascule ordinateur / téléphone */
  var seg = $(".seg");
  function mode(m){ document.body.classList.toggle("m", m === "m"); if(seg) $$("button", seg).forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.m === m)); }); }
  mode(matchMedia("(max-width:760px)").matches ? "m" : "d");
  if(seg) $$("button", seg).forEach(function(b){ b.onclick = function(){ mode(b.dataset.m); }; });
  /* la bascule n'apparaît que pendant la rubrique des captures */
  var zone = $("[data-seg-zone]");
  if(seg && zone && "IntersectionObserver" in window){ new IntersectionObserver(function(es){ es.forEach(function(x){ seg.classList.toggle("on", x.isIntersecting); }); }, {rootMargin:"-30% 0px -30% 0px"}).observe(zone); }
  else if(seg) seg.classList.add("on");

  /* zoom */
  var lb = $(".lbx");
  if(lb){ var lbi = $("img", lb); $$(".zoom").forEach(function(i){ i.addEventListener("click", function(){ lbi.src = i.src; lbi.alt = i.alt; lb.classList.add("on"); lb.scrollTop = 0; }); });
    function shut(){ lb.classList.remove("on"); } $("button", lb).onclick = shut; lb.addEventListener("click", function(e){ if(e.target === lb) shut(); }); document.addEventListener("keydown", function(e){ if(e.key === "Escape") shut(); }); }

  function toast(t){ var el = $(".toast"); if(!el) return; el.textContent = t; el.classList.add("on"); clearTimeout(toast.k); toast.k = setTimeout(function(){ el.classList.remove("on"); }, 2600); }

  /* module de retours : data-key, data-to, data-subject sur le formulaire */
  var f = $("#rform"); if(!f) return;
  var KEY = f.dataset.key, TO = f.dataset.to, SUBJ = f.dataset.subject, mem = [];
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch(e){ return mem; } }
  function store(a){ mem = a; try{ localStorage.setItem(KEY, JSON.stringify(a)); }catch(e){} }
  var items = load();
  try{ var n0 = localStorage.getItem(KEY + "-nom"); if(n0) $("#rNom").value = n0; }catch(e){}
  $("#rNom").addEventListener("input", function(){ try{ localStorage.setItem(KEY + "-nom", this.value); }catch(e){} });
  $$(".chips").forEach(function(g){ $$("button", g).forEach(function(b){ b.onclick = function(){ $$("button", g).forEach(function(x){ x.setAttribute("aria-pressed", String(x === b)); }); }; }); });
  function pick(k){ var b = $('.chips[data-k="' + k + '"] button[aria-pressed="true"]'); return b ? b.dataset.v : ""; }
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  var P1 = "Avant la mise en ligne";
  function render(){
    var l = $("#rList");
    l.innerHTML = items.map(function(x, i){
      return '<li><span class="m"><b>' + (i + 1) + ". " + esc(x.rub) + "</b> · " + esc(x.app) + " · " + esc(x.type) + ' · <span class="' + (x.prio === P1 ? "p1" : "") + '">' + esc(x.prio) + "</span></span>"
        + "<p>" + esc(x.txt) + "</p>"
        + (x.avant || x.apres ? '<p class="m">' + (x.avant ? "Actuel : « " + esc(x.avant) + " »" : "") + (x.avant && x.apres ? "\n" : "") + (x.apres ? "Souhaité : « " + esc(x.apres) + " »" : "") + "</p>" : "")
        + '<button type="button" class="x" data-i="' + i + '">Retirer</button></li>';
    }).join("");
    $$(".x", l).forEach(function(b){ b.onclick = function(){ items.splice(+b.dataset.i, 1); store(items); render(); }; });
    $("#rVide").hidden = items.length > 0; $("#rEnvoi").hidden = !items.length;
    $("#rCount").textContent = items.length ? items.length + (items.length > 1 ? " demandes" : " demande") : "";
    walk(l);
  }
  f.addEventListener("submit", function(e){
    e.preventDefault(); var t = $("#rTxt").value.trim();
    if(t.length < 3 && !$("#rApres").value.trim()){ $("#rMsg").textContent = "Décrivez la demande en quelques mots."; $("#rTxt").focus(); return; }
    items.push({rub:$("#rRub").value, app:pick("app"), type:pick("type"), prio:pick("prio"), txt:t, avant:$("#rAvant").value.trim(), apres:$("#rApres").value.trim(), at:Date.now()});
    store(items); render(); $("#rTxt").value = ""; $("#rAvant").value = ""; $("#rApres").value = "";
    $("#rMsg").textContent = "Ajoutée à la liste."; setTimeout(function(){ $("#rMsg").textContent = ""; }, 2600);
  });
  function texte(){
    var ordre = [P1, "Important", "Si possible"], s = SUBJ + "\n" + new Date().toLocaleDateString("fr-FR") + ($("#rNom").value.trim() ? ", de " + $("#rNom").value.trim() : "") + "\n";
    ordre.forEach(function(p){ var g = items.filter(function(x){ return x.prio === p; }); if(!g.length) return;
      s += "\n" + p + "\n";
      g.forEach(function(x){ s += "\n" + (items.indexOf(x) + 1) + ". " + x.rub + " (" + x.app + ", " + x.type.toLowerCase() + ")\n" + x.txt + "\n" + (x.avant ? "Texte actuel : « " + x.avant + " »\n" : "") + (x.apres ? "Texte souhaité : « " + x.apres + " »\n" : ""); });
    });
    return s;
  }
  $("#rSend").onclick = function(){ location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(SUBJ + " (" + items.length + ")") + "&body=" + encodeURIComponent(texte()); };
  $("#rCopy").onclick = function(){ var t = texte();
    function fb(){ var a = document.createElement("textarea"); a.value = t; a.style.position = "fixed"; a.style.opacity = "0"; document.body.appendChild(a); a.select(); try{ document.execCommand("copy"); toast("Liste copiée"); }catch(e){ toast("Copie impossible sur cet appareil"); } a.remove(); }
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function(){ toast("Liste copiée"); }, fb); else fb(); };
  $("#rClear").onclick = function(){ if(!items.length) return; items = []; store(items); render(); toast("Liste vidée"); };
  render();
})();
