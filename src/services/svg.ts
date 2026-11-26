const blockedTags = new Set(['script','foreignObject','iframe','object','embed','audio','video']);
export function sanitizeSvg(input:string):{text:string;viewBox:string|null;warnings:string[];colors:string[]}{
  const warnings:string[]=[]; const parser=new DOMParser(); const doc=parser.parseFromString(input,'image/svg+xml');
  if(doc.querySelector('parsererror') || doc.documentElement.tagName.toLowerCase()!=='svg') throw new Error('This file is not a valid SVG document.');
  const root=doc.documentElement;
  const nodes=[root,...Array.from(root.querySelectorAll('*'))];
  nodes.forEach(el=>{
    if(blockedTags.has(el.tagName.toLowerCase())){warnings.push(`Removed unsafe <${el.tagName}> element`);if(el!==root)el.remove();return;}
    [...el.attributes].forEach(attr=>{const n=attr.name.toLowerCase(),v=attr.value.trim();if(n.startsWith('on')){el.removeAttribute(attr.name);warnings.push('Removed an event handler');} else if((n==='href'||n==='xlink:href') && v && !v.startsWith('#') && !v.startsWith('data:image/')){el.removeAttribute(attr.name);warnings.push('Removed an external asset reference');} else if((n==='style'||n==='fill'||n==='stroke') && /url\(\s*['"]?(?!#|data:image)/i.test(v)){el.removeAttribute(attr.name);warnings.push('Removed an external CSS reference');}});
  });
  root.querySelectorAll('style').forEach(style=>{const safe=style.textContent?.replace(/@import[^;]+;?/gi,'').replace(/url\(\s*['\"]?(?!#|data:image)[^)]+\)/gi,'none')||'';style.textContent=safe;});
  const colors=new Set<string>();root.querySelectorAll('[fill],[stroke],*').forEach(el=>{['fill','stroke'].forEach(k=>{const v=el.getAttribute(k);if(v && /^#[0-9a-f]{3,8}$/i.test(v))colors.add(v.toUpperCase());});});
  return {text:new XMLSerializer().serializeToString(root),viewBox:root.getAttribute('viewBox'),warnings:[...new Set(warnings)],colors:[...colors]};
}
export function recolorSvg(source:string,mode:'black'|'white'|'gray'|'original',replace?:{from:string;to:string}){
  if(mode==='original'&&!replace)return source;
  const doc=new DOMParser().parseFromString(source,'image/svg+xml'); if(doc.querySelector('parsererror'))throw new Error('SVG could not be edited safely.');
  const map=(value:string)=>{if(replace && value.toLowerCase()===replace.from.toLowerCase())return replace.to; if(mode==='original')return value;if(value==='none'||value==='transparent'||value==='currentColor'||value==='inherit'||value.startsWith('url('))return value;return mode==='black'?'#000000':mode==='white'?'#FFFFFF':'#808080';};
  doc.documentElement.querySelectorAll('*').forEach(el=>{['fill','stroke'].forEach(k=>{const v=el.getAttribute(k);if(v)el.setAttribute(k,map(v));});const style=el.getAttribute('style');if(style){el.setAttribute('style',style.replace(/(fill|stroke)\s*:\s*([^;]+)/gi,(_m,p,v)=>`${p}:${map(v.trim())}`));}});
  return new XMLSerializer().serializeToString(doc.documentElement);
}
export function svgToDataUrl(svg:string){return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;}
