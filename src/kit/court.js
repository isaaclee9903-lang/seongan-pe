/* ===== 배드민턴 코트 그림: 위에서 본 코트(Top), 옆에서 본 코트(Side), 셔틀 비행, 장면 재생 =====
   좌표는 m 단위.
   Top : x는 왼쪽 뒤 경계선 0 → 오른쪽 뒤 경계선 13.4, 네트는 x = 6.7. y는 위쪽 복식 사이드라인 0 → 아래쪽 6.1.
   Side: x는 같고, z는 바닥에서 높이(m). 그림에서는 y = -z.
   라인은 그 라인이 둘러싸는 구역에 들어간다(라인 위 = 인). 그래서 라인은 경계의 안쪽으로 그린다. */
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
function lerpAng(a, b, u){ var d = ((b - a + 540) % 360) - 180; return a + d * u; }
function rad(d){ return d * Math.PI / 180; }

var K = {LEN:13.4, WID:6.1, NET:6.7, SS:1.98, DL:0.76, SW:0.46, LW:0.05, NETH:1.524, POST:1.55, NETLOW:0.764, SERVE:1.15, G:9.8, L:4.6};
var TEAM = {
  blue: {c1:'#6ea2ff', c2:'#2563d9', edge:'#0f2f73', dark:'#1a3f8f'},
  red:  {c1:'#ff8a6b', c2:'#d8452b', edge:'#6e170b', dark:'#9a2a17'}
};

/* ---- 구역 계산 ----
   side: 'L'(왼쪽 반) | 'R'(오른쪽 반), game: 'singles' | 'doubles', svc: 서비스 코트인지, half: 'right' | 'left' | 'all'
   right/left는 그 반의 선수가 네트를 바라볼 때 기준. */
function area(side, game, svc, half){
  var r = {};
  var sg = game === 'singles';
  r.y0 = sg ? K.SW : 0; r.y1 = sg ? K.WID - K.SW : K.WID;
  if(side === 'L'){ r.x0 = (svc && !sg) ? K.DL : 0; r.x1 = svc ? K.NET - K.SS : K.NET; }
  else { r.x0 = svc ? K.NET + K.SS : K.NET; r.x1 = (svc && !sg) ? K.LEN - K.DL : K.LEN; }
  if(half && half !== 'all'){
    var mid = K.WID / 2, lowHalf = (side === 'L') === (half === 'right'); // 왼쪽 반의 오른쪽 = 아래(y 큼)
    if(lowHalf) r.y0 = mid; else r.y1 = mid;
  }
  return r;
}
function inside(p, r, pad){ pad = pad || 0; return p.x >= r.x0 - pad && p.x <= r.x1 + pad && p.y >= r.y0 - pad && p.y <= r.y1 + pad; }

/* ---- 셔틀 비행 (중력 + 공기 저항, 저항은 빠를수록 커짐) ----
   d: 수평 거리, z: 높이. L: 공기역학 길이(셔틀 약 4.6 m, 테니스공 약 49 m) */
function fly(z0, v, ang, L, maxT){
  L = L || K.L; maxT = maxT || 6;
  var dt = 0.005, t = 0, d = 0, z = z0, vd = v * Math.cos(rad(ang)), vz = v * Math.sin(rad(ang)), out = [{t:0, d:0, z:z0, vd:vd, vz:vz}];
  while(t < maxT){
    var s = Math.hypot(vd, vz);
    var ad = -(s / L) * vd, az = -K.G - (s / L) * vz;
    vd += ad * dt; vz += az * dt; d += vd * dt; z += vz * dt; t += dt;
    if(z <= 0){ var p = out[out.length - 1], u = p.z / Math.max(1e-6, p.z - z); out.push({t:lerp(p.t, t, u), d:lerp(p.d, d, u), z:0, vd:vd, vz:vz}); break; }
    out.push({t:t, d:d, z:z, vd:vd, vz:vz});
  }
  return out;
}
function rangeOf(z0, v, ang, L){ var p = fly(z0, v, ang, L); return p[p.length - 1].d; }
function aim(z0, ang, D, L){
  var lo = 0.3, hi = 260;
  if(rangeOf(z0, hi, ang, L) < D) return hi;
  for(var i = 0; i < 40; i++){ var m = (lo + hi) / 2; if(rangeOf(z0, m, ang, L) < D) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

/* 높이 zt인 점(수평 거리 D)을 지나도록 겨냥. 도착 시각도 돌려준다 */
function zAt(z0, v, ang, D, L){ var p = fly(z0, v, ang, L); for(var i = 1; i < p.length; i++) if(p[i].d >= D){ var u = (D - p[i-1].d) / Math.max(1e-9, p[i].d - p[i-1].d); return {z:lerp(p[i-1].z, p[i].z, u), t:lerp(p[i-1].t, p[i].t, u)}; } return {z:-99, t:p[p.length - 1].t}; }
function aimAt(z0, ang, D, zt, L){
  var lo = .3, hi = 260;
  for(var i = 0; i < 44; i++){ var m = (lo + hi) / 2; if(zAt(z0, m, ang, D, L).z < zt) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
function hitTime(p0, x1, zt, ang, L){ var D = Math.abs(x1 - p0[0]); return zAt(p0[1], aimAt(p0[1], ang, D, zt, L), ang, D, L).t; }

/* ===================== 위에서 본 코트 ===================== */
function Top(svg, o){
  o = o || {};
  this.svg = svg; this.kind = 'top';
  var v = this.view = o.view || {x:-1.0, y:-0.85, w:15.4, h:7.8};
  svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h);
  svg.setAttribute('preserveAspectRatio', o.par || 'xMidYMid meet');
  svg.classList.add('board');
  var id = this.id = 'ct' + (++uid);
  var d = E('defs', null, svg);
  function rg(name, c1, c2){ var g = E('radialGradient', {id:id + name, cx:'.36', cy:'.3', r:'.8'}, d); E('stop', {offset:'0', 'stop-color':c1}, g); E('stop', {offset:'1', 'stop-color':c2}, g); }
  rg('blue', TEAM.blue.c1, TEAM.blue.c2); rg('red', TEAM.red.c1, TEAM.red.c2);
  var vg = E('radialGradient', {id:id + 'vig', cx:'.5', cy:'.5', r:'.8'}, d);
  E('stop', {offset:'.6', 'stop-color':'#000', 'stop-opacity':'0'}, vg); E('stop', {offset:'1', 'stop-color':'#000', 'stop-opacity':'.3'}, vg);
  this.defs = d;
  this.gFloor = E('g', {id:id + 'floor'}, svg);
  this.gZone = E('g', null, svg);
  this.gLines = E('g', {id:id + 'lines'}, svg);
  this.gFoot = E('g', {id:id + 'foot'}, svg);
  this.gMarks = E('g', null, svg);
  this.gActors = E('g', null, svg);
  this.gShuttle = E('g', {id:id + 'sh'}, svg);
  this.gFx = E('g', null, svg);
  this.actors = {};
  this.draw(o);
}
Top.prototype.draw = function(o){
  var g = this.gFloor, L = this.gLines, v = this.view, w = K.LW, c = '#f4f7f0';
  E('rect', {x:v.x - 2, y:v.y - 2, width:v.w + 4, height:v.h + 4, fill:'#124b33'}, g);
  E('rect', {x:-0.7, y:-0.6, width:K.LEN + 1.4, height:K.WID + 1.2, rx:.12, fill:'#176241'}, g);
  E('rect', {x:0, y:0, width:K.LEN, height:K.WID, fill:'#1d7a4f'}, g);
  if(o.singles){ E('rect', {x:0, y:0, width:K.LEN, height:K.SW, fill:'rgba(0,0,0,.16)'}, g); E('rect', {x:0, y:K.WID - K.SW, width:K.LEN, height:K.SW, fill:'rgba(0,0,0,.16)'}, g); }
  function R(x, y, ww, hh){ E('rect', {x:x, y:y, width:ww, height:hh, fill:c}, L); }
  R(0, 0, w, K.WID); R(K.LEN - w, 0, w, K.WID);                      // 뒤 경계선
  R(0, 0, K.LEN, w); R(0, K.WID - w, K.LEN, w);                      // 복식 사이드라인
  R(0, K.SW, K.LEN, w); R(0, K.WID - K.SW - w, K.LEN, w);            // 단식 사이드라인
  R(K.NET - K.SS - w, 0, w, K.WID); R(K.NET + K.SS, 0, w, K.WID);    // 쇼트 서비스 라인
  R(K.DL, 0, w, K.WID); R(K.LEN - K.DL - w, 0, w, K.WID);            // 복식 롱 서비스 라인
  R(0, K.WID/2 - w/2, K.NET - K.SS, w); R(K.NET + K.SS, K.WID/2 - w/2, K.NET - K.SS, w); // 센터라인
  /* 네트 */
  E('rect', {x:K.NET - .07, y:-.3, width:.14, height:K.WID + .6, fill:'rgba(0,0,0,.22)'}, L);
  E('line', {x1:K.NET, y1:-.25, x2:K.NET, y2:K.WID + .25, stroke:'#0d1512', 'stroke-width':.07}, L);
  E('line', {x1:K.NET, y1:-.25, x2:K.NET, y2:K.WID + .25, stroke:'#fff', 'stroke-width':.025}, L);
  [0, K.WID].forEach(function(y){ E('circle', {cx:K.NET, cy:y + (y ? .22 : -.22), r:.1, fill:'#cfd6d2', stroke:'#4b5550', 'stroke-width':.03}, L); });
  if(o.labels){
    var t1 = E('text', {x:K.NET, y:-.48, 'text-anchor':'middle', 'font-size':.32, 'font-weight':800, fill:'rgba(255,255,255,.7)'}, L); t1.textContent = '네트';
  }
  E('rect', {x:v.x - 2, y:v.y - 2, width:v.w + 4, height:v.h + 4, fill:'url(#' + this.id + 'vig)', 'pointer-events':'none'}, this.gFx);
};
Top.prototype.zone = function(r, fill, stroke){
  return E('rect', {x:r.x0, y:r.y0, width:r.x1 - r.x0, height:r.y1 - r.y0, fill:fill || 'rgba(255,210,63,.3)', stroke:stroke || 'none', 'stroke-width':stroke ? .06 : 0, 'stroke-dasharray':stroke ? '.2 .12' : ''}, this.gZone);
};
Top.prototype.clearZones = function(){ this.gZone.replaceChildren(); };
Top.prototype.player = function(id, team, num, o){ var a = new TopPlayer(this, id, team, num, o || {}); this.actors[id] = a; return a; };
Top.prototype.shuttle = function(){ return this._sh || (this._sh = new TopShuttle(this)); };
Top.prototype.toLocal = function(ev){
  var pt = this.svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
  var p = pt.matrixTransform(this.svg.getScreenCTM().inverse()); return {x:p.x, y:p.y};
};
Top.prototype.label = function(x, y, text, color, anchor, size, parent){
  var t = E('text', {x:x, y:y, 'text-anchor':anchor || 'middle', 'dominant-baseline':'middle', 'font-size':size || .36, 'font-family':'Black Han Sans, Pretendard', fill:color || '#fff', stroke:'rgba(0,0,0,.55)', 'stroke-width':.09, 'paint-order':'stroke'}, parent || this.gMarks);
  t.textContent = text; return t;
};
/* 돋보기: (px,py) 둘레를 k배로 키워 (cx,cy)에 반지름 r 원으로 보여 준다 */
Top.prototype.zoom = function(px, py, cx, cy, r, k, parent){
  var g = E('g', null, parent || this.gFx), cid = this.id + 'z' + (++uid);
  var cp = E('clipPath', {id:cid}, this.defs); E('circle', {cx:cx, cy:cy, r:r}, cp);
  var inner = E('g', {'clip-path':'url(#' + cid + ')'}, g);
  var t = 'translate(' + cx + ' ' + cy + ') scale(' + k + ') translate(' + (-px) + ' ' + (-py) + ')';
  ['floor', 'lines', 'foot'].forEach(function(n){ E('use', {href:'#' + this.id + n, transform:t}, inner); }, this);
  E('circle', {cx:cx, cy:cy, r:r, fill:'none', stroke:'#ffd23f', 'stroke-width':.07}, g);
  E('line', {x1:px, y1:py, x2:cx + (px - cx) / Math.hypot(px - cx, py - cy) * r, y2:cy + (py - cy) / Math.hypot(px - cx, py - cy) * r, stroke:'#ffd23f', 'stroke-width':.04, 'stroke-dasharray':'.12 .08'}, g);
  E('circle', {cx:px, cy:py, r:.16, fill:'none', stroke:'#ffd23f', 'stroke-width':.04}, g);
  return g;
};

function TopPlayer(b, id, team, num, o){
  this.b = b; this.id = id; this.team = team; this.x = 0; this.y = 0;
  this.ang = team === 'red' ? 180 : 0; this.rk = o.rk != null ? o.rk : 35;
  var t = TEAM[team], g = this.g = E('g', null, b.gActors);
  this.ringEl = E('circle', {r:.58, fill:'none', stroke:'#ffd23f', 'stroke-width':.07, 'stroke-dasharray':'.2 .12', opacity:0}, g);
  E('ellipse', {cx:.08, cy:.12, rx:.4, ry:.36, fill:'rgba(0,0,0,.25)'}, g);
  this.rot = E('g', null, g);
  this.rk_g = E('g', null, this.rot);
  E('line', {x1:.05, y1:0, x2:.36, y2:0, stroke:'#2a2f33', 'stroke-width':.06, 'stroke-linecap':'round'}, this.rk_g);
  E('ellipse', {cx:.52, cy:0, rx:.17, ry:.13, fill:'rgba(255,255,255,.18)', stroke:'#e9eef0', 'stroke-width':.035}, this.rk_g);
  E('path', {d:'M.42 -.1 V.1 M.52 -.12 V.12 M.62 -.1 V.1 M.38 -.04 H.66 M.38 .04 H.66', stroke:'rgba(255,255,255,.45)', 'stroke-width':.012}, this.rk_g);
  E('ellipse', {cx:0, cy:0, rx:.22, ry:.36, fill:t.dark}, this.rot);           // 어깨
  E('circle', {r:.29, fill:'url(#' + b.id + team + ')', stroke:t.edge, 'stroke-width':.04}, this.rot);
  E('circle', {cx:.08, cy:.27, r:.075, fill:'#f1c4a1', stroke:'#b07a55', 'stroke-width':.02}, this.rot); // 라켓 쥔 손
  this.numEl = E('text', {x:0, y:.11, 'text-anchor':'middle', 'font-size':.3, 'font-weight':800, fill:'#fff'}, g);
  this.numEl.textContent = num != null ? num : '';
  if(o.label){ this.labelEl = E('text', {x:0, y:-.55, 'text-anchor':'middle', 'font-size':.28, 'font-weight':800, fill:'#fff', stroke:'rgba(0,0,0,.6)', 'stroke-width':.08, 'paint-order':'stroke'}, g); this.labelEl.textContent = o.label; }
  this.face(this.ang); this.racket(this.rk);
}
TopPlayer.prototype.pos = function(x, y){ this.x = x; this.y = y; this.g.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + y.toFixed(3) + ')'); if(this.bub) this.bub.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + (y - .9).toFixed(3) + ')'); };
TopPlayer.prototype.face = function(a){ this.ang = a; this.rot.setAttribute('transform', 'rotate(' + a.toFixed(1) + ')'); };
TopPlayer.prototype.racket = function(rk){ this.rk = rk; this.rk_g.setAttribute('transform', 'translate(.08 .27) rotate(' + (-rk + 90).toFixed(1) + ') translate(-.05 0)'); };
TopPlayer.prototype.ring = function(on, color){ this.ringEl.setAttribute('opacity', on ? 1 : 0); if(color) this.ringEl.setAttribute('stroke', color); };
TopPlayer.prototype.say = function(text, tone){ say(this, text, tone, .34, .55); };
TopPlayer.prototype.show = function(on){ this.g.style.display = on ? '' : 'none'; if(!on && this.bub) this.bub.style.display = 'none'; };
TopPlayer.prototype.setLabel = function(s){ if(this.labelEl) this.labelEl.textContent = s; };

function say(a, text, tone, fs, h){
  if(!text){ if(a.bub) a.bub.style.display = 'none'; return; }
  if(!a.bub){
    a.bub = E('g', {'pointer-events':'none'}, a.b.gFx);
    a.bubR = E('rect', {y:-h * .62, height:h, rx:h * .35, fill:'#fff', stroke:'rgba(0,0,0,.25)', 'stroke-width':fs * .06}, a.bub);
    a.bubP = E('path', {d:'M' + (-fs * .3) + ' ' + (h * .37) + ' L0 ' + (h * .7) + ' L' + (fs * .3) + ' ' + (h * .37) + ' Z', fill:'#fff'}, a.bub);
    a.bubT = E('text', {x:0, y:-h * .1, 'text-anchor':'middle', 'dominant-baseline':'middle', 'font-size':fs, 'font-family':'Black Han Sans, Pretendard', fill:'#14201a'}, a.bub);
  }
  a.bub.style.display = '';
  if(a.bubT.textContent !== text){ a.bubT.textContent = text; var w = Math.max(fs * 2.6, text.length * fs * .98 + fs); a.bubR.setAttribute('x', -w/2); a.bubR.setAttribute('width', w); }
  var f = tone === 'foul' ? '#ffe3df' : tone === 'volt' ? '#ffd23f' : '#fff';
  a.bubR.setAttribute('fill', f); a.bubP.setAttribute('fill', f);
  a.pos(a.x, a.y);
}

/* 셔틀 아이콘 (그림에서는 실제보다 크게): 코르크가 앞, 깃털 치마가 뒤 */
function shuttleIcon(parent, s){
  var g = E('g', null, parent);
  E('path', {d:'M0 -.05 L-.2 -.095 L-.2 .095 L0 .05 Z', fill:'#ffffff', stroke:'#9aa6a0', 'stroke-width':.012}, g);
  E('path', {d:'M-.03 -.04 L-.2 -.06 M-.03 0 L-.2 0 M-.03 .04 L-.2 .06 M-.13 -.075 V.075', stroke:'#c2ccc7', 'stroke-width':.01, fill:'none'}, g);
  E('path', {d:'M0 -.05 A.05 .05 0 0 1 0 .05 Z', fill:'#f4efe4', stroke:'#8b7b5e', 'stroke-width':.012}, g);
  E('rect', {x:-.02, y:-.05, width:.035, height:.1, fill:'#2563d9'}, g);
  g.setAttribute('data-s', s || 1);
  return g;
}
function TopShuttle(b){
  this.b = b;
  this.sh = E('ellipse', {rx:.12, ry:.07, fill:'rgba(0,0,0,.35)'}, b.gShuttle);
  this.body = shuttleIcon(b.gShuttle);
  this.foot = E('circle', {r:.0135, fill:'#8b5a2b', stroke:'#4a2c10', 'stroke-width':.003}, b.gFoot);
  this.foot.style.display = 'none';
  this.x = 0; this.y = 0;
}
TopShuttle.prototype.set = function(x, y, z, dir){
  z = z || 0; this.x = x; this.y = y; this.z = z;
  this.sh.setAttribute('cx', x.toFixed(3)); this.sh.setAttribute('cy', y.toFixed(3));
  this.sh.setAttribute('opacity', (1 - Math.min(.6, z * .12)).toFixed(2));
  this.foot.style.display = z <= .01 && this.sh.style.display !== 'none' ? '' : 'none';
  this.foot.setAttribute('cx', x.toFixed(3)); this.foot.setAttribute('cy', y.toFixed(3));
  var sc = 1.5 + z * .12;
  this.body.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + (y - z * .22).toFixed(3) + ') rotate(' + (dir || 0).toFixed(1) + ') scale(' + sc.toFixed(3) + ')');
};
TopShuttle.prototype.show = function(on){ this.sh.style.display = this.body.style.display = on ? '' : 'none'; if(!on) this.foot.style.display = 'none'; };

/* ===================== 옆에서 본 코트 ===================== */
function Side(svg, o){
  o = o || {};
  this.svg = svg; this.kind = 'side';
  var v = this.view = o.view || {x:-0.7, y:-4.9, w:14.8, h:5.6};
  svg.setAttribute('viewBox', v.x + ' ' + v.y + ' ' + v.w + ' ' + v.h);
  svg.setAttribute('preserveAspectRatio', o.par || 'xMidYMid meet');
  svg.classList.add('board');
  var id = this.id = 'cs' + (++uid);
  var d = this.defs = E('defs', null, svg);
  var wall = E('linearGradient', {id:id + 'wall', x1:'0', y1:'0', x2:'0', y2:'1'}, d);
  E('stop', {offset:'0', 'stop-color':'#0b2a1f'}, wall); E('stop', {offset:'1', 'stop-color':'#174a35'}, wall);
  var mesh = E('pattern', {id:id + 'mesh', width:.09, height:.09, patternUnits:'userSpaceOnUse'}, d);
  E('path', {d:'M0 0 L.09 .09 M.09 0 L0 .09', stroke:'rgba(255,255,255,.35)', 'stroke-width':.012}, mesh);
  this.gBack = E('g', null, svg);
  this.gMarks = E('g', null, svg);
  this.gActors = E('g', null, svg);
  this.gNet = E('g', null, svg);
  this.gShuttle = E('g', null, svg);
  this.gFx = E('g', null, svg);
  this.actors = {};
  this.draw(o);
}
Side.prototype.draw = function(o){
  var g = this.gBack, v = this.view, id = this.id;
  E('rect', {x:v.x - 2, y:v.y - 2, width:v.w + 4, height:v.h + 4, fill:'url(#' + id + 'wall)'}, g);
  E('rect', {x:v.x - 2, y:0, width:v.w + 4, height:2, fill:'#124b33'}, g);
  E('rect', {x:0, y:0, width:K.LEN, height:.32, fill:'#1d7a4f'}, g);
  E('rect', {x:0, y:0, width:K.LEN, height:.03, fill:'rgba(255,255,255,.25)'}, g);
  var marks = [[0, '뒤 경계선'], [K.DL, ''], [K.NET - K.SS, ''], [K.NET + K.SS, ''], [K.LEN - K.DL, ''], [K.LEN, '']];
  marks.forEach(function(m){ E('rect', {x:m[0] === K.LEN ? K.LEN - .06 : m[0], y:0, width:.06, height:.32, fill:'#f4f7f0'}, g); });
  /* 네트 */
  var n = this.gNet, x = K.NET;
  E('rect', {x:x - .05, y:-K.POST, width:.1, height:K.POST, rx:.03, fill:'#cfd6d2', stroke:'#56615b', 'stroke-width':.02}, n);
  E('rect', {x:x - .2, y:-.02, width:.4, height:.06, rx:.02, fill:'#56615b'}, n);
  this.netMesh = E('rect', {x:x - .12, y:-K.NETH, width:.24, height:K.NETH - K.NETLOW, fill:'url(#' + id + 'mesh)', stroke:'rgba(255,255,255,.45)', 'stroke-width':.015}, n);
  this.netTape = E('rect', {x:x - .13, y:-K.NETH - .02, width:.26, height:.075, fill:'#ffffff'}, n);
  if(o.height){ this.hline(K.SERVE, '1.15 m', '#ffd23f'); }
  if(o.netLabel !== false){
    var t = E('text', {x:x, y:-K.POST - .22, 'text-anchor':'middle', 'font-size':.26, 'font-weight':800, fill:'rgba(255,255,255,.6)'}, n); t.textContent = '네트 1.52 m';
  }
};
Side.prototype.hline = function(z, text, color, parent){
  var g = E('g', null, parent || this.gBack);
  E('line', {x1:this.view.x, y1:-z, x2:this.view.x + this.view.w, y2:-z, stroke:color || '#ffd23f', 'stroke-width':.035, 'stroke-dasharray':'.18 .12'}, g);
  if(text){ var t = E('text', {x:this.view.x + .15, y:-z - .12, 'font-size':.26, 'font-weight':800, fill:color || '#ffd23f', stroke:'rgba(0,0,0,.5)', 'stroke-width':.07, 'paint-order':'stroke'}, g); t.textContent = text; }
  return g;
};
Side.prototype.label = function(x, z, text, color, anchor, size, parent){
  var t = E('text', {x:x, y:-z, 'text-anchor':anchor || 'middle', 'dominant-baseline':'middle', 'font-size':size || .3, 'font-family':'Black Han Sans, Pretendard', fill:color || '#fff', stroke:'rgba(0,0,0,.55)', 'stroke-width':.08, 'paint-order':'stroke'}, parent || this.gMarks);
  t.textContent = text; return t;
};
Side.prototype.player = function(id, team, num, o){ var a = new SidePlayer(this, id, team, num, o || {}); this.actors[id] = a; return a; };
Side.prototype.shuttle = function(){ return this._sh || (this._sh = new SideShuttle(this)); };
Side.prototype.netShake = function(){
  var m = this.netMesh, t = this.netTape;
  [m, t].forEach(function(el){ el.style.transition = 'transform .08s'; el.style.transform = 'translateX(.06px)'; });
  setTimeout(function(){ [m, t].forEach(function(el){ el.style.transform = ''; }); }, 120);
};
Side.prototype.toLocal = Top.prototype.toLocal;

/* 자세: 각 마디의 방향(도). 0 = 앞(네트 쪽), 90 = 위, -90 = 아래. 왼쪽 반 선수 기준이고 오른쪽 반은 좌우를 뒤집는다. */
var POSE = {
  stand:   {lean:90, thF:-86, shF:-92, thB:-96, shB:-90, uaR:-75, faR:-30, rk:40,  uaL:-100, faL:-80},
  ready:   {lean:80, thF:-70, shF:-100, thB:-115, shB:-95, uaR:-35, faR:25, rk:70, uaL:-70, faL:-20},
  serveSet:{lean:78, thF:-72, shF:-95, thB:-112, shB:-96, uaR:-120, faR:-150, rk:-170, uaL:-25, faL:-5},
  serveHit:{lean:80, thF:-72, shF:-95, thB:-112, shB:-96, uaR:-72, faR:-45, rk:-12, uaL:-60, faL:-80},
  serveEnd:{lean:82, thF:-72, shF:-95, thB:-112, shB:-96, uaR:-10, faR:40, rk:85, uaL:-80, faL:-95},
  overSet: {lean:97, thF:-68, shF:-92, thB:-118, shB:-100, uaR:150, faR:100, rk:-105, uaL:65, faL:75},
  overHit: {lean:86, thF:-70, shF:-94, thB:-112, shB:-98, uaR:95, faR:82, rk:78, uaL:-25, faL:-70},
  smashHit:{lean:80, thF:-70, shF:-94, thB:-112, shB:-98, uaR:75, faR:55, rk:35, uaL:-30, faL:-75},
  follow:  {lean:70, thF:-68, shF:-96, thB:-118, shB:-100, uaR:-40, faR:-75, rk:-95, uaL:-110, faL:-120},
  lunge:   {lean:66, thF:-25, shF:-92, thB:-152, shB:-168, uaR:15, faR:35, rk:50, uaL:-165, faL:-175},
  netHigh: {lean:84, thF:-62, shF:-96, thB:-118, shB:-100, uaR:62, faR:55, rk:45, uaL:-40, faL:-80},
  netOver: {lean:76, thF:-55, shF:-96, thB:-122, shB:-102, uaR:28, faR:12, rk:0, uaL:-40, faL:-80},
  netTouch:{lean:72, thF:-60, shF:-96, thB:-120, shB:-100, uaR:-5, faR:-15, rk:-30, uaL:-100, faL:-120},
  reachOver:{lean:78, thF:-62, shF:-96, thB:-118, shB:-100, uaR:35, faR:22, rk:12, uaL:-40, faL:-80},
  serveHigh:{lean:84, thF:-72, shF:-95, thB:-112, shB:-96, uaR:-5, faR:15, rk:25, uaL:-60, faL:-80},
  under:   {lean:70, thF:-40, shF:-92, thB:-140, shB:-160, uaR:-25, faR:-30, rk:-10, uaL:-150, faL:-160}
};
var SEG = {th:.46, sh:.46, torso:.52, ua:.29, fa:.26};
function poseMix(a, b, u){ var o = {}; for(var k in a) o[k] = lerpAng(a[k], b[k], u); return o; }
function dir(a, l){ return {x:Math.cos(rad(a)) * l, y:Math.sin(rad(a)) * l}; }

function SidePlayer(b, id, team, num, o){
  this.b = b; this.id = id; this.team = team; this.x = 0; this.y = 0; this.mirror = o.mirror != null ? o.mirror : team === 'red';
  var t = TEAM[team], g = this.g = E('g', null, b.gActors);
  this.shadow = E('ellipse', {cx:0, cy:.04, rx:.42, ry:.07, fill:'rgba(0,0,0,.35)'}, g);
  this.inner = E('g', null, g);
  var lc = {fill:'none', 'stroke-linecap':'round', 'stroke-linejoin':'round'};
  this.legB = E('path', Object.assign({stroke:t.edge, 'stroke-width':.15}, lc), this.inner);
  this.footB = E('path', Object.assign({stroke:'#1b2230', 'stroke-width':.1}, lc), this.inner);
  this.armL = E('path', Object.assign({stroke:t.dark, 'stroke-width':.11}, lc), this.inner);
  this.torso = E('path', Object.assign({stroke:t.c2, 'stroke-width':.27}, lc), this.inner);
  this.shorts = E('path', Object.assign({stroke:'#1f2a44', 'stroke-width':.2}, lc), this.inner);
  this.legF = E('path', Object.assign({stroke:t.c2, 'stroke-width':.15}, lc), this.inner);
  this.footF = E('path', Object.assign({stroke:'#1b2230', 'stroke-width':.1}, lc), this.inner);
  this.head = E('circle', {r:.12, fill:'#f1c4a1', stroke:'#b07a55', 'stroke-width':.015}, this.inner);
  this.hair = E('path', {fill:'#2b2320'}, this.inner);
  this.armR = E('path', Object.assign({stroke:t.c1, 'stroke-width':.12}, lc), this.inner);
  this.racketG = E('g', null, this.inner);
  E('line', {x1:0, y1:0, x2:.42, y2:0, stroke:'#cfd6d9', 'stroke-width':.032, 'stroke-linecap':'round'}, this.racketG);
  E('line', {x1:0, y1:0, x2:.16, y2:0, stroke:'#ffd23f', 'stroke-width':.055, 'stroke-linecap':'round'}, this.racketG);
  E('ellipse', {cx:.53, cy:0, rx:.135, ry:.1, fill:'rgba(255,255,255,.14)', stroke:'#e9eef0', 'stroke-width':.025}, this.racketG);
  this.hand = E('circle', {r:.055, fill:'#f1c4a1'}, this.inner);
  this.ringEl = E('circle', {cx:0, cy:-1.0, r:1.05, fill:'none', stroke:'#ffd23f', 'stroke-width':.05, 'stroke-dasharray':'.16 .1', opacity:0}, g);
  if(num != null){ this.numEl = E('text', {'text-anchor':'middle', 'dominant-baseline':'middle', 'font-size':.17, 'font-weight':900, fill:'#fff'}, this.inner); this.numEl.textContent = num; }
  if(o.label){ this.labelEl = E('text', {x:0, y:-2.15, 'text-anchor':'middle', 'font-size':.26, 'font-weight':800, fill:'#fff', stroke:'rgba(0,0,0,.6)', 'stroke-width':.07, 'paint-order':'stroke'}, g); this.labelEl.textContent = o.label; }
  this.setPose(POSE.ready);
}
SidePlayer.prototype.pos = function(x, y){ this.x = x; this.y = y || 0; this.g.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + (-(this.y)).toFixed(3) + ')'); if(this.bub) this.bub.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + (-2.45 - this.y).toFixed(3) + ')'); };
SidePlayer.prototype.setPose = function(p){
  if(typeof p === 'string') p = POSE[p];
  this.p = p;
  function legDrop(th, sh){ return -(dir(th, SEG.th).y + dir(sh, SEG.sh).y); }
  var hipZ = Math.max(legDrop(p.thF, p.shF), legDrop(p.thB, p.shB));
  var hip = {x:0, y:hipZ}, S = this;
  function pt(a){ return a.x.toFixed(3) + ' ' + (-a.y).toFixed(3); }
  function add(a, b){ return {x:a.x + b.x, y:a.y + b.y}; }
  function leg(th, sh){ var k = add(hip, dir(th, SEG.th)), a = add(k, dir(sh, SEG.sh)); return {k:k, a:a}; }
  var lf = leg(p.thF, p.shF), lb = leg(p.thB, p.shB);
  this.legF.setAttribute('d', 'M' + pt(hip) + ' L' + pt(lf.k) + ' L' + pt(lf.a));
  this.legB.setAttribute('d', 'M' + pt(hip) + ' L' + pt(lb.k) + ' L' + pt(lb.a));
  this.footF.setAttribute('d', 'M' + pt(add(lf.a, {x:-.03, y:0})) + ' L' + pt(add(lf.a, {x:.14, y:0})));
  this.footB.setAttribute('d', 'M' + pt(add(lb.a, {x:-.03, y:0})) + ' L' + pt(add(lb.a, {x:.14, y:0})));
  var neck = add(hip, dir(p.lean, SEG.torso));
  var sh = add(hip, dir(p.lean, SEG.torso - .05));
  this.torso.setAttribute('d', 'M' + pt(add(hip, dir(p.lean, .12))) + ' L' + pt(sh));
  this.shorts.setAttribute('d', 'M' + pt(add(hip, dir(p.lean, .04))) + ' L' + pt(add(hip, dir(p.lean, -.02))));
  var hd = add(neck, dir(p.lean, .17));
  this.head.setAttribute('cx', hd.x.toFixed(3)); this.head.setAttribute('cy', (-hd.y).toFixed(3));
  var hb = dir(p.lean + 90, .125), hf = dir(p.lean - 90, .125), top = add(hd, dir(p.lean, .13));
  this.hair.setAttribute('d', 'M' + pt(add(hd, dir(p.lean + 150, .125))) + ' Q' + pt(add(top, dir(p.lean + 90, .16))) + ' ' + pt(add(hd, dir(p.lean - 20, .13))) + ' L' + pt(add(hd, dir(p.lean + 60, .05))) + ' Z');
  var el = add(sh, dir(p.uaL, SEG.ua)), hl = add(el, dir(p.faL, SEG.fa));
  this.armL.setAttribute('d', 'M' + pt(sh) + ' L' + pt(el) + ' L' + pt(hl));
  var er = add(sh, dir(p.uaR, SEG.ua)), hr = add(er, dir(p.faR, SEG.fa));
  this.armR.setAttribute('d', 'M' + pt(sh) + ' L' + pt(er) + ' L' + pt(hr));
  this.hand.setAttribute('cx', hr.x.toFixed(3)); this.hand.setAttribute('cy', (-hr.y).toFixed(3));
  this.racketG.setAttribute('transform', 'translate(' + pt(hr).replace(' ', ' ') + ') rotate(' + (-p.rk).toFixed(1) + ')');
  if(this.numEl){ var c = add(hip, dir(p.lean, .32)); this.numEl.setAttribute('x', c.x.toFixed(3)); this.numEl.setAttribute('y', (-c.y).toFixed(3)); this.numEl.setAttribute('transform', this.mirror ? 'translate(' + (2 * c.x).toFixed(3) + ' 0) scale(-1 1)' : ''); }
  this.inner.setAttribute('transform', this.mirror ? 'scale(-1 1)' : '');
  this._hl = hl; this._hr = hr;
  this._rkHead = add(hr, dir(p.rk, .53));
};
/* 세계 좌표(m)로 왼손·라켓 머리 위치 */
SidePlayer.prototype.lhand = function(){ var s = this.mirror ? -1 : 1; return {x:this.x + s * this._hl.x, z:this.y + this._hl.y}; };
SidePlayer.prototype.rhead = function(){ var s = this.mirror ? -1 : 1; return {x:this.x + s * this._rkHead.x, z:this.y + this._rkHead.y}; };
/* 자세별 라켓 머리 위치(오른쪽을 보는 선수, 발 기준) */
var _hp = null;
function headOf(pose){ if(!_hp) _hp = new SidePlayer({gActors:E('g'), gFx:E('g')}, 'x', 'blue', null, {mirror:false}); _hp.setPose(pose); return {x:_hp._rkHead.x, z:_hp._rkHead.y}; }
SidePlayer.prototype.ring = function(on, color){ this.ringEl.setAttribute('opacity', on ? 1 : 0); if(color) this.ringEl.setAttribute('stroke', color); };
SidePlayer.prototype.say = function(text, tone){ say(this, text, tone, .3, .48); };
SidePlayer.prototype.show = TopPlayer.prototype.show;

function SideShuttle(b){
  this.b = b;
  this.sh = E('ellipse', {rx:.13, ry:.035, fill:'rgba(0,0,0,.4)'}, b.gShuttle);
  this.body = shuttleIcon(b.gShuttle);
}
SideShuttle.prototype.set = function(x, z, ang, sc){
  this.x = x; this.z = z;
  this.sh.setAttribute('cx', x.toFixed(3)); this.sh.setAttribute('cy', '.02');
  this.sh.setAttribute('opacity', Math.max(.12, 1 - z * .25).toFixed(2));
  this.body.setAttribute('transform', 'translate(' + x.toFixed(3) + ' ' + (-z).toFixed(3) + ') rotate(' + (-(ang || 0)).toFixed(1) + ') scale(' + (sc || 1.6) + ')');
};
SideShuttle.prototype.show = TopShuttle.prototype.show;

/* ===================== 장면 재생 =====================
   scn = { dur,
     actors:[{id, team, num, label, keys:[[t,x,y]] (Side는 [[t,x]] 또는 [[t,x,jump]]), face:[[t,deg]](Top), rk:[[t,deg]](Top), pose:[[t,'이름']](Side)}],
     hold:{who} | {xy:[x,y,z]} (첫 샷 전 셔틀 위치),
     shots:[{t, from:'id' | [x,y,z] | [x,z], to:[x,y] | x, ang, net:'stick'|'drop'|'graze', stop:{x} | {d}, L}],
     events:[{t,type:'say',who,text,dur,tone} | {t,type:'ring',who,until,color} | {t,type:'shake'}],
     marks:[{at, type:'zone', r:{x0,x1,y0,y1}, color, stroke} | {at,type:'text',x,y,text,color,size,anchor} | {at,type:'land',shot,color}
            | {at,type:'zoom',shot,c:[x,y],r,k} | {at,type:'path',shot,color} | {at,type:'hline',z,text,color} | {at,type:'arrow',from,to,color,label}] } */
function Scene(court, scn, o){
  o = o || {};
  this.c = court; this.s = scn; this.t = 0; this.speed = 1; this.playing = false;
  this.loop = !!o.loop; this.marksOn = !!o.marks; this.hold = o.hold != null ? o.hold : 1.2;
  this.onEnd = o.onEnd || null; this.onTick = o.onTick || null;
  var self = this; this.A = {};
  scn.actors.forEach(function(a){ self.A[a.id] = court.player(a.id, a.team, a.num, {label:a.label, mirror:a.mirror}); });
  this.sh = court.shuttle();
  this._mk = ''; this._shook = {};
  this.prep();
  this.render(0);
}
Scene.prototype.def = function(id){ for(var i = 0; i < this.s.actors.length; i++) if(this.s.actors[i].id === id) return this.s.actors[i]; };
Scene.prototype.posAt = function(id, t){
  var k = this.def(id).keys;
  if(t <= k[0][0]) return {x:k[0][1], y:k[0][2] || 0};
  for(var i = 0; i < k.length - 1; i++){
    if(t <= k[i+1][0]){ var u = (t - k[i][0]) / Math.max(1e-6, k[i+1][0] - k[i][0]); u = u * u * (3 - 2 * u); return {x:lerp(k[i][1], k[i+1][1], u), y:lerp(k[i][2] || 0, k[i+1][2] || 0, u)}; }
  }
  var l = k[k.length - 1]; return {x:l[1], y:l[2] || 0};
};
function keyed(arr, t, dflt, mix){
  if(!arr || !arr.length) return dflt;
  if(t <= arr[0][0]) return arr[0][1];
  for(var i = 0; i < arr.length - 1; i++){
    if(t <= arr[i+1][0]){ var u = (t - arr[i][0]) / Math.max(1e-6, arr[i+1][0] - arr[i][0]); return mix(arr[i][1], arr[i+1][1], u); }
  }
  return arr[arr.length - 1][1];
}
Scene.prototype.poseAt = function(id, t){
  return keyed(this.def(id).pose, t, POSE.ready, function(a, b, u){ return poseMix(POSE[a] || a, POSE[b] || b, u * u * (3 - 2 * u)); });
};
Scene.prototype.prep = function(){
  var self = this, side = this.c.kind === 'side';
  (this.s.shots || []).forEach(function(sh){
    var p0;
    if(sh.from === 'prev'){
      var pv = self.s.shots[self.s.shots.indexOf(sh) - 1], q = ptOn(pv, sh.t - pv.t);
      p0 = side ? [q.x, q.z] : [q.x, q.y, q.z];
    }
    else if(typeof sh.from === 'string'){
      var a = self.A[sh.from], pp = self.posAt(sh.from, sh.t);
      a.pos(pp.x, pp.y); if(side) a.setPose(self.poseAt(sh.from, sh.t));
      p0 = side ? [a.rhead().x, a.rhead().z] : [a.x, a.y, sh.z != null ? sh.z : 1.0];
    }
    else p0 = sh.from;
    var x0 = p0[0], y0 = side ? 0 : p0[1], z0 = side ? p0[1] : p0[2];
    var tx = side ? sh.to : sh.to[0], ty = side ? 0 : sh.to[1];
    var D = Math.hypot(tx - x0, ty - y0), ux = (tx - x0) / (D || 1), uy = (ty - y0) / (D || 1);
    var ang = sh.ang != null ? sh.ang : 25;
    var v = sh.v || (sh.toZ != null ? aimAt(z0, ang, D, sh.toZ, sh.L) : aim(z0, ang, D, sh.L));
    var pts = fly(z0, v, ang, sh.L, 8);
    if(sh.toZ != null){ var cut = []; for(var j = 0; j < pts.length; j++){ if(pts[j].d >= D){ var pa = pts[j-1], uu = (D - pa.d) / Math.max(1e-9, pts[j].d - pa.d); cut.push({t:lerp(pa.t, pts[j].t, uu), d:D, z:lerp(pa.z, pts[j].z, uu), vd:pts[j].vd, vz:pts[j].vz}); break; } cut.push(pts[j]); } pts = cut; }
    var out = [], ended = null;
    for(var i = 0; i < pts.length; i++){
      var q = pts[i], x = x0 + ux * q.d, y = y0 + uy * q.d;
      if(i > 0 && (out[i-1].x - K.NET) * (x - K.NET) <= 0 && out[i-1].x !== K.NET){
        if(q.z < K.NETH || sh.net === 'stick'){
          if(sh.net === 'stick' || q.z > K.NETH - .12){ out.push({t:q.t, x:K.NET - Math.sign(ux) * .05, y:y, z:K.NETH + .05, ang:-90, rest:true, net:true}); ended = 'net'; break; }
          out.push({t:q.t, x:K.NET - Math.sign(ux) * .08, y:y, z:q.z, ang:Math.atan2(q.vz, q.vd) * 180 / Math.PI, net:true}); ended = 'netdrop'; break;
        }
        if(sh.net === 'graze'){ ended = 'graze'; sh._graze = q.t; }
      }
      if(sh.stop && ((sh.stop.d != null && q.d >= sh.stop.d) || (sh.stop.x != null && (x - sh.stop.x) * ux >= 0))){ out.push({t:q.t, x:x, y:y, z:q.z, ang:Math.atan2(q.vz, q.vd) * 180 / Math.PI}); ended = 'body'; break; }
      out.push({t:q.t, x:x, y:y, z:q.z, ang:Math.atan2(q.vz, q.vd) * 180 / Math.PI});
    }
    if(ended === 'netdrop' || ended === 'body'){
      var last = out[out.length - 1], fz = last.z, tt = last.t, fx = last.x;
      while(fz > 0){ tt += .02; fz = Math.max(0, fz - .02 * Math.min(6.7, 2 + (tt - last.t) * 9)); out.push({t:tt, x:fx - ux * .02 * (tt - last.t), y:last.y, z:fz, ang:-90}); }
    }
    sh._pts = out; sh._ux = ux; sh._uy = uy; sh._end = ended;
    sh._land = out[out.length - 1];
  });
};
function ptOn(sh, tt){
  var p = sh._pts, k = 0;
  while(k < p.length - 1 && p[k+1].t <= tt) k++;
  if(k >= p.length - 1) return p[p.length - 1];
  var u = (tt - p[k].t) / Math.max(1e-6, p[k+1].t - p[k].t);
  return {x:lerp(p[k].x, p[k+1].x, u), y:lerp(p[k].y, p[k+1].y, u), z:lerp(p[k].z, p[k+1].z, u), ang:p[k+1].ang};
}
Scene.prototype.shuttleAt = function(t){
  var shots = this.s.shots || [], cur = null;
  for(var i = 0; i < shots.length; i++) if(t >= shots[i].t) cur = shots[i];
  var side = this.c.kind === 'side';
  if(!cur){
    var h = this.s.hold;
    if(!h) return null;
    if(h.who){ var a = this.A[h.who]; if(side){ var l = a.lhand(); return {x:l.x, y:0, z:l.z - .06, ang:-90}; } return {x:a.x + Math.cos(rad(a.ang)) * .35, y:a.y + Math.sin(rad(a.ang)) * .35, z:1, ang:a.ang}; }
    return {x:h.xy[0], y:side ? 0 : h.xy[1], z:side ? h.xy[1] : h.xy[2], ang:h.ang != null ? h.ang : -90};
  }
  var tt = t - cur.t, p = cur._pts, k = 0;
  while(k < p.length - 1 && p[k+1].t <= tt) k++;
  if(k >= p.length - 1){ var e = p[p.length - 1]; return {x:e.x, y:e.y, z:e.z, ang:e.z > .01 ? e.ang : (cur._ux >= 0 ? 168 : 12), rest:e.z <= .01, shot:cur}; }
  var u = (tt - p[k].t) / Math.max(1e-6, p[k+1].t - p[k].t);
  return {x:lerp(p[k].x, p[k+1].x, u), y:lerp(p[k].y, p[k+1].y, u), z:lerp(p[k].z, p[k+1].z, u), ang:p[k+1].ang, shot:cur};
};
Scene.prototype.render = function(t){
  var s = this.s, self = this, side = this.c.kind === 'side', ev = s.events || [];
  this.t = t;
  s.actors.forEach(function(d){
    var a = self.A[d.id], p = self.posAt(d.id, t);
    a.pos(p.x, p.y);
    if(side){ a.setPose(self.poseAt(d.id, t)); }
    else {
      a.face(keyed(d.face, t, d.team === 'red' ? 180 : 0, lerpAng));
      a.racket(keyed(d.rk, t, 35, lerp));
    }
    var bubble = null, tone = null, ring = null;
    ev.forEach(function(e){
      if(e.t > t || e.who !== d.id) return;
      if(e.type === 'say' && t < e.t + (e.dur || 1.4)){ bubble = e.text; tone = e.tone; }
      if(e.type === 'ring' && t < (e.until != null ? e.until : 1e9)) ring = e.color || '#ffd23f';
    });
    a.say(bubble, tone); a.ring(!!ring, ring);
  });
  if(side) ev.forEach(function(e, i){ if(e.type === 'shake' && t >= e.t && t < e.t + .3 && !self._shook['e' + i] && self.playing){ self._shook['e' + i] = true; self.c.netShake(); } });
  var q = this.shuttleAt(t);
  if(q){
    this.sh.show(true);
    if(side) this.sh.set(q.x, q.z, q.shot && q.shot._ux < 0 ? 180 - q.ang : q.ang);
    else this.sh.set(q.x, q.y, q.z, q.rest && q.z < .01 ? (q.shot && q.shot._ux < 0 ? 200 : 20) : Math.atan2(q.shot ? q.shot._uy : 0, q.shot ? q.shot._ux : 1) * 180 / Math.PI);
  } else this.sh.show(false);
  if(side) (s.shots || []).forEach(function(sh, i){ if(sh._end && sh._end !== 'body' && t >= sh.t + (sh._end === 'graze' ? sh._graze : sh._pts[sh._pts.length - 1].t) - .01 && !self._shook[i] && self.playing){ self._shook[i] = true; self.c.netShake(); } });
  this.drawMarks(t);
  if(this.onTick) this.onTick(t);
};
Scene.prototype.drawMarks = function(t){
  var self = this, on = this.marksOn ? (this.s.marks || []).filter(function(m){ return t >= (m.at || 0); }) : [];
  var key = on.length + ':' + this.marksOn;
  if(key === this._mk) return;
  this._mk = key;
  var c = this.c, g = c.gMarks, side = c.kind === 'side';
  g.replaceChildren();
  if(this._zoomEls){ this._zoomEls.forEach(function(z){ z.remove(); }); }
  this._zoomEls = [];
  on.forEach(function(m){
    var sh = m.shot != null ? self.s.shots[m.shot] : null;
    if(m.type === 'zone') E('rect', {x:m.r.x0, y:m.r.y0, width:m.r.x1 - m.r.x0, height:m.r.y1 - m.r.y0, fill:m.color || 'rgba(255,210,63,.28)', stroke:m.stroke || 'none', 'stroke-width':.06, 'stroke-dasharray':'.2 .12'}, g);
    if(m.type === 'text') (side ? c.label(m.x, m.z, m.text, m.color, m.anchor, m.size) : c.label(m.x, m.y, m.text, m.color, m.anchor, m.size));
    if(m.type === 'hline') c.hline(m.z, m.text, m.color, g);
    if(m.type === 'land' && sh){ var L = sh._land; E('circle', {cx:L.x, cy:side ? 0 : L.y, r:side ? .14 : .22, fill:'none', stroke:m.color || '#ffd23f', 'stroke-width':.06}, g); }
    if(m.type === 'path' && sh){
      var pts = sh._pts.filter(function(_, i){ return i % 3 === 0; }).map(function(p){ return p.x.toFixed(2) + ',' + (side ? (-p.z) : p.y).toFixed(2); });
      E('polyline', {points:pts.join(' '), fill:'none', stroke:m.color || '#ffd23f', 'stroke-width':.05, 'stroke-dasharray':'.14 .1'}, g);
    }
    if(m.type === 'zoom' && sh && !side){ self._zoomEls.push(c.zoom(sh._land.x, sh._land.y, m.c[0], m.c[1], m.r || 1.2, m.k || 6)); }
    if(m.type === 'arrow'){
      var a = m.from, b = m.to, dx = b[0] - a[0], dy = b[1] - a[1], dd = Math.hypot(dx, dy) || 1, ux = dx/dd, uy = dy/dd, col = m.color || '#ffd23f';
      if(side){ a = [a[0], -a[1]]; b = [b[0], -b[1]]; uy = -uy; }
      E('line', {x1:a[0], y1:a[1], x2:b[0] - ux * .2, y2:b[1] - uy * .2, stroke:col, 'stroke-width':.07, 'stroke-linecap':'round'}, g);
      E('path', {d:'M' + b[0] + ' ' + b[1] + ' L' + (b[0] - ux*.3 - uy*.17) + ' ' + (b[1] - uy*.3 + ux*.17) + ' L' + (b[0] - ux*.3 + uy*.17) + ' ' + (b[1] - uy*.3 - ux*.17) + ' Z', fill:col}, g);
      if(m.label){ var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - .3; (side ? c.label(mx, -my, m.label, col) : c.label(mx, my, m.label, col)); }
    }
  });
};
Scene.prototype.play = function(speed){
  var self = this;
  if(speed != null) this.speed = speed;
  if(this.t >= this.s.dur - 1e-3){ this.t = 0; this._shook = {}; }
  this.playing = true;
  var last = performance.now(), wait = 0;
  cancelAnimationFrame(this._raf);
  function step(now){
    if(!self.playing) return;
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    if(wait > 0){ wait -= dt; if(wait <= 0){ self._shook = {}; self.render(0); } self._raf = requestAnimationFrame(step); return; }
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

/* 화면에 보일 때만 반복 재생 */
function loopWhenVisible(scene, el){
  var vis = false;
  function check(){
    var r = el.getBoundingClientRect();
    var v = r.width > 0 && r.right > 4 && r.left < window.innerWidth - 4 && r.bottom > 0 && r.top < window.innerHeight;
    if(v && !vis){ vis = true; if(!(window.PE && PE.reduce)) scene.play(); else scene.seek(scene.s.dur); }
    if(!v && vis){ vis = false; scene.pause(); }
  }
  setInterval(check, 400); check();
}

window.CT = {K:K, TEAM:TEAM, POSE:POSE, E:E, lerp:lerp, clamp:clamp, area:area, inside:inside, fly:fly, aim:aim,
  aimAt:aimAt, hitTime:hitTime, headOf:headOf, Top:Top, Side:Side, Scene:Scene, shuttleIcon:shuttleIcon, loopWhenVisible:loopWhenVisible};
})();
