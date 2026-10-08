/* ===== PLAYBOOK 공통 스크립트: 오류 상자, 이동, 카드 넘김, 퀴즈, 용어 풀이 ===== */
(function(){
  var shown = [];
  window.PE_ERR = function(e, where){
    try{
      var box = document.getElementById('errbox');
      if(!box){ box = document.createElement('div'); box.id = 'errbox'; document.body.appendChild(box); }
      var msg = (where ? '[' + where + '] ' : '') + (e && e.message ? e.message : String(e));
      if(shown.indexOf(msg) > -1) return;
      shown.push(msg);
      box.style.display = 'block';
      box.innerHTML = '<b>화면 일부가 제대로 열리지 않았어요.</b> 새로고침해 보고, 계속되면 선생님께 알려 주세요.<br><small>' + shown.join('<br>').replace(/</g,'&lt;') + '</small>';
    }catch(_){}
  };
  window.addEventListener('error', function(ev){ PE_ERR(ev.error || ev.message, '페이지'); });
})();

window.PE = window.PE || {};

/* 탭 껍데기로 이동 요청 */
PE.nav = function(target){
  try{ if(window.parent && window.parent !== window) window.parent.postMessage({type:'pe-nav', target:target}, '*'); }catch(e){}
};
document.addEventListener('click', function(ev){
  var a = ev.target.closest && ev.target.closest('[data-nav]');
  if(a){ ev.preventDefault(); PE.nav(a.getAttribute('data-nav')); }
});

PE.reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- 카드 넘김 ---- */
PE.deck = function(root){
  var track = root.querySelector('.track');
  var slides = Array.prototype.slice.call(track.children);
  var segs = root.querySelector('.segs');
  var count = root.querySelector('.count');
  var prev = root.querySelector('.ctrl .prev'), next = root.querySelector('.ctrl .next');
  var idx = -1, seen = {}, listeners = [];
  var ttl = root.querySelector('.rail .ttl'); if(ttl) ttl.textContent = root.dataset.title || '';
  slides.forEach(function(s, i){
    var b = document.createElement('button');
    b.className = 'seg' + (s.classList.contains('is-quiz') ? ' quiz' : '');
    b.setAttribute('aria-label', (i+1) + '번째 카드' + (s.dataset.title ? ': ' + s.dataset.title : ''));
    b.onclick = function(){ go(i); };
    segs.appendChild(b);
  });
  var segEls = segs.children;
  function go(i, smooth){
    i = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({left: i * track.clientWidth, behavior: (smooth === false || PE.reduce) ? 'auto' : 'smooth'});
  }
  function update(){
    var i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    if(i === idx) return;
    idx = i; seen[i] = true;
    slides.forEach(function(s, k){ s.classList.toggle('enter', k === i); s.toggleAttribute('inert', false); });
    for(var k = 0; k < segEls.length; k++){
      segEls[k].classList.toggle('on', k === i);
      segEls[k].classList.toggle('done', !!seen[k] && k !== i);
    }
    count.textContent = (i+1) + ' / ' + slides.length;
    prev.disabled = i === 0; next.disabled = i === slides.length - 1;
    listeners.forEach(function(fn){ try{ fn(i, slides[i]); }catch(e){ PE_ERR(e, '카드 넘김'); } });
  }
  var raf = 0;
  track.addEventListener('scroll', function(){ cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, {passive:true});
  prev.onclick = function(){ go(idx - 1); };
  next.onclick = function(){ go(idx + 1); };
  window.addEventListener('resize', function(){ var k = idx; idx = -1; go(k, false); setTimeout(update, 60); });
  document.addEventListener('keydown', function(e){
    if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if(e.key === 'ArrowRight' || e.key === 'PageDown'){ go(idx + 1); e.preventDefault(); }
    if(e.key === 'ArrowLeft' || e.key === 'PageUp'){ go(idx - 1); e.preventDefault(); }
  });
  var fsz = root.querySelectorAll('.fsz button');
  var sizes = [16, 18, 20, 22], si = 1;
  try{ si = +(localStorage.getItem('pe-fs') || 1); }catch(e){}
  function applyFs(){ document.documentElement.style.setProperty('--fs', sizes[si] + 'px'); try{ localStorage.setItem('pe-fs', si); }catch(e){} }
  if(fsz.length === 2){
    fsz[0].onclick = function(){ si = Math.max(0, si - 1); applyFs(); };
    fsz[1].onclick = function(){ si = Math.min(sizes.length - 1, si + 1); applyFs(); };
  }
  applyFs();
  var hint = root.querySelector('.swipe-hint');
  if(hint){ setTimeout(function(){ hint.style.opacity = 0; }, 3800); }
  setTimeout(update, 30);
  return {
    go: go,
    slides: slides,
    get idx(){ return idx; },
    onChange: function(fn){ listeners.push(fn); },
    indexOf: function(el){ var s = el.closest('.slide'); return slides.indexOf(s); }
  };
};

/* ---- 퀴즈 ----
   QUIZ = { id: {type:'mc'|'ox'|'pics'|'chips', q, opts, a, ex, src} }
   <div class="quiz" data-q="id"></div> 자리에 그린다. 첫 번째 답만 점수에 넣는다. */
PE.quiz = function(QUIZ, opt){
  opt = opt || {};
  var state = {}; // id -> {first:true/false}
  var order = [];
  var nums = {};
  var holders = document.querySelectorAll('.quiz[data-q]');
  Array.prototype.forEach.call(holders, function(h, n){
    var id = h.getAttribute('data-q'), d = QUIZ[id];
    if(!d){ h.textContent = '문제 데이터 없음: ' + id; return; }
    order.push(id); nums[id] = order.length;
    var head = '<div class="qn">문제 ' + order.length + (d.src ? ' <span class="src">' + d.src + '</span>' : '') + '</div>';
    var q = '<div class="q">' + d.q + '</div>';
    h.innerHTML = head + q;
    var fb = document.createElement('div'); fb.className = 'fb';
    function done(ok){
      if(!(id in state)) state[id] = ok;
      fb.className = 'fb show ' + (ok ? 'ok' : 'no');
      fb.innerHTML = (ok ? '<b>정답이에요.</b> ' : '<b>다시 생각해 봐요.</b> ') + (d.ex || '');
      if(opt.onAnswer) opt.onAnswer(id, ok, state);
    }
    if(d.type === 'chips'){
      var parts = d.q.split(/\[\[(\d+)\]\]/);
      var sent = document.createElement('div'); sent.className = 'sentence';
      var blanks = [];
      h.querySelector('.q').remove();
      parts.forEach(function(p, i){
        if(i % 2 === 0){ sent.appendChild(document.createTextNode(p)); return; }
        var b = document.createElement('button'); b.className = 'blank'; b.textContent = ' ';
        b.setAttribute('aria-label', '빈칸'); b._val = null;
        b.onclick = function(){ if(b._val == null || b.classList.contains('right')) return; b._chip.classList.remove('used'); b._val = null; b.textContent = ' '; b.classList.remove('wrong'); };
        blanks.push(b); sent.appendChild(b);
      });
      h.appendChild(sent);
      var chips = document.createElement('div'); chips.className = 'chips';
      d.chips.forEach(function(c){
        var cb = document.createElement('button'); cb.className = 'chip'; cb.textContent = c;
        cb.onclick = function(){
          if(cb.classList.contains('used')) return;
          var empty = blanks.filter(function(b){ return b._val == null; })[0];
          if(!empty) return;
          empty._val = c; empty._chip = cb; empty.textContent = c; cb.classList.add('used');
          if(blanks.every(function(b){ return b._val != null; })){
            var ok = blanks.every(function(b, i){ return b._val === d.a[i]; });
            blanks.forEach(function(b, i){ b.classList.toggle('right', b._val === d.a[i]); b.classList.toggle('wrong', b._val !== d.a[i]); });
            done(ok);
          }
        };
        chips.appendChild(cb);
      });
      h.appendChild(chips);
    } else {
      var box = document.createElement('div');
      var opts = d.type === 'ox' ? ['O', 'X'] : d.opts;
      box.className = 'opts' + (d.type === 'ox' ? ' ox' : '') + (d.type === 'pics' ? ' pics' : '') + (d.two ? ' two' : '');
      opts.forEach(function(o, i){
        var b = document.createElement('button'); b.className = 'opt';
        b.innerHTML = (d.type === 'ox' ? '' : '<span class="k">' + (i+1) + '</span>') + '<span>' + o + '</span>';
        b.onclick = function(){
          var ans = d.type === 'ox' ? (d.a ? 0 : 1) : d.a;
          var ok = i === ans;
          b.classList.add(ok ? 'right' : 'wrong');
          if(ok){ Array.prototype.forEach.call(box.children, function(x){ x.disabled = true; }); }
          done(ok);
        };
        box.appendChild(b);
      });
      h.appendChild(box);
    }
    h.appendChild(fb);
  });
  return {
    order: order,
    state: state,
    nums: nums,
    score: function(){ var s = 0; order.forEach(function(id){ if(state[id] === true) s++; }); return s; },
    answered: function(){ return order.filter(function(id){ return id in state; }).length; }
  };
};

/* 결과 칸 그리기 */
PE.renderScore = function(el, quiz, deck, msgs){
  var n = quiz.order.length, s = quiz.score(), a = quiz.answered();
  var msg = a < n ? '아직 ' + (n - a) + '문제를 풀지 않았어요.' : (s === n ? msgs[0] : s >= n * 0.6 ? msgs[1] : msgs[2]);
  var wrong = quiz.order.filter(function(id){ return quiz.state[id] === false; });
  var html = '<div class="scorebox"><div><div class="lbl">맞힌 문제</div><div class="digits">' + s + '<small> / ' + n + '</small></div></div><div style="flex:1;min-width:200px"><div class="msg">' + msg + '</div></div></div>';
  if(wrong.length){
    html += '<div class="review">' + wrong.map(function(id){
      var h = document.querySelector('.quiz[data-q="' + id + '"]');
      var label = '틀린 문제 ' + quiz.nums[id] + ' 다시 보기';
      return '<button data-go="' + deck.indexOf(h) + '">' + label + ' →</button>';
    }).join('') + '</div>';
  }
  el.innerHTML = html;
  Array.prototype.forEach.call(el.querySelectorAll('[data-go]'), function(b){ b.onclick = function(){ deck.go(+b.dataset.go); }; });
};

/* ---- 용어 풀이 ---- */
PE.glossary = function(G){
  var pop = null;
  function close(){ if(pop){ pop.remove(); pop = null; } }
  document.addEventListener('click', function(ev){
    var t = ev.target.closest && ev.target.closest('.term');
    close();
    if(!t) return;
    var key = t.dataset.t || t.textContent.trim();
    if(!G[key]) return;
    pop = document.createElement('div'); pop.className = 'gloss';
    pop.innerHTML = '<b>' + key + '</b>' + G[key];
    document.body.appendChild(pop);
    var r = t.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    var x = Math.min(window.innerWidth - pw - 10, Math.max(10, r.left + r.width / 2 - pw / 2));
    var y = r.bottom + 8; if(y + ph > window.innerHeight - 10) y = r.top - ph - 8;
    pop.style.left = x + 'px'; pop.style.top = y + 'px';
    ev.stopPropagation();
  });
  document.addEventListener('scroll', close, true);
};
