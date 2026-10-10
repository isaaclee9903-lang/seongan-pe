/* ===== 티볼 경기장: 위에서 내려다본 다이아몬드, 선수, 공, 장면 재생 =====
   좌표는 m 단위(SVG 좌표 그대로). 홈플레이트 끝점이 (0, 0), 2루 쪽이 위(-y).
   1루는 오른쪽 위, 3루는 왼쪽 위. 파울라인은 홈에서 ±45도. */
(function(){
var NS = 'http://www.w3.org/2000/svg';
function E(tag, attrs, parent){
  var e = document.createElementNS(NS, tag);
  if(attrs) for(var k in attrs) e.setAttribute(k, attrs[k]);
  if(parent) parent.appendChild(e);
  return e;
}
function lerp(a, b, u){ return a + (b - a) * u; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function ease(u){ return u < .5 ? 2*u*u : 1 - Math.pow(-2*u + 2, 2) / 2; }
var uid = 0;
var R2 = Math.SQRT1_2;

var TEAM = {
  blue: {c1:'#6ea2ff', c2:'#1a4fb8', edge:'#0f2f73'},
  red:  {c1:'#ff8a6b', c2:'#b0301d', edge:'#6e170b'},
  ump:  {c1:'#3b4a43', c2:'#141d19', edge:'#000'}
};

/* 수비 위치 10명(대구광역시티볼협회 규칙 그림을 바탕으로 18.29 m 경기장에 맞춘 대략의 자리) */
var POS = {
  C:   {name:'본루수', x:0, y:3.5},
  '1B':{name:'1루수', x:13.6, y:-14.6},
  '2B':{name:'2루수', x:7.2, y:-22.2},
  '3B':{name:'3루수', x:-13.6, y:-14.6},
  '1SS':{name:'제1유격수', x:-7.2, y:-22.2},
  '2SS':{name:'제2유격수', x:2.8, y:-15.4},
  LF:  {name:'좌익수', x:-21, y:-31},
  '1CF':{name:'제1중견수', x:-7, y:-38},
  '2CF':{name:'제2중견수', x:7, y:-38},
  RF:  {name:'우익수', x:21, y:-31}
};

function Field(svg, o){
  o = o || {};
  this.svg = svg; this.D = o.base || 18.29; this.F = o.fence || 45; this.S = o.size || 1;
  var D = this.D;
  this.B = {H:[0,0], 1:[D*R2, -D*R2], 2:[0, -D*2*R2], 3:[-D*R2, -D*R2]};
  var v = o.view || {x:-this.F*R2 - 4, y:-this.F - 4, w:this.F*2*R2 + 8, h:this.F + 10};
  this.view = v;
  svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h);
  svg.setAttribute('preserveAspectRatio', o.par || 'xMidYMid meet');
  svg.classList.add('board');
  var id = this.id = 'fd' + (++uid);
  var d = E('defs', null, svg);
  function rg(name, c1, c2, cx, cy){
    var g = E('radialGradient', {id:id + name, cx:cx || '.36', cy:cy || '.3', r:'.78'}, d);
    E('stop', {offset:'0', 'stop-color':c1}, g); E('stop', {offset:'1', 'stop-color':c2}, g);
  }
  rg('blue', TEAM.blue.c1, TEAM.blue.c2); rg('red', TEAM.red.c1, TEAM.red.c2); rg('ump', TEAM.ump.c1, TEAM.ump.c2);
  rg('ball', '#ffffff', '#d9ddc8', '.38', '.3');
  var vg = E('radialGradient', {id:id + 'vig', cx:'.5', cy:'.6', r:'.8'}, d);
  E('stop', {offset:'.6', 'stop-color':'#000', 'stop-opacity':'0'}, vg); E('stop', {offset:'1', 'stop-color':'#000', 'stop-opacity':'.25'}, vg);
  var dirt = E('linearGradient', {id:id + 'dirt', x1:'0', y1:'0', x2:'0', y2:'1'}, d);
  E('stop', {offset:'0', 'stop-color':'#c9925c'}, dirt); E('stop', {offset:'1', 'stop-color':'#b97e48'}, dirt);
  this.gTurf = E('g', null, svg);
  this.gZone = E('g', null, svg);
  this.gMarks = E('g', null, svg);
  this.gActors = E('g', null, svg);
  this.gBall = E('g', null, svg);
  this.gFx = E('g', null, svg);
  this.actors = {};
  this.draw(o);
}
Field.prototype.draw = function(o){
  var g = this.gTurf, id = this.id, D = this.D, F = this.F, B = this.B, v = this.view;
  var pad = 60;
  E('rect', {x:v.x - pad, y:v.y - pad, width:v.w + 2*pad, height:v.h + 2*pad, fill:'#1b6340'}, g);
  /* 페어 지역 잔디: 부채꼴 */
  var fx = F * R2, fy = -F * R2;
  var fan = 'M0 0 L' + (-fx) + ' ' + fy + ' A' + F + ' ' + F + ' 0 0 1 ' + fx + ' ' + fy + ' Z';
  E('path', {d:fan, fill:'#2c8752'}, g);
  /* 잔디 무늬 (동심원 띠) */
  var clip = E('clipPath', {id:id + 'fan'}, g);
  E('path', {d:fan}, clip);
  var stripes = E('g', {'clip-path':'url(#' + id + 'fan)'}, g);
  for(var r = 4; r < F; r += 4){
    if((r / 4) % 2) E('circle', {cx:0, cy:0, r:r + 2, fill:'none', stroke:'#33935b', 'stroke-width':2}, stripes);
  }
  /* 내야 흙 */
  var ir = D * 1.12;
  E('path', {d:'M0 2.6 L' + (-ir*R2 - 1.2) + ' ' + (-ir*R2 + 1.2) + ' A' + (D*1.55) + ' ' + (D*1.55) + ' 0 0 1 ' + (ir*R2 + 1.2) + ' ' + (-ir*R2 + 1.2) + ' Z', fill:'url(#' + id + 'dirt)', opacity:.92}, g);
  /* 안쪽 잔디 */
  var ii = D * .78;
  E('path', {d:'M0 ' + (-D*.2) + ' L' + (-ii*R2) + ' ' + (-ii*R2 - D*.2*R2) + ' L0 ' + (-ii*2*R2) + ' L' + (ii*R2) + ' ' + (-ii*R2 - D*.2*R2) + ' Z', fill:'#2f8b55'}, g);
  /* 주로(베이스 사이 흙길)는 흙 위에 이미 포함. 파울라인 */
  var ln = {stroke:'#f3f6ee', 'stroke-width':.22, 'stroke-linecap':'round', fill:'none'};
  E('line', Object.assign({x1:0, y1:0, x2:-fx, y2:fy}, ln), g);
  E('line', Object.assign({x1:0, y1:0, x2:fx, y2:fy}, ln), g);
  /* 담장 */
  E('path', {d:'M' + (-fx) + ' ' + fy + ' A' + F + ' ' + F + ' 0 0 1 ' + fx + ' ' + fy, fill:'none', stroke:'#ffd23f', 'stroke-width':.5, opacity:.85}, g);
  /* 타자 서클 (반지름 3 m) */
  this.circleEl = E('circle', {cx:0, cy:0, r:3, fill:'rgba(255,255,255,.08)', stroke:'#f3f6ee', 'stroke-width':.16}, g);
  /* 베이스 */
  var bs = 1.15;
  [1,2,3].forEach(function(k){
    var p = B[k];
    E('rect', {x:p[0] - bs/2, y:p[1] - bs/2, width:bs, height:bs, fill:'#fff', stroke:'#6b5a44', 'stroke-width':.08, transform:'rotate(45 ' + p[0] + ' ' + p[1] + ')'}, g);
  });
  /* 홈플레이트 (오각형, 끝점이 원점) */
  E('path', {d:'M0 0 L-.55 -.55 L-.55 -1.1 L.55 -1.1 L.55 -.55 Z', fill:'#fff', stroke:'#6b5a44', 'stroke-width':.07}, g);
  /* 배팅티: 홈플레이트 뒤 */
  this.teeG = E('g', {transform:'translate(0 .6)'}, g);
  E('circle', {r:.42, fill:'#202826', stroke:'#000', 'stroke-width':.05}, this.teeG);
  E('circle', {r:.18, fill:'#ff8a1f'}, this.teeG);
  if(o.labels){
    var tl = {'text-anchor':'middle', 'font-size':1.5 * this.S, 'font-family':'Black Han Sans, Pretendard', fill:'rgba(255,255,255,.9)', stroke:'rgba(0,0,0,.45)', 'stroke-width':.3, 'paint-order':'stroke'};
    var S = this.S;
    [['1', '1루', 2.4, 1.2], ['2', '2루', 0, -1.7], ['3', '3루', -2.4, 1.2]].forEach(function(a){
      var p = B[a[0]], t = E('text', Object.assign({x:p[0] + a[2] * S, y:p[1] + a[3] * S}, tl), g); t.textContent = a[1];
    });
    var th = E('text', Object.assign({x:3.6 * S, y:1.9}, tl), g); th.textContent = '홈';
  }
  if(o.foulLabels){
    var fl = {'font-size':1.3 * this.S, 'font-family':'Black Han Sans, Pretendard', fill:'rgba(255,255,255,.55)', 'text-anchor':'middle'};
    var a = E('text', Object.assign({x:-fx * .62 - 3.2, y:fy * .62 + 1.0, transform:'rotate(45 ' + (-fx * .62 - 3.2) + ' ' + (fy * .62 + 1.0) + ')'}, fl), g); a.textContent = '파울 지역';
    var b = E('text', Object.assign({x:fx * .62 + 3.2, y:fy * .62 + 1.0, transform:'rotate(-45 ' + (fx * .62 + 3.2) + ' ' + (fy * .62 + 1.0) + ')'}, fl), g); b.textContent = '파울 지역';
    var c = E('text', Object.assign({x:0, y:-F * .72}, fl, {fill:'rgba(255,255,255,.5)'}), g); c.textContent = '페어 지역';
  }
  E('rect', {x:v.x - pad, y:v.y - pad, width:v.w + 2*pad, height:v.h + 2*pad, fill:'url(#' + id + 'vig)', 'pointer-events':'none'}, g);
};
Field.prototype.tee = function(on){ this.teeG.style.display = on === false ? 'none' : ''; };
/* 페어 판정: 파울라인 위는 페어. 타자 서클 안(서클 라인은 페어)에 멈추면 파울 */
Field.prototype.isFair = function(x, y, lineW){
  var w = (lineW == null ? .05 : lineW) / 2;
  if(-y < -w) return false;
  var off = Math.abs(x) * R2 - (-y) * R2;
  return off <= w;
};
Field.prototype.inCircle = function(x, y){ return Math.hypot(x, y) < 3 - .025; };
Field.prototype.base = function(k){ return this.B[k]; };
Field.prototype.player = function(id, team, label, o){ var a = new Actor(this, id, team, label, o || {}); this.actors[id] = a; return a; };
Field.prototype.ball = function(){ return this._ball || (this._ball = new Ball(this)); };
Field.prototype.toLocal = function(ev){
  var pt = this.svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
  var p = pt.matrixTransform(this.svg.getScreenCTM().inverse()); return {x:p.x, y:p.y};
};
Field.prototype.clearMarks = function(){ this.gMarks.replaceChildren(); };
Field.prototype.zone = function(d, fill){ return E('path', {d:d, fill:fill}, this.gZone); };
Field.prototype.label = function(x, y, text, color, anchor, size, parent){
  var t = E('text', {x:x, y:y, 'text-anchor':anchor || 'middle', 'dominant-baseline':'middle', 'font-size':(size || 1.3) * this.S, 'font-family':'Black Han Sans, Pretendard', fill:color || '#fff', stroke:'rgba(0,0,0,.6)', 'stroke-width':.32 * this.S, 'paint-order':'stroke'}, parent || this.gMarks);
  t.textContent = text; return t;
};
Field.prototype.arrow = function(a, c, color, text, parent, dash){
  var g = parent || this.gMarks, s = this.S;
  var dx = c[0] - a[0], dy = c[1] - a[1], d = Math.hypot(dx, dy) || 1, ux = dx/d, uy = dy/d;
  E('line', {x1:a[0], y1:a[1], x2:c[0] - ux*.7*s, y2:c[1] - uy*.7*s, stroke:color, 'stroke-width':.3*s, 'stroke-linecap':'round', 'stroke-dasharray':dash || 'none'}, g);
  E('path', {d:'M' + c[0] + ' ' + c[1] + ' L' + (c[0] - ux*1.1*s - uy*.6*s) + ' ' + (c[1] - uy*1.1*s + ux*.6*s) + ' L' + (c[0] - ux*1.1*s + uy*.6*s) + ' ' + (c[1] - uy*1.1*s - ux*.6*s) + ' Z', fill:color}, g);
  if(text) this.label((a[0] + c[0]) / 2 - uy * 1.4 * s, (a[1] + c[1]) / 2 + ux * 1.4 * s, text, color, 'middle', 1.1, g);
};
Field.prototype.E = E;

/* ---- 선수 ---- */
function Actor(f, id, team, label, o){
  this.f = f; this.id = id; this.team = team; this.x = 0; this.y = 0;
  var s = f.S * (o.scale || 1);
  this.s = s;
  var t = TEAM[team], g = this.g = E('g', {'class':'actor'}, f.gActors);
  this.ringEl = E('circle', {r:1.5*s, fill:'none', stroke:'#ffd23f', 'stroke-width':.2*s, 'stroke-dasharray':(.6*s) + ' ' + (.34*s), opacity:0}, g);
  E('ellipse', {cx:.22*s, cy:.32*s, rx:.95*s, ry:.85*s, fill:'rgba(0,0,0,.26)'}, g);
  this.bat = E('line', {x1:0, y1:0, x2:0, y2:0, stroke:'#ffcf5a', 'stroke-width':.34*s, 'stroke-linecap':'round', opacity:0}, g);
  this.glove = E('circle', {r:.42*s, fill:'#8a4f22', stroke:'#4a2a10', 'stroke-width':.06*s, opacity:0}, g);
  this.body = E('g', null, g);
  E('circle', {r:.8*s, fill:'url(#' + f.id + team + ')', stroke:t.edge, 'stroke-width':.09*s}, this.body);
  this.numEl = E('text', {x:0, y:.3*s, 'text-anchor':'middle', 'font-size':(label && String(label).length > 2 ? .58 : .78)*s, 'font-weight':800, fill:'#fff'}, this.body);
  this.numEl.textContent = label != null ? label : '';
  this.bub = null;
  if(o.name){
    var lb = E('text', {x:0, y:-1.3*s, 'text-anchor':'middle', 'font-size':.7*s, 'font-weight':800, fill:'#fff', stroke:'rgba(0,0,0,.55)', 'stroke-width':.18*s, 'paint-order':'stroke'}, g);
    lb.textContent = o.name;
  }
  if(o.glove) this.glove.setAttribute('opacity', 1);
  this.setGlove(o.glove ? 30 : null);
}
Actor.prototype.pos = function(x, y){
  this.x = x; this.y = y; this.g.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + y.toFixed(3) + ')');
  if(this.bub) this.bub.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + (y - 2.9*this.s).toFixed(3) + ')');
};
Actor.prototype.setGlove = function(ang){
  if(ang == null){ this.glove.setAttribute('opacity', 0); return; }
  var a = ang * Math.PI / 180, s = this.s;
  this.glove.setAttribute('cx', (Math.cos(a) * .95 * s).toFixed(3)); this.glove.setAttribute('cy', (Math.sin(a) * .95 * s).toFixed(3));
  this.glove.setAttribute('opacity', 1);
};
/* 스윙: u 0 → 1, 배트가 몸 뒤(3루 쪽)에서 앞(투수 방향)으로 돈다 */
Actor.prototype.swing = function(u, dir){
  if(u == null){ this.bat.setAttribute('opacity', 0); return; }
  var s = this.s, a0 = 160, a1 = -60, a = (lerp(a0, a1, u) + (dir || 0)) * Math.PI / 180;
  this.bat.setAttribute('x1', (Math.cos(a) * .6 * s).toFixed(3)); this.bat.setAttribute('y1', (-Math.sin(a) * .6 * s).toFixed(3));
  this.bat.setAttribute('x2', (Math.cos(a) * 2.2 * s).toFixed(3)); this.bat.setAttribute('y2', (-Math.sin(a) * 2.2 * s).toFixed(3));
  this.bat.setAttribute('opacity', 1);
};
/* 슬라이딩: 몸을 미끄러지는 방향으로 납작하게 */
Actor.prototype.slide = function(ang){
  if(ang == null){ if(this._sl){ this.body.removeAttribute('transform'); this._sl = false; } return; }
  this.body.setAttribute('transform', 'rotate(' + ang.toFixed(1) + ') scale(1.55 .7)'); this._sl = true;
};
Actor.prototype.ring = function(on, color){
  this.ringEl.setAttribute('opacity', on ? 1 : 0);
  if(color) this.ringEl.setAttribute('stroke', color);
};
Actor.prototype.say = function(text, tone){
  var s = this.s;
  if(!text){ if(this.bub) this.bub.style.display = 'none'; return; }
  if(!this.bub){
    this.bub = E('g', {'pointer-events':'none'}, this.f.gFx);
    this.bubR = E('rect', {y:-.95*s, height:1.55*s, rx:.5*s, fill:'#fff', stroke:'rgba(0,0,0,.25)', 'stroke-width':.05*s}, this.bub);
    this.bubP = E('path', {d:'M' + (-.3*s) + ' ' + (.55*s) + ' L0 ' + (1.1*s) + ' L' + (.3*s) + ' ' + (.55*s) + ' Z', fill:'#fff'}, this.bub);
    this.bubT = E('text', {x:0, y:.1*s, 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-size':.95*s, 'font-family':'Black Han Sans, Pretendard', fill:'#14201a'}, this.bub);
  }
  this.bub.style.display = '';
  if(this.bubT.textContent !== text){
    this.bubT.textContent = text;
    var w = Math.max(2.6, text.length * .98 + 1) * s;
    this.bubR.setAttribute('x', -w/2); this.bubR.setAttribute('width', w);
  }
  var fill = tone === 'foul' ? '#ffe3df' : tone === 'volt' ? '#ffd23f' : tone === 'ok' ? '#dcf5e5' : '#fff';
  this.bubR.setAttribute('fill', fill); this.bubP.setAttribute('fill', fill);
  this.pos(this.x, this.y);
};
Actor.prototype.remove = function(){ this.g.remove(); if(this.bub) this.bub.remove(); delete this.f.actors[this.id]; };

/* ---- 공 (h: 높이 m. 위에서 본 그림이라 그림자와 공 사이를 벌려 높이를 보여 준다) ---- */
function Ball(f){
  var s = f.S, g = this.g = E('g', {'pointer-events':'none'}, f.gBall);
  this.f = f;
  this.trail = E('polyline', {points:'', fill:'none', stroke:'rgba(255,255,255,.55)', 'stroke-width':.18*s, 'stroke-dasharray':(.3*s) + ' ' + (.3*s), 'stroke-linecap':'round'}, g);
  this.sh = E('ellipse', {rx:.42*s, ry:.3*s, fill:'rgba(0,0,0,.32)'}, g);
  this.body = E('g', null, g);
  E('circle', {r:.42*s, fill:'url(#' + f.id + 'ball)', stroke:'#7d8473', 'stroke-width':.05*s}, this.body);
  E('path', {d:'M' + (-.22*s) + ' ' + (-.34*s) + ' Q' + (-.05*s) + ' 0 ' + (-.22*s) + ' ' + (.34*s) + ' M' + (.22*s) + ' ' + (-.34*s) + ' Q' + (.05*s) + ' 0 ' + (.22*s) + ' ' + (.34*s), stroke:'#df4a2f', 'stroke-width':.07*s, fill:'none'}, this.body);
  this.pts = [];
}
Ball.prototype.set = function(x, y, h){
  h = Math.max(0, h || 0);
  var s = this.f.S, lift = h * .55, sc = 1 + Math.min(1.2, h * .07);
  this.x = x; this.y = y; this.h = h;
  this.sh.setAttribute('cx', (x + .1).toFixed(3)); this.sh.setAttribute('cy', (y + .15).toFixed(3));
  this.sh.setAttribute('opacity', (1 - Math.min(.65, h * .05)).toFixed(2));
  this.body.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + (y - lift).toFixed(3) + ') scale(' + sc.toFixed(3) + ')');
};
Ball.prototype.show = function(on){ this.g.style.display = on ? '' : 'none'; };
Ball.prototype.setTrail = function(pts){ this.trail.setAttribute('points', pts.map(function(p){ return p[0].toFixed(2) + ',' + p[1].toFixed(2); }).join(' ')); };

/* ---- 장면 재생 ----
   scn = { dur,
     actors:[{id, team, label, keys:[[t, x, y] | [t, '1'|'2'|'3'|'H'] ...], glove:true, name}],
     ball:[{t0, t1, on:id} | {t0, t1, from:P, to:P, kind:'fly'|'ground'|'line'|'throw'|'roll', peak, bounces}],
        P = [x, y] | 'tee' | actorId | '1'..'3','H'  (actorId면 그 시각의 선수 위치)
     events:[{t, type:'say', who, text, tone, dur} | {t, type:'swing', who, dur, dir} | {t, type:'ring', who, until, color} | {t, type:'slide', who, until}
             | {t, type:'call', text, tone, x, y, dur} | {t, type:'base', base, color, dur}],
     marks:[{type:'arrow', from, to, color, label, at} | {type:'text', x, y, text, color, at} | {type:'force', bases:[..], at}
            | {type:'lane', from:'1', to:'2', at} | {type:'ring', x, y, r, color, at} | {type:'trail', t0, t1, at}] } */
function Scene(field, scn, o){
  o = o || {};
  this.f = field; this.s = scn; this.t = 0; this.speed = 1; this.playing = false;
  this.loop = !!o.loop; this.marksOn = !!o.marks; this.hold = o.hold != null ? o.hold : 1.4;
  this.onEnd = o.onEnd || null; this.onTick = o.onTick || null;
  var self = this;
  this.A = {};
  scn.actors.forEach(function(a){ self.A[a.id] = field.player(a.id, a.team, a.label, {glove:a.glove, name:a.name, scale:a.scale}); });
  this.ball = scn.ball ? field.ball() : null;
  this.callG = E('g', {'pointer-events':'none'}, field.gFx);
  this._mk = '';
  this.render(0);
}
Scene.prototype.pt = function(p, t){
  var B = this.f.B;
  if(Array.isArray(p)) return {x:p[0], y:p[1]};
  if(p === 'tee') return {x:0, y:.6};
  if(B[p]) return {x:B[p][0], y:B[p][1]};
  return this.posAt(p, t);
};
Scene.prototype.def = function(id){ for(var i = 0; i < this.s.actors.length; i++) if(this.s.actors[i].id === id) return this.s.actors[i]; };
Scene.prototype.key = function(k){
  if(typeof k[1] === 'string'){ var b = this.f.B[k[1]]; return [k[0], b[0], b[1]]; }
  return k;
};
Scene.prototype.posAt = function(id, t){
  var d = this.def(id); if(!d) return {x:0, y:0};
  var ks = d.keys.map(this.key, this);
  if(t <= ks[0][0]) return {x:ks[0][1], y:ks[0][2]};
  for(var i = 0; i < ks.length - 1; i++){
    if(t <= ks[i+1][0]){
      var u = (t - ks[i][0]) / Math.max(1e-6, ks[i+1][0] - ks[i][0]);
      /* 베이스를 도는 주자는 베이스 사이를 바깥으로 살짝 휘게 */
      var x = lerp(ks[i][1], ks[i+1][1], u), y = lerp(ks[i][2], ks[i+1][2], u);
      return {x:x, y:y};
    }
  }
  var l = ks[ks.length - 1]; return {x:l[1], y:l[2]};
};
Scene.prototype.ballSeg = function(t){
  var bs = this.s.ball; if(!bs) return null;
  for(var i = 0; i < bs.length; i++) if(t >= bs[i].t0 && t <= bs[i].t1) return bs[i];
  if(t < bs[0].t0) return {hold:true, at:bs[0]};
  var last = null; for(var j = 0; j < bs.length; j++) if(bs[j].t1 <= t) last = bs[j];
  return {after:true, seg:last};
};
Scene.prototype.segPos = function(s, t){
  if(s.on){ var p = this.posAt(s.on, t); return {x:p.x + .7*this.f.S, y:p.y - .5*this.f.S, h:.6}; }
  var u = clamp((t - s.t0) / Math.max(1e-6, s.t1 - s.t0), 0, 1);
  var p0 = this.pt(s.from, s.t0), p1 = this.pt(s.to, s.t1);
  var ue = s.kind === 'roll' ? 1 - Math.pow(1 - u, 1.8) : s.kind === 'ground' ? 1 - Math.pow(1 - u, 1.3) : u;
  var x = lerp(p0.x, p1.x, ue), y = lerp(p0.y, p1.y, ue), h = 0;
  var pk = s.peak != null ? s.peak : (s.kind === 'fly' ? 14 : s.kind === 'line' ? 2.4 : s.kind === 'throw' ? 1.6 : 0);
  var h0 = s.h0 != null ? s.h0 : (s.from === 'tee' ? .7 : s.kind === 'throw' ? 1.3 : 0);
  var h1 = s.h1 != null ? s.h1 : (s.kind === 'throw' ? 1.2 : 0);
  if(s.kind === 'ground' || s.kind === 'roll'){
    var nb = s.bounces || 3, ph = ue * nb, k = Math.floor(ph), fr = ph - k;
    h = (pk || 1.2) * Math.pow(.45, k) * 4 * fr * (1 - fr);
    if(k === 0 && s.from === 'tee') h = Math.max(h, h0 * (1 - fr));
  } else {
    h = lerp(h0, h1, u) + 4 * pk * u * (1 - u);
  }
  return {x:x, y:y, h:h};
};
Scene.prototype.ballPos = function(t){
  var s = this.ballSeg(t); if(!s) return null;
  if(s.hold){ var a = s.at; if(a.on) return this.segPos(a, t); var p = this.pt(a.from, t); return {x:p.x, y:p.y, h:a.from === 'tee' ? .7 : 0}; }
  if(s.after){
    var l = s.seg;
    if(l.on) return this.segPos(l, t);
    if(l.to && !Array.isArray(l.to) && this.def(l.to)) return this.segPos({on:l.to}, t);
    var e = this.segPos(l, l.t1); return {x:e.x, y:e.y, h:0};
  }
  return this.segPos(s, t);
};
Scene.prototype.render = function(t){
  var s = this.s, self = this, ev = s.events || [], f = this.f;
  this.t = t;
  s.actors.forEach(function(d){
    var a = self.A[d.id], p = self.posAt(d.id, t);
    a.pos(p.x, p.y);
    var bubble = null, tone = null, ring = null, sw = null, swDir = 0, sl = null;
    ev.forEach(function(e){
      if(e.t > t || e.who !== d.id) return;
      if(e.type === 'say' && t < e.t + (e.dur || 1.4)){ bubble = e.text; tone = e.tone; }
      if(e.type === 'ring' && t < (e.until != null ? e.until : 1e9)) ring = e.color || '#ffd23f';
      if(e.type === 'swing' && t < e.t + (e.dur || .35) + .5){ sw = clamp((t - e.t) / (e.dur || .35), 0, 1); swDir = e.dir || 0; }
      if(e.type === 'slide' && t < (e.until != null ? e.until : 1e9)){ var q0 = self.posAt(d.id, e.t - .2), q1 = self.posAt(d.id, e.t); sl = Math.atan2(q1.y - q0.y, q1.x - q0.x) * 180 / Math.PI; }
    });
    a.say(bubble, tone); a.ring(!!ring, ring); a.swing(sw, swDir); a.slide(sl);
    if(d.glove){
      var bp = self.ballPos(t), ang = d.team === 'red' ? 90 : -90;
      if(bp){ var dx = bp.x - p.x, dy = bp.y - p.y; if(Math.hypot(dx, dy) > .2) ang = Math.atan2(dy, dx) * 180 / Math.PI; }
      a.setGlove(ang);
    }
  });
  if(this.ball){
    var bp = this.ballPos(t);
    this.ball.set(bp.x, bp.y, bp.h);
    var tr = (s.marks || []).filter(function(m){ return m.type === 'trail'; })[0];
    if(tr && this.marksOn && t >= (tr.at || 0)){
      var pts = []; for(var q = tr.t0; q <= Math.min(t, tr.t1) + 1e-6; q += .04){ var b = this.ballPos(q); pts.push([b.x, b.y]); }
      this.ball.setTrail(pts);
    } else this.ball.setTrail([]);
  }
  /* 판정 표시와 베이스 반짝임 */
  var cg = this.callG; cg.replaceChildren();
  ev.forEach(function(e){
    if(e.t > t) return;
    if(e.type === 'call' && t < e.t + (e.dur || 1.8)){
      var w = Math.max(5, e.text.length * 1.5 + 1.6) * f.S, h = 2.6 * f.S;
      var bg = e.tone === 'foul' ? '#d2372c' : e.tone === 'ok' ? '#ffffff' : '#ffd23f';
      var fg = e.tone === 'foul' ? '#fff' : e.tone === 'ok' ? '#15834a' : '#071c15';
      var gx = E('g', {transform:'translate(' + e.x + ' ' + e.y + ')'}, cg);
      E('rect', {x:-w/2, y:-h/2, width:w, height:h, rx:h/2, fill:bg, stroke:'rgba(0,0,0,.3)', 'stroke-width':.08*f.S}, gx);
      var tx = E('text', {x:0, y:.08*f.S, 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-size':1.45*f.S, 'font-family':'Black Han Sans, Pretendard', fill:fg}, gx); tx.textContent = e.text;
    }
    if(e.type === 'base' && t < e.t + (e.dur || 1.2)){
      var b = f.B[e.base], u = (t - e.t) / (e.dur || 1.2);
      E('circle', {cx:b[0], cy:b[1], r:(1 + u * 1.6) * f.S, fill:'none', stroke:e.color || '#ffd23f', 'stroke-width':.3*f.S, opacity:(1 - u).toFixed(2)}, cg);
    }
  });
  this.drawMarks(t);
  if(this.onTick) this.onTick(t);
};
Scene.prototype.drawMarks = function(t){
  var on = this.marksOn ? (this.s.marks || []).filter(function(m){ return m.type !== 'trail' && t >= (m.at || 0); }) : [];
  var key = on.length + ':' + on.map(function(m){ return m.type; }).join(',');
  if(key === this._mk) return;
  this._mk = key;
  var f = this.f, g = f.gMarks, B = f.B;
  g.replaceChildren();
  on.forEach(function(m){
    if(m.type === 'arrow') f.arrow(m.from, m.to, m.color || '#ffd23f', m.label, g, m.dash);
    if(m.type === 'text') f.label(m.x, m.y, m.text, m.color || '#fff', m.anchor, m.size, g);
    if(m.type === 'ring') E('circle', {cx:m.x, cy:m.y, r:m.r || 2, fill:'none', stroke:m.color || '#ff6b52', 'stroke-width':.28*f.S}, g);
    if(m.type === 'force'){
      m.bases.forEach(function(k){
        var b = B[k];
        E('circle', {cx:b[0], cy:b[1], r:1.9*f.S, fill:'rgba(255,210,63,.18)', stroke:'#ffd23f', 'stroke-width':.24*f.S, 'stroke-dasharray':(.5*f.S) + ' ' + (.3*f.S)}, g);
        f.label(b[0], b[1] - 2.8*f.S, '포스', '#ffd23f', 'middle', 1.1, g);
      });
    }
    if(m.type === 'lane'){
      var a = B[m.from], c = B[m.to], dx = c[0] - a[0], dy = c[1] - a[1], d = Math.hypot(dx, dy), nx = -dy/d, ny = dx/d, w = 1;
      E('path', {d:'M' + (a[0] + nx*w) + ' ' + (a[1] + ny*w) + ' L' + (c[0] + nx*w) + ' ' + (c[1] + ny*w) + ' L' + (c[0] - nx*w) + ' ' + (c[1] - ny*w) + ' L' + (a[0] - nx*w) + ' ' + (a[1] - ny*w) + ' Z', fill:'rgba(255,255,255,.14)', stroke:'#fff', 'stroke-width':.12, 'stroke-dasharray':'.4 .3'}, g);
      f.label((a[0] + c[0]) / 2 + nx * 2.6, (a[1] + c[1]) / 2 + ny * 2.6, '양쪽 1 m', '#fff', 'middle', 1.0, g);
    }
  });
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
Scene.prototype.destroy = function(){
  this.pause();
  for(var k in this.A) this.A[k].remove();
  this.callG.remove(); this.f.clearMarks();
  if(this.ball){ this.ball.g.remove(); this.f._ball = null; }
};

/* 달리기 키 만들기: 베이스 순서대로 일정한 속력(m/s)으로 */
function runKeys(f, t0, from, to, speed, startXY){
  var order = ['H', '1', '2', '3', 'H2'], B = f.B;
  var pos = function(k){ return k === 'H2' ? B.H : B[k]; };
  var i = order.indexOf(from), j = order.indexOf(to === 'H' && from !== 'H' ? 'H2' : to);
  var keys = [], t = t0, cur = startXY || pos(from);
  keys.push([t, cur[0], cur[1]]);
  for(var k = i + 1; k <= j; k++){
    var p = pos(order[k]), d = Math.hypot(p[0] - cur[0], p[1] - cur[1]);
    t += d / speed; keys.push([t, p[0], p[1]]); cur = p;
  }
  return keys;
}

window.FD = {Field:Field, Scene:Scene, E:E, lerp:lerp, clamp:clamp, ease:ease, TEAM:TEAM, POS:POS, runKeys:runKeys};

/* 화면에 보일 때만 반복 재생하는 작은 장면 */
FD.loopWhenVisible = function(scene, el){
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
