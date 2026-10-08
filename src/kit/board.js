/* ===== 작전판: 위에서 내려다본 태그럭비 경기장, 선수, 공, 장면 재생 =====
   좌표는 m 단위. x: 왼쪽 트라이 라인 0 → 오른쪽 트라이 라인 L (파랑 팀 공격 방향 +x)
   y: 위쪽 터치라인 0 → 아래쪽 터치라인 W. 인골은 양 끝 IG m. */
(function(){
var NS = 'http://www.w3.org/2000/svg';
function E(tag, attrs, parent){
  var e = document.createElementNS(NS, tag);
  if(attrs) for(var k in attrs) e.setAttribute(k, attrs[k]);
  if(parent) parent.appendChild(e);
  return e;
}
var uid = 0;
function lerp(a, b, u){ return a + (b - a) * u; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

var TEAM = {
  blue: {c1:'#6ea2ff', c2:'#1a4fb8', edge:'#0f2f73', arm:'#1d3f86'},
  red:  {c1:'#ff8a6b', c2:'#b0301d', edge:'#6e170b', arm:'#8e2414'}
};

function Board(svg, o){
  o = o || {};
  this.svg = svg; this.L = o.len != null ? o.len : 40; this.W = o.wid != null ? o.wid : 25; this.IG = o.ig != null ? o.ig : 5;
  var v = o.view || {x:-this.IG - 0.6, y:-0.6, w:this.L + 2*this.IG + 1.2, h:this.W + 1.2};
  this.view = v;
  svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h);
  svg.setAttribute('preserveAspectRatio', o.par || 'xMidYMid meet');
  svg.classList.add('board');
  var id = this.id = 'pb' + (++uid);
  var d = E('defs', null, svg);
  function rg(name, c1, c2, cx, cy){
    var g = E('radialGradient', {id:id + name, cx:cx || '.36', cy:cy || '.3', r:'.78'}, d);
    E('stop', {offset:'0', 'stop-color':c1}, g); E('stop', {offset:'1', 'stop-color':c2}, g);
  }
  rg('blue', TEAM.blue.c1, TEAM.blue.c2); rg('red', TEAM.red.c1, TEAM.red.c2);
  rg('ball', '#ffffff', '#c5cec8', '.4', '.3');
  var vg = E('radialGradient', {id:id + 'vig', cx:'.5', cy:'.5', r:'.75'}, d);
  E('stop', {offset:'.55', 'stop-color':'#000', 'stop-opacity':'0'}, vg); E('stop', {offset:'1', 'stop-color':'#000', 'stop-opacity':'.28'}, vg);
  var sh = E('linearGradient', {id:id + 'sheen', x1:'0', y1:'0', x2:'0', y2:'1'}, d);
  E('stop', {offset:'0', 'stop-color':'#fff', 'stop-opacity':'.07'}, sh); E('stop', {offset:'1', 'stop-color':'#fff', 'stop-opacity':'0'}, sh);
  this.gTurf = E('g', null, svg);
  this.gMarks = E('g', null, svg);
  this.gActors = E('g', null, svg);
  this.gBall = E('g', null, svg);
  this.gFx = E('g', null, svg);
  this.actors = {};
  this.drawField(o);
}
Board.prototype.drawField = function(o){
  var L = this.L, W = this.W, IG = this.IG, g = this.gTurf, id = this.id, pad = 8;
  E('rect', {x:-IG - pad, y:-pad, width:L + 2*IG + 2*pad, height:W + 2*pad, fill:'#1b6340'}, g);
  var n = Math.ceil((L + 2*IG) / 2.5);
  for(var i = 0; i < n; i++){
    E('rect', {x:-IG + i*2.5, y:0, width:Math.min(2.5, L + IG - (-IG + i*2.5)), height:W, fill:i % 2 ? '#2c8752' : '#33935b'}, g);
  }
  E('rect', {x:L, y:0, width:IG, height:W, fill:'rgba(255,210,63,.13)'}, g);
  E('rect', {x:-IG, y:0, width:IG, height:W, fill:'rgba(255,255,255,.05)'}, g);
  E('rect', {x:-IG, y:0, width:L + 2*IG, height:W, fill:'url(#' + id + 'sheen)'}, g);
  var ln = {stroke:'#f3f6ee', 'stroke-width':.14, fill:'none', 'stroke-linecap':'round', opacity:.92};
  E('rect', Object.assign({x:-IG, y:0, width:L + 2*IG, height:W}, ln), g);
  E('line', Object.assign({x1:0, y1:0, x2:0, y2:W}, ln, {'stroke-width':.26}), g);
  E('line', Object.assign({x1:L, y1:0, x2:L, y2:W}, ln, {'stroke-width':.26}), g);
  E('line', Object.assign({x1:L/2, y1:0, x2:L/2, y2:W, 'stroke-dasharray':'.7 .5'}, ln), g);
  if(o.labels !== false){
    var t1 = E('text', {x:L + IG/2, y:W/2, 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-size':1.25, fill:'rgba(255,255,255,.55)', 'font-family':'Black Han Sans, Pretendard', transform:'rotate(90 ' + (L + IG/2) + ' ' + W/2 + ')', 'letter-spacing':'.4'}, g);
    t1.textContent = '상대 인골';
    var t2 = E('text', {x:-IG/2, y:W/2, 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-size':1.25, fill:'rgba(255,255,255,.35)', 'font-family':'Black Han Sans, Pretendard', transform:'rotate(-90 ' + (-IG/2) + ' ' + W/2 + ')', 'letter-spacing':'.4'}, g);
    t2.textContent = '우리 인골';
  }
  [[-IG,0],[-IG,W],[0,0],[0,W],[L/2,0],[L/2,W],[L,0],[L,W],[L+IG,0],[L+IG,W]].forEach(function(p){
    E('path', {d:'M' + (p[0]-.38) + ' ' + (p[1]+.3) + ' L' + p[0] + ' ' + (p[1]-.42) + ' L' + (p[0]+.38) + ' ' + (p[1]+.3) + ' Z', fill:'#ff8a1f', stroke:'#a84d00', 'stroke-width':.06}, g);
  });
  E('rect', {x:-IG - pad, y:-pad, width:L + 2*IG + 2*pad, height:W + 2*pad, fill:'url(#' + id + 'vig)', 'pointer-events':'none'}, g);
};
Board.prototype.player = function(id, team, num, o){ var a = new Actor(this, id, team, num, o || {}); this.actors[id] = a; return a; };
Board.prototype.ball = function(){ return this._ball || (this._ball = new Ball(this)); };
Board.prototype.toLocal = function(ev){
  var pt = this.svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
  var p = pt.matrixTransform(this.svg.getScreenCTM().inverse()); return {x:p.x, y:p.y};
};
Board.prototype.clearMarks = function(){ this.gMarks.replaceChildren(); };
Board.prototype.E = E;

/* ---- 선수 ---- */
function Actor(b, id, team, num, o){
  this.b = b; this.id = id; this.team = team; this.x = 0; this.y = 0; this.ang = team === 'red' ? 180 : 0;
  var t = TEAM[team], g = this.g = E('g', {'class':'actor'}, b.gActors);
  this.ringEl = E('circle', {r:1.45, fill:'none', stroke:'#ffd23f', 'stroke-width':.18, 'stroke-dasharray':'.55 .32', opacity:0}, g);
  E('ellipse', {cx:.24, cy:.34, rx:1.0, ry:.9, fill:'rgba(0,0,0,.26)'}, g);
  this.arms = [0,1].map(function(){ return E('line', {x1:0, y1:0, x2:0, y2:0, stroke:t.arm, 'stroke-width':.34, 'stroke-linecap':'round', opacity:0}, g); });
  this.rot = E('g', null, g);
  this.tagEls = [-1, 1].map(function(s){ return E('rect', {x:-.42, y:s * .82 - .2 + (s > 0 ? .06 : -.06), width:.62, height:.4, rx:.12, fill:'#ffd23f', stroke:'#7a5a00', 'stroke-width':.06}, this.rot); }, this);
  E('circle', {r:.82, fill:'url(#' + b.id + team + ')', stroke:t.edge, 'stroke-width':.09}, this.rot);
  E('path', {d:'M.86 -.36 L1.24 0 L.86 .36 Z', fill:t.edge}, this.rot);
  this.numEl = E('text', {x:0, y:.31, 'text-anchor':'middle', 'font-size':.82, 'font-weight':800, fill:'#fff'}, g);
  this.numEl.textContent = num != null ? num : '';
  this.raised = E('rect', {x:-.32, y:-2.05, width:.64, height:.38, rx:.1, fill:'#ffd23f', stroke:'#7a5a00', 'stroke-width':.06, opacity:0}, g);
  this.tags = [true, true];
  this.bub = null;
  if(o.label){
    var lb = E('text', {x:0, y:-1.35, 'text-anchor':'middle', 'font-size':.72, 'font-weight':800, fill:'#fff', stroke:'rgba(0,0,0,.55)', 'stroke-width':.18, 'paint-order':'stroke'}, g);
    lb.textContent = o.label; this.labelEl = lb;
  }
  this.face(this.ang);
}
Actor.prototype.pos = function(x, y){
  this.x = x; this.y = y; this.g.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + y.toFixed(3) + ')');
  if(this.bub) this.bub.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + (y - 2.2).toFixed(3) + ')');
};
Actor.prototype.face = function(a){ this.ang = a; this.rot.setAttribute('transform', 'rotate(' + a.toFixed(1) + ')' + (this.diving ? ' scale(1.5 .74)' : '')); };
Actor.prototype.setDive = function(on){ if(this.diving !== on){ this.diving = on; this.face(this.ang); } };
Actor.prototype.setTags = function(l, r){
  this.tags = [l, r];
  this.tagEls[0].style.display = l ? '' : 'none'; this.tagEls[1].style.display = r ? '' : 'none';
};
Actor.prototype.tagWorld = function(side){
  var a = this.ang * Math.PI / 180, ly = side ? .9 : -.9, lx = -.1;
  return {x:this.x + lx * Math.cos(a) - ly * Math.sin(a), y:this.y + lx * Math.sin(a) + ly * Math.cos(a)};
};
Actor.prototype.arm = function(side, tx, ty){
  var ln = this.arms[side];
  if(tx == null){ ln.setAttribute('opacity', 0); return; }
  var dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy) || 1, reach = Math.min(d, 2.0);
  ln.setAttribute('x1', (dx/d * .55).toFixed(3)); ln.setAttribute('y1', (dy/d * .55).toFixed(3));
  ln.setAttribute('x2', (dx/d * reach).toFixed(3)); ln.setAttribute('y2', (dy/d * reach).toFixed(3));
  ln.setAttribute('opacity', 1);
};
Actor.prototype.ring = function(on, color){
  this.ringEl.setAttribute('opacity', on ? 1 : 0);
  if(color) this.ringEl.setAttribute('stroke', color);
};
Actor.prototype.raise = function(on){ this.raised.setAttribute('opacity', on ? 1 : 0); };
Actor.prototype.say = function(text, tone){
  if(!text){ if(this.bub) this.bub.style.display = 'none'; return; }
  if(!this.bub){
    this.bub = E('g', {'pointer-events':'none'}, this.b.gFx);
    this.bubR = E('rect', {y:-.95, height:1.5, rx:.5, fill:'#fff', stroke:'rgba(0,0,0,.25)', 'stroke-width':.05}, this.bub);
    this.bubP = E('path', {d:'M-.3 .5 L0 1.05 L.3 .5 Z', fill:'#fff'}, this.bub);
    this.bubT = E('text', {x:0, y:.1, 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-size':.9, 'font-family':'Black Han Sans, Pretendard', fill:'#14201a'}, this.bub);
  }
  this.bub.style.display = '';
  if(this.bubT.textContent !== text){
    this.bubT.textContent = text;
    var w = Math.max(2.4, text.length * .92 + .9);
    this.bubR.setAttribute('x', -w/2); this.bubR.setAttribute('width', w);
  }
  this.bubR.setAttribute('fill', tone === 'foul' ? '#ffe3df' : tone === 'volt' ? '#ffd23f' : '#fff');
  this.bubP.setAttribute('fill', tone === 'foul' ? '#ffe3df' : tone === 'volt' ? '#ffd23f' : '#fff');
  this.pos(this.x, this.y);
};

/* ---- 공 ---- */
function Ball(b){
  var g = this.g = E('g', {'pointer-events':'none'}, b.gBall);
  this.sh = E('ellipse', {rx:.46, ry:.3, fill:'rgba(0,0,0,.3)'}, g);
  this.body = E('g', null, g);
  E('ellipse', {rx:.5, ry:.32, fill:'url(#' + b.id + 'ball)', stroke:'#65736b', 'stroke-width':.05}, this.body);
  E('path', {d:'M-.2 -.3 Q-.27 0 -.2 .3 M.2 -.3 Q.27 0 .2 .3', stroke:'#ffd23f', 'stroke-width':.09, fill:'none'}, this.body);
  E('path', {d:'M-.12 0 H.12 M-.08 -.06 V.06 M0 -.06 V.06 M.08 -.06 V.06', stroke:'#7b8a82', 'stroke-width':.035}, this.body);
}
Ball.prototype.set = function(x, y, rot, h){
  h = h || 0; rot = rot || 0;
  this.x = x; this.y = y;
  this.sh.setAttribute('cx', (x + .18 + h*.5).toFixed(3)); this.sh.setAttribute('cy', (y + .26 + h*.65).toFixed(3));
  this.sh.setAttribute('opacity', (1 - Math.min(.6, h*.35)).toFixed(2));
  this.body.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + (y - h).toFixed(3) + ') rotate(' + rot.toFixed(1) + ') scale(' + (1 + h*.22).toFixed(3) + ')');
};
Ball.prototype.show = function(on){ this.g.style.display = on ? '' : 'none'; };

/* ---- 장면 재생 ----
   scn = { dur, view?, actors:[{id,team,num,keys:[[t,x,y],...], tags:[1,1], label}],
           ball:[{on:id,t0,t1} | {from:id,to:id,t0,t1} | {from:id,xy:[x,y],t0,t1,drop:true} | {xy:[x,y],t0,t1}],
           events:[{t,type:'tag',who,side,by} | {t,type:'say',who,text,dur,tone} | {t,type:'raise',who,dur}
                   | {t,type:'arm',who,side,to:id|'tag0'|'tag1'|[x,y],until} | {t,type:'ring',who,until,color} | {t,type:'tagback',who}],
           marks:[{type:'passline',who,at} | {type:'offside',at,who,dist} | {type:'steps',who,t0,t1} | {type:'ring',who,at,color}
                  | {type:'arrow',from:[x,y],to:[x,y],color,label} | {type:'text',x,y,text,color} | {type:'ballpath',t0,t1}] } */
function Scene(board, scn, o){
  o = o || {};
  this.b = board; this.s = scn; this.t = 0; this.speed = 1; this.playing = false;
  this.loop = !!o.loop; this.marksOn = !!o.marks; this.hold = o.hold != null ? o.hold : 1.2;
  this.onEnd = o.onEnd || null; this.onTick = o.onTick || null;
  var self = this;
  this.A = {};
  scn.actors.forEach(function(a){
    var p = board.player(a.id, a.team, a.num, {label:a.label});
    self.A[a.id] = p;
  });
  this.ball = scn.ball ? board.ball() : null;
  this._mk = '';
  this.render(0);
}
Scene.prototype.def = function(id){ for(var i = 0; i < this.s.actors.length; i++) if(this.s.actors[i].id === id) return this.s.actors[i]; };
Scene.prototype.posAt = function(id, t){
  var k = this.def(id).keys;
  if(t <= k[0][0]) return {x:k[0][1], y:k[0][2]};
  for(var i = 0; i < k.length - 1; i++){
    if(t <= k[i+1][0]){
      var u = (t - k[i][0]) / Math.max(1e-6, k[i+1][0] - k[i][0]);
      return {x:lerp(k[i][1], k[i+1][1], u), y:lerp(k[i][2], k[i+1][2], u)};
    }
  }
  var l = k[k.length - 1]; return {x:l[1], y:l[2]};
};
Scene.prototype.ballSeg = function(t){
  var bs = this.s.ball; if(!bs) return null;
  for(var i = 0; i < bs.length; i++) if(t >= bs[i].t0 && t <= bs[i].t1) return bs[i];
  return t < bs[0].t0 ? bs[0] : bs[bs.length - 1];
};
Scene.prototype.holderAt = function(t){ var s = this.ballSeg(t); return s && s.on ? s.on : null; };
Scene.prototype.faceAt = function(id, t){
  var a = this.posAt(id, t - .08), c = this.posAt(id, t + .08), dx = c.x - a.x, dy = c.y - a.y;
  if(Math.hypot(dx, dy) > .05) return Math.atan2(dy, dx) * 180 / Math.PI;
  var d = this.def(id), me = this.posAt(id, t), bp = this.ballPos(t);
  if(bp && this.holderAt(t) !== id && Math.hypot(bp.x - me.x, bp.y - me.y) > .5) return Math.atan2(bp.y - me.y, bp.x - me.x) * 180 / Math.PI;
  return d.face != null ? d.face : (d.team === 'red' ? 180 : 0);
};
Scene.prototype.carry = function(id, t){
  var p = this.posAt(id, t), a = this._faceNoBall(id, t) * Math.PI / 180;
  return {x:p.x + Math.cos(a) * .55 + Math.cos(a + Math.PI/2) * .55, y:p.y + Math.sin(a) * .55 + Math.sin(a + Math.PI/2) * .55, rot:this._faceNoBall(id, t) + 90};
};
Scene.prototype._faceNoBall = function(id, t){
  var a = this.posAt(id, t - .08), c = this.posAt(id, t + .08), dx = c.x - a.x, dy = c.y - a.y;
  if(Math.hypot(dx, dy) > .05) return Math.atan2(dy, dx) * 180 / Math.PI;
  var d = this.def(id); return d.face != null ? d.face : (d.team === 'red' ? 180 : 0);
};
Scene.prototype.ballPos = function(t){
  var s = this.ballSeg(t); if(!s) return null;
  if(s.on){ var c = this.carry(s.on, t); return {x:c.x, y:c.y, rot:c.rot, h:0}; }
  if(!s.from && !s.xy0){ return {x:s.xy[0], y:s.xy[1], rot:s.rot || 20, h:0}; }
  var u = clamp((t - s.t0) / Math.max(1e-6, s.t1 - s.t0), 0, 1);
  var p0 = s.from ? this.carry(s.from, s.t0) : {x:s.xy0[0], y:s.xy0[1]};
  var p1 = s.to ? this.carry(s.to, s.t1) : {x:s.xy[0], y:s.xy[1]};
  var x = lerp(p0.x, p1.x, u), y = lerp(p0.y, p1.y, u);
  var dir = Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
  if(s.place){ return {x:x, y:y, rot:dir, h:.7 * (1 - u)}; }
  if(s.kick){ return {x:x, y:y, rot:dir + u * 720, h:2.2 * Math.sin(Math.PI * u)}; }
  if(s.drop){
    var h = u < .55 ? 1.1 * (1 - Math.pow(u/.55, 2)) * (1 - u) : .35 * Math.sin(Math.PI * (u - .55) / .45);
    return {x:x, y:y, rot:dir + u * 620, h:Math.max(0, h)};
  }
  return {x:x, y:y, rot:dir, h:1.3 * Math.sin(Math.PI * u)};
};
Scene.prototype.render = function(t){
  var s = this.s, self = this, ev = s.events || [];
  this.t = t;
  s.actors.forEach(function(d){
    var a = self.A[d.id], p = self.posAt(d.id, t);
    a.pos(p.x, p.y); a.face(self.faceAt(d.id, t));
    var tg = d.tags ? [!!d.tags[0], !!d.tags[1]] : [true, true];
    var bubble = null, tone = null, raised = false, ring = null, dive = false;
    var arms = [null, null];
    ev.forEach(function(e){
      if(e.t > t) return;
      if(e.who !== d.id) return;
      if(e.type === 'tag') tg[e.side] = false;
      if(e.type === 'tagback') tg = [true, true];
      if(e.type === 'dive' && t < (e.until != null ? e.until : 1e9)) dive = true;
      if(e.type === 'say' && t < e.t + (e.dur || 1.4)){ bubble = e.text; tone = e.tone; }
      if(e.type === 'raise' && t < e.t + (e.dur || 1.4)) raised = true;
      if(e.type === 'ring' && t < (e.until != null ? e.until : 1e9)) ring = e.color || '#ffd23f';
      if(e.type === 'arm'){ arms[e.side || 0] = (e.until == null || t < e.until) ? e : null; }
    });
    a.setDive(dive); a.face(self.faceAt(d.id, t));
    a.setTags(tg[0], tg[1]); a.say(bubble, tone); a.raise(raised); a.ring(!!ring, ring);
    [0,1].forEach(function(side){
      var e = arms[side];
      if(!e){ a.arm(side, null); return; }
      var tgt;
      if(typeof e.to === 'string' && /^tag[01]$/.test(e.to)){ tgt = a.tagWorld(+e.to[3]); }
      else if(typeof e.to === 'string'){ tgt = self.posAt(e.to, t); }
      else tgt = {x:e.to[0], y:e.to[1]};
      a.arm(side, tgt.x, tgt.y);
    });
  });
  if(this.ball){ var bp = this.ballPos(t); this.ball.set(bp.x, bp.y, bp.rot, bp.h); }
  this.drawMarks(t);
  if(this.onTick) this.onTick(t);
};
Scene.prototype.drawMarks = function(t){
  var on = this.marksOn ? (this.s.marks || []).filter(function(m){ var at = m.at != null ? m.at : (m.t0 != null ? m.t0 : 0); return t >= at; }) : [];
  var key = on.length + ':' + on.map(function(m){ return m.type; }).join(',');
  if(key === this._mk) return;
  this._mk = key;
  var b = this.b, g = b.gMarks, self = this, L = b.L, W = b.W, IG = b.IG, TOP = Math.max(1.6, b.view.y + 1.6), BOT = Math.min(W - 1.2, b.view.y + b.view.h - 1.2);
  g.replaceChildren();
  on.forEach(function(m){
    if(m.type === 'passline'){
      var p = self.ballPos(m.at), x = p.x;
      E('rect', {x:x, y:0, width:L + IG - x, height:W, fill:'rgba(223,74,47,.26)'}, g);
      E('rect', {x:-IG, y:0, width:x + IG, height:W, fill:'rgba(255,255,255,.08)'}, g);
      E('line', {x1:x, y1:0, x2:x, y2:W, stroke:'#fff', 'stroke-width':.2, 'stroke-dasharray':'.6 .35'}, g);
      label(x + .5, m.ly != null ? m.ly : TOP, '앞 (상대 인골 쪽) →', '#ffe1da', 'start');
      label(x - .5, m.ly != null ? m.ly : TOP, '← 뒤', '#ffffff', 'end');
    }
    if(m.type === 'offside'){
      var bp = self.ballPos(m.at), lx = bp.x + (m.dist || 3);
      E('rect', {x:bp.x, y:0, width:lx - bp.x, height:W, fill:'rgba(223,74,47,.22)'}, g);
      E('line', {x1:lx, y1:0, x2:lx, y2:W, stroke:'#ffd23f', 'stroke-width':.22, 'stroke-dasharray':'.7 .4'}, g);
      E('line', {x1:bp.x, y1:0, x2:bp.x, y2:W, stroke:'rgba(255,255,255,.6)', 'stroke-width':.12, 'stroke-dasharray':'.3 .3'}, g);
      label((bp.x + lx) / 2, m.ly != null ? m.ly : BOT, (m.dist || 3) + 'm', '#ffd23f', 'middle');
      label(lx + .4, m.ly2 != null ? m.ly2 : TOP, '수비는 이 선 뒤로', '#ffd23f', 'start');
    }
    if(m.type === 'steps'){
      var last = self.posAt(m.who, m.t0), acc = 0, n = 0;
      for(var tt = m.t0; tt <= m.t1 + 1e-6; tt += .02){
        var p2 = self.posAt(m.who, tt); acc += Math.hypot(p2.x - last.x, p2.y - last.y); last = p2;
        if(acc >= .8){ acc = 0; n++;
          E('circle', {cx:p2.x, cy:p2.y + (n % 2 ? .35 : -.35), r:.26, fill:n > 3 ? '#ff6b52' : '#ffffff', stroke:'rgba(0,0,0,.35)', 'stroke-width':.05}, g);
        }
      }
      var pe = self.posAt(m.who, m.t1);
      label(pe.x, pe.y + 2.3, n + '걸음', n > 3 ? '#ffb4a6' : '#ffffff', 'middle');
    }
    if(m.type === 'ring'){
      var pr = m.who ? self.posAt(m.who, m.at) : {x:m.x, y:m.y};
      E('circle', {cx:pr.x, cy:pr.y, r:m.r || 1.9, fill:'none', stroke:m.color || '#ff6b52', 'stroke-width':.24}, g);
    }
    if(m.type === 'arrow') arrow(m.from, m.to, m.color || '#ffd23f', m.label);
    if(m.type === 'text') label(m.x, m.y, m.text, m.color || '#fff', m.anchor || 'middle', m.size);
    if(m.type === 'ballpath'){
      var pts = [];
      for(var t2 = m.t0; t2 <= m.t1 + 1e-6; t2 += .05){ var q = self.ballPos(t2); pts.push(q.x.toFixed(2) + ',' + q.y.toFixed(2)); }
      E('polyline', {points:pts.join(' '), fill:'none', stroke:m.color || '#ffd23f', 'stroke-width':.18, 'stroke-dasharray':'.35 .25'}, g);
    }
  });
  function label(x, y, text, color, anchor, size){
    var tx = E('text', {x:x, y:y, 'text-anchor':anchor || 'middle', 'dominant-baseline':'middle', 'font-size':size || .95, 'font-family':'Black Han Sans, Pretendard', fill:color, stroke:'rgba(0,0,0,.55)', 'stroke-width':.22, 'paint-order':'stroke'}, g);
    tx.textContent = text;
  }
  function arrow(a, c, color, text){
    var dx = c[0] - a[0], dy = c[1] - a[1], d = Math.hypot(dx, dy) || 1, ux = dx/d, uy = dy/d;
    E('line', {x1:a[0], y1:a[1], x2:c[0] - ux*.5, y2:c[1] - uy*.5, stroke:color, 'stroke-width':.22, 'stroke-linecap':'round'}, g);
    E('path', {d:'M' + c[0] + ' ' + c[1] + ' L' + (c[0] - ux*.8 - uy*.45) + ' ' + (c[1] - uy*.8 + ux*.45) + ' L' + (c[0] - ux*.8 + uy*.45) + ' ' + (c[1] - uy*.8 - ux*.45) + ' Z', fill:color}, g);
    if(text) label((a[0] + c[0]) / 2, (a[1] + c[1]) / 2 - .8, text, color, 'middle');
  }
};
Scene.prototype.play = function(speed){
  var self = this;
  if(speed != null) this.speed = speed;
  if(this.t >= this.s.dur - 1e-3) this.t = 0;
  this.playing = true;
  var last = performance.now(), wait = 0;
  cancelAnimationFrame(this._raf);
  function step(now){
    if(!self.playing) return;
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    if(wait > 0){ wait -= dt; if(wait <= 0){ self.render(0); } self._raf = requestAnimationFrame(step); return; }
    var t = self.t + dt * self.speed;
    if(t >= self.s.dur){
      self.render(self.s.dur);
      if(self.loop){ wait = self.hold; self.t = 0; self._raf = requestAnimationFrame(step); return; }
      self.playing = false; if(self.onEnd) self.onEnd(); return;
    }
    self.render(t);
    self._raf = requestAnimationFrame(step);
  }
  this._raf = requestAnimationFrame(step);
};
Scene.prototype.pause = function(){ this.playing = false; cancelAnimationFrame(this._raf); };
Scene.prototype.seek = function(t){ this.render(clamp(t, 0, this.s.dur)); };
Scene.prototype.setMarks = function(on){ this.marksOn = on; this._mk = ''; this.render(this.t); };

window.PB = {Board:Board, Scene:Scene, E:E, lerp:lerp, clamp:clamp, TEAM:TEAM};

/* 화면에 보일 때만 반복 재생하는 작은 장면 */
PB.loopWhenVisible = function(scene, el){
  var vis = false;
  function check(){
    var r = el.getBoundingClientRect();
    var v = r.width > 0 && r.right > 4 && r.left < window.innerWidth - 4 && r.bottom > 0 && r.top < window.innerHeight;
    if(v && !vis){ vis = true; if(!PE.reduce) scene.play(); else scene.seek(scene.s.dur); }
    if(!v && vis){ vis = false; scene.pause(); }
  }
  setInterval(check, 400); check();
};
})();
