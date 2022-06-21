"use strict";const movements=[{group:"Squat",movements:[{mid:0,label:"Squats"},{mid:1,label:"Highbar squats"},{mid:2,label:"Paused squats"},{mid:3,label:"Front squats"},{mid:4,label:"SSB squats"},{mid:21,label:"Highbar paused squats"}]},{group:"Bench",movements:[{mid:5,label:"Bench press"},{mid:6,label:"Medium grip bench press"},{mid:7,label:"Close grip bench press"},{mid:8,label:"Larsen press"},{mid:9,label:"Close grip Larsen press"},{mid:10,label:"Medium grip Larsen pin press"},{mid:20,label:"Incline press"},{mid:22,label:"Log press"},{mid:23,label:"Floor press"}]},{group:"Deadlift",movements:[{mid:11,label:"Deadlifts"},{mid:12,label:"Deficit deadlifts"},{mid:13,label:"Snatch grip deadlifts"},{mid:14,label:"Block pulls"},{mid:25,label:"Sumo deadlifts"}]},{group:"Other",movements:[{mid:15,label:"Sealrow"},{mid:16,label:"Standing row"},{mid:17,label:"Pullups"},{mid:18,label:"Weighted pullups"},{mid:19,label:"Weighted dips"},{mid:24,label:"Bulgarian split squats"}]}],maxFormula=(e,t)=>e*(36/(37-t)),rpeBasedMax=r=>a=>t=>e=>maxFormula(a,t+(11-e-r)),oneRepMax=rpeBasedMax(1),presentableWeightValue=e=>{e=2.5*Math.round(e/2.5);return 0<e?e:""},b62Chars="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),decToB62=e=>{if(0==e)return 0;let t="";var a=e<0?"+":"";let r=Math.abs(e);for(;0<r;)t=b62Chars[r%62]+t,r=(r-r%62)/62;return a+t},b62ToDec=e=>{var t="+"===e[0];const a="+"===e[0]?e.slice(1):e;e=a.split("").map(t=>b62Chars.findIndex(e=>e==t)).reverse().map((e,t)=>e*62**t).reduce((e,t)=>e+t);return t?-1*e:e};class IdCreator{static latestId=1e3;static resetId(){this.latestId=1e3}static getUniqueId(){return this.latestId++}}const getStoredKeys=()=>[...Array(localStorage.length).keys()].map(e=>localStorage.key(e)),getB62FromKeyVal=(e,t)=>decToB62([e,4*t].join("")),removeStoredInputKeys=()=>getStoredKeys().filter(e=>e.match(/^(?!9999)\d{4}$/g)).map(e=>{localStorage.removeItem(e)}),getShareString=()=>getStoredKeys().filter(e=>e.match(/^\d{4}$/g)).map(e=>getB62FromKeyVal(e,localStorage.getItem(e))).join("-"),getKeyValFromB62=e=>{const t=b62ToDec(e).toString(10);return[t.slice(0,4),t.slice(4)/4]},parseShareString=e=>e.split("-").map(e=>getKeyValFromB62(e)),autosave=()=>{var e=(new Date).toISOString().slice(0,10),t=document.getElementById("9999"),a=getSetting("9999")(0),t=t.options[a].text;const r=getShareString();1<r.split("-").length&&localStorage.setItem(t+" "+e,getShareString())},importFromShareString=e=>{autosave(),removeStoredInputKeys(),parseShareString(e).map(e=>saveSetting(e[0])(e[1]))},saveSetting=t=>e=>localStorage.setItem(t,e),getSetting=t=>e=>localStorage.getItem(t)?localStorage.getItem(t):e,getBrilliantElement=(e,t,a)=>{let r=document.createElement(e);return r.classList.add(...t),"string"==typeof a?r.textContent=a:Array.isArray(a)?r.append(...a):"object"==typeof a&&r.appendChild(a),r},getBrilliantRow=e=>getBrilliantElement("tr",[],e.map(e=>getBrilliantElement("td",[],e))),getBrilliantHeaderRow=e=>getBrilliantElement("tr",[],e.map(e=>getBrilliantElement("th",[],e))),getBrilliantCheckBox=()=>{let e=document.createElement("input");return e.id=IdCreator.getUniqueId(),e.onchange=()=>saveSetting(e.id)(e.checked?1:0),e.setAttribute("type","checkBox"),e.checked="1"===getSetting(e.id)(0),e},getBrilliantNumberInput=(e,t,a,r)=>{let n=document.createElement("input");return t<100&&1==a&&n.classList.add("smallInput"),n.id=IdCreator.getUniqueId(),n.onchange=()=>saveSetting(n.id)(n.value),n.setAttribute("type","number"),n.value=getSetting(n.id)(r),n.min=e,n.max=t,n.step=a,n},getBrilliantDisabledInput=e=>{let t=document.createElement("input");return t.setAttribute("type","text"),t.value=e,t.disabled=!0,t},getShareContainer=()=>{const l=getBrilliantElement("div",["shareLinkContainer"]);return l.hidden=!0,l.addEventListener("toggleVisibility",()=>{for(;l.firstChild;)l.removeChild(l.firstChild);l.append(...getStoredKeys().filter(e=>e.match(/\d{4}-\d{2}-\d{2}$/g)).sort().map(e=>{let t=getBrilliantElement("div",["shareStringContainer"],getBrilliantElement("label",["shareStringLabel"],e));const a=getBrilliantElement("a",["clearlink"],"🗑");a.onclick=()=>{localStorage.removeItem(e),l.dispatchEvent(new Event("toggleVisibility"))};let r=getBrilliantElement("input",["presentedlink"],"");r.type="text",r.value=localStorage.getItem(e);const n=getBrilliantElement("a",["sharelink"],"Copy"),i=(n.onclick=()=>{r.select(),document.execCommand("copy")},getBrilliantElement("a",["sharelink"],"Restore"));return i.onclick=()=>{importFromShareString(r.value),ProgramContainer.renderProgram()},t.append(a,r,n,i),t}));let e=getBrilliantElement("div",["shareStringContainer"]);const t=getBrilliantElement("a",["sharelink"],"Save current");t.onclick=()=>{autosave(),l.dispatchEvent(new Event("toggleVisibility"))},e.append(t),l.append(e)}),l},getBrilliantAnchorLinkList=e=>{const t=[...Array(e.numberOfIterations).keys()],a=getBrilliantElement("div",["stickylinks"],t.map(e=>{const t=getBrilliantElement("a",["cyclelink"],"Week "+(e+1));return t.href="#cycle"+e,t})),r=getBrilliantElement("a",["sharelink"],"💾"),n=getShareContainer(),i=(r.onclick=()=>{n.dispatchEvent(new Event("toggleVisibility")),n.hidden=!n.hidden},getBrilliantElement("a",["clearlink"],"🗑"));return i.onclick=()=>{removeStoredInputKeys(),ProgramContainer.renderProgram()},a.append(r,i,n),a},getMovementSelect=(e,t)=>{const a=getBrilliantElement("select",["movementselect"]),r=(a.setAttribute("cascade",t),a.id=IdCreator.getUniqueId(),getSetting(a.id)(e));a.onchange=()=>{saveSetting(a.id)(a.value),[...document.querySelectorAll(`select[cascade$=${CSS.escape(t.slice(1))}]`)].filter(e=>e.getAttribute("cascade")[0]>t[0]).map(e=>{e.value=a.value,saveSetting(e.id)(a.value)})};e=movements.map(e=>{const t=getBrilliantElement("optgroup",[],e.movements.map(e=>{const t=getBrilliantElement("option",[],e.label);return t.value=e.mid,e.mid==r&&(t.selected=!0),t}));return t.label=e.group,t});return a.append(...e),a},getSessionMovementTable=(m,r,e)=>{let t=getBrilliantElement("fieldset",["dayContainer"],getBrilliantElement("legend",[],"Day "+(r+1)));return t.append(...e.map((e,t)=>{let p=[],a=e.sets.map(e=>Array(e.repeat(m)).fill(e)).flat();return getBrilliantElement("table",["movementContainer"],[getBrilliantElement("caption",[],getMovementSelect(e.movementId,m+"-"+r+t)),getBrilliantHeaderRow(["","Reps","Goal RPE","% of e1RM","Weight","Actual RPE","e1RM"]),...a.map((a,e)=>{const t=getBrilliantNumberInput(0,10,1,a.reps(m));var r=getBrilliantDisabledInput(null!==a.perc(m)?a.perc(m)+"%":null);const n=null!==a.perc(m)?getBrilliantDisabledInput(a.weight(m)):getBrilliantNumberInput(75,1e3,2.5,a.weight(m)),i=null==a.rpe(m)?getBrilliantDisabledInput(a.rpe(m)):getBrilliantNumberInput(5,11,.25,a.rpe(m));var l=getBrilliantDisabledInput(a.rpe(m));const s=getBrilliantDisabledInput("...");if(null!==a.perc(m)){let t=()=>{var e=p.reduce((e,t)=>Math.max(Number(e),Number(t.value)),0),t="function"==typeof a.perc?a.perc(m):Number(a.perc);n.value=presentableWeightValue(t*e/100)};t(),p.map(e=>e.addEventListener("change",t))}p.push(s);let o=()=>n.value&&t.value&&i.value?oneRepMax(Number(n.value))(Number(t.value))(Number(i.value)):null;return s.value=presentableWeightValue(o()),[t,n,i].map(e=>e.addEventListener("input",()=>{s.value=presentableWeightValue(o()),s.dispatchEvent(new Event("change"))})),getBrilliantRow([getBrilliantCheckBox(),t,l,r,n,i,s])}).flat()])})),t},getProgramSelect=e=>{const t=getBrilliantElement("select",["programselect"]),r=(t.id=9999,getSetting(t.id)(0));return t.onchange=()=>{autosave(),removeStoredInputKeys(),saveSetting(t.id)(t.value),ProgramContainer.renderProgram()},t.append(...e.map((e,t)=>{const a=getBrilliantElement("option",[],e.title);return(a.value=t)==r&&(a.selected=!0),a})),t},PROGRESSION_LINEAR=1,PROGRESSION_CONSTANT=2,PROGRESSION_NONE=3,PROGRESSION_STEPS=4,progressions={linear:(...t)=>e=>t[0]+t[1]*e,constant:(...t)=>e=>t[0],none:()=>e=>null,steps:(...t)=>e=>t[e%t.length]},getProgressionFormula=e=>{if("function"==typeof e)return e;if(void 0===e)return progressions.none();if(null==e)return progressions.none();if("number"==typeof e)return progressions.constant(e);if("object"==typeof e){if(e.type===PROGRESSION_LINEAR)return progressions.linear(...e.params);if(e.type===PROGRESSION_CONSTANT)return progressions.constant(...e.params);if(e.type===PROGRESSION_NONE)return progressions.none();if(e.type===PROGRESSION_STEPS)return progressions.steps(...e.params)}return progressions.none()},readyProgram=e=>({numberOfIterations:e.numberOfIterations,title:e.title,days:e.days.map(e=>e.map(e=>({movementId:e.movementId,sets:e.sets.map(e=>({reps:getProgressionFormula(e.reps),rpe:getProgressionFormula(e.rpe),perc:getProgressionFormula(e.perc),weight:getProgressionFormula(e.weight),repeat:null==e.repeat||void 0===e.repeat?progressions.constant(1):getProgressionFormula(e.repeat)}))})))}),setParams={reps:1,rpe:2,perc:3,weight:4,repeat:5},convertRawProgressionToArray=(e,t)=>"object"==typeof t?[e,1,t.type,t.params.length,t.params]:[],getSharableProgram=e=>[e.numberOfIterations,e.days.length,e.days.map(e=>[0,e.length,e.map(e=>[e.movementId,e.sets.length,e.sets.map(e=>[0,Object.keys(e).length,...convertRawProgressionToArray(setParams.reps,e.reps),...convertRawProgressionToArray(setParams.rpe,e.rpe),...convertRawProgressionToArray(setParams.perc,e.perc),...convertRawProgressionToArray(setParams.weight,e.weight),...convertRawProgressionToArray(setParams.repeat,e.repeat)])])])].flat(8).map(e=>decToB62(e)).map(e=>1<e.length?"-"+e.length+e:e).join(""),parseShortened=e=>e.split(/(?=-)/g).map(e=>"-"===e[0]?[e.slice(2,2+Number(e[1])),...e.slice(2+Number(e[1])).split("")]:e.split("")).flat(),parseSharableProgram=(e,t)=>{const a=parseShortened(t).map(e=>b62ToDec(e));const r=e=>({type:e[0][0],params:e[0].slice(1).flat()});return{numberOfIterations:a[0],title:e,days:((e,t)=>{let a=[0,0,0,0,0,0,e],r=[],n=!1,i=!0;return t.forEach(e=>{var t=a.findIndex(e=>0<e);i?(6==t?r.push([e]):5==t?r.at(-1).push([e]):4==t?r.at(-1).at(-1).push([e]):3==t?r.at(-1).at(-1).at(-1).push([e]):2==t?r.at(-1).at(-1).at(-1).at(-1).push([e,[]]):1==t?r.at(-1).at(-1).at(-1).at(-1).at(-1).push([e,[]]):0==t&&r.at(-1).at(-1).at(-1).at(-1).at(-1).at(-1).push([e,[]]),i=!1,n=!0):-1<t&&(n?(a[t-1]=e,n=!1,i=2<t):6==t?r.at(-1).push([e]):5==t?r.at(-1).at(-1).push(e):4==t?r.at(-1).at(-1).at(-1).push(e):3==t?r.at(-1).at(-1).at(-1).at(-1).push(e):2==t?r.at(-1).at(-1).at(-1).at(-1).at(-1).push(e):1==t?r.at(-1).at(-1).at(-1).at(-1).at(-1).at(-1).push(e):0==t&&r.at(-1).at(-1).at(-1).at(-1).at(-1).at(-1).at(-1).push(e),--a[t],a.slice(0,t+1).every(e=>0==e)&&(n=!0,i=!0))}),r})(a[1],a.slice(2)).filter(e=>"object"==typeof e&&0<e.length).map(e=>e.filter(e=>"object"==typeof e&&0<e.length).map(e=>({movementId:e[0],sets:e.slice(1).filter(e=>"object"==typeof e&&0<e.length).map(e=>{let t={};return e.slice(1).map(e=>{e[0]==setParams.reps?t.reps=r(e.slice(1)):e[0]==setParams.rpe?t.rpe=r(e.slice(1)):e[0]==setParams.perc?t.perc=r(e.slice(1)):e[0]==setParams.weight?t.weight=r(e.slice(1)):e[0]==setParams.repeat&&(t.repeat=r(e.slice(1)))}),t})})))}},standardPrograms=[{title:"Basic training program",shareString:"5601020211125-2+1212190311127-2+13112Z55121401820211125-2+1212190311127-2+13112Z55121401220211125-2+1212190311127-2+13112Z55121401920211125-2+1212190311127-2+13112Z55121401b20211125-2+1212190311127-2+13112Z55121401a20211125-2+1212190311127-2+13112Z551214"},{title:"Swiss program",shareString:"5502020211125-2+1212190311127-2+13112Z551214k20211128-2+121218031112a-2+13112Z55121402520211125-2+1212190311127-2+13112Z551214l20211125-2+1212190311127-2+13112Z55121402b20211125-2+1212190311127-2+13112Z551214720211128-2+121218031112a-2+13112Z55121402n20211125-2+1212190311127-2+13112Z551214m20211125-2+1212180311127-2+13112Z55121402p20211128-2+121218031112a-2+13112Z551214n20211128-2+121218031112a-2+13112Z551214"},{title:"Oldschool linear",shareString:"660101031121a3121W5112a-2+10181031121a3121W5112a-2+10121031121a3121W5112a-2+10191031121a3121W5112a-2+101b1031121a3121W5112a-2+101a1031121a3121W5112a-2+1"}];class ProgramContainer{static appContainer=getBrilliantElement("div",["appContainer"]);static first=!0;static renderProgram(){for(IdCreator.resetId();this.appContainer.firstChild;)this.appContainer.removeChild(this.appContainer.firstChild);const t=getBrilliantElement("div",["programContainer"]);t.addEventListener("render",e=>{for(;t.firstChild;)t.removeChild(t.firstChild);const r=e.detail.actualProgram;e=[...Array(r.numberOfIterations).keys()];t.append(...e.map(a=>{var e=getBrilliantElement("h2",[],"Week "+(a+1));let t=getBrilliantElement("div",["blockContainer"],e);return t.id="cycle"+a,t.append(...r.days.map((e,t)=>getSessionMovementTable(a,t,e))),t}))});var e=standardPrograms[getSetting("9999")(0)];const a=readyProgram(parseSharableProgram(e.title,e.shareString)),r=(t.dispatchEvent(new CustomEvent("render",{detail:{actualProgram:a}})),getBrilliantElement("div",["headerContainer"]));r.addEventListener("render",e=>{for(;r.firstChild;)r.removeChild(r.firstChild);r.append(getProgramSelect(standardPrograms),getBrilliantAnchorLinkList(a))}),r.dispatchEvent(new Event("render")),this.appContainer.append(r,t),this.first&&(document.body.append(this.appContainer),this.first=!1)}}ProgramContainer.renderProgram();
