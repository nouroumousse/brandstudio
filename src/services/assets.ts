import type { AssetCategory, BrandAsset, BrandProject, FontRecord } from '../types';
import { uid } from '../utils/brand';
import { sanitizeSvg } from './svg';
const MAX_FILE = 40 * 1024 * 1024;
const categories:AssetCategory[]=['Primary Logo','Secondary Logo','Symbol / Icon','Wordmark','Alternative Logo','Graphic','Custom'];
export async function importFiles(files:FileList|File[],project:BrandProject){
  const added:BrandAsset[]=[];const errors:string[]=[];
  for(const file of Array.from(files)){
    try{
      if(file.size>MAX_FILE)throw new Error('File exceeds the 40 MB limit.');
      const ext=file.name.split('.').pop()?.toLowerCase()||'';
      if(ext==='svg'||file.type==='image/svg+xml'){
        const raw=await file.text();const clean=sanitizeSvg(raw);const blob=file;
        added.push({id:uid(),name:file.name.replace(/\.svg$/i,''),originalName:file.name,category:guessCategory(file.name),kind:'svg',mime:'image/svg+xml',size:file.size,blob,svgText:clean.text,createdAt:new Date().toISOString()});
      } else if(['png','jpg','jpeg','webp'].includes(ext) || ['image/png','image/jpeg','image/webp'].includes(file.type)){
        const bitmap=await createImageBitmap(file);const width=bitmap.width,height=bitmap.height;bitmap.close();
        added.push({id:uid(),name:file.name.replace(/\.[^.]+$/,''),originalName:file.name,category:guessCategory(file.name),kind:'image',mime:file.type||`image/${ext}`,size:file.size,blob:file,createdAt:new Date().toISOString(),width,height});
      } else if(ext==='pdf'||file.type==='application/pdf'){
        added.push({id:uid(),name:file.name.replace(/\.pdf$/i,''),originalName:file.name,category:'Custom',kind:'pdf',mime:'application/pdf',size:file.size,blob:file,createdAt:new Date().toISOString()});
      } else if(['ttf','otf','woff','woff2'].includes(ext)) throw new Error('Font files belong in the Typography module.');
      else throw new Error('Unsupported file type. Use SVG, PNG, JPEG, WebP or PDF.');
    }catch(e){errors.push(`${file.name}: ${e instanceof Error?e.message:'Could not read file'}`);}
  }
  const names=new Set(project.assets.map(a=>a.originalName.toLowerCase()));
  added.forEach(a=>{if(names.has(a.originalName.toLowerCase()))a.name=`${a.name} (copy)`;});
  return {assets:added,errors};
}
function guessCategory(name:string):AssetCategory{const n=name.toLowerCase();if(/symbol|icon|mark/.test(n))return 'Symbol / Icon';if(/secondary|alt/.test(n))return 'Secondary Logo';if(/wordmark|type/.test(n))return 'Wordmark';if(/primary|logo/.test(n))return 'Primary Logo';return 'Custom';}
export async function importFonts(files:FileList|File[]){const fonts:FontRecord[]=[];const errors:string[]=[];for(const file of Array.from(files)){const ext=file.name.split('.').pop()?.toLowerCase();if(!['ttf','otf','woff','woff2'].includes(ext||'')){errors.push(`${file.name}: Unsupported font format.`);continue;}if(file.size>25*1024*1024){errors.push(`${file.name}: Font exceeds 25 MB.`);continue;}fonts.push({id:uid(),name:file.name.replace(/\.[^.]+$/,''),fileName:file.name,blob:file,role:'Supporting',weight:'400',style:'normal'});}return {fonts,errors};}
