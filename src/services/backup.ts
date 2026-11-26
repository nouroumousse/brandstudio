import JSZip from 'jszip';
import type { BrandAsset, BrandProject, FontRecord } from '../types';
import { downloadBlob, uid } from '../utils/brand';

export async function exportProjectBackup(project:BrandProject){
  const zip=new JSZip();const folder=zip.folder('brandstudio-project')!;
  const assets=project.assets.map((a,i)=>{const path=`assets/${String(i+1).padStart(2,'0')}-${safe(a.originalName)}`;folder.file(path,a.blob);const {blob,...meta}=a;return {...meta,path};});
  const fonts=project.fonts.map((f,i)=>{const path=`fonts/${String(i+1).padStart(2,'0')}-${safe(f.fileName)}`;folder.file(path,f.blob);const {blob,...meta}=f;return {...meta,path};});
  folder.file('project.json',JSON.stringify({...project,assets,fonts,backupFormat:'brand-delivery-studio',backupVersion:1},null,2));
  const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});downloadBlob(blob,`${safe(project.name)}-project-backup.zip`);
}
export async function importProjectBackup(file:File):Promise<BrandProject>{
  if(file.size>250*1024*1024)throw new Error('This project archive exceeds the 250 MB import limit.');
  const zip=await JSZip.loadAsync(file);const jsonEntry=Object.values(zip.files).find(f=>!f.dir&&f.name.endsWith('project.json'));if(!jsonEntry)throw new Error('No project.json was found in this ZIP archive.');
  let data:any;try{data=JSON.parse(await jsonEntry.async('text'));}catch{throw new Error('The project manifest is not valid JSON.');}
  if(!data||data.backupFormat!=='brand-delivery-studio'||data.backupVersion!==1||typeof data.name!=='string')throw new Error('This is not a supported Brand Delivery Studio backup.');
  const root=jsonEntry.name.slice(0,jsonEntry.name.lastIndexOf('/')+1);
  const assets:BrandAsset[]=[];for(const item of Array.isArray(data.assets)?data.assets:[]){if(!item.path||typeof item.path!=='string')continue;const entry=zip.file(root+item.path);if(!entry)throw new Error(`Missing asset in archive: ${item.originalName||item.path}`);const binary=await entry.async('blob');const blob=new Blob([binary],{type:item.mime||'application/octet-stream'});const {path,...meta}=item;assets.push({...meta,blob,id:typeof item.id==='string'?item.id:uid()});}
  const fonts:FontRecord[]=[];for(const item of Array.isArray(data.fonts)?data.fonts:[]){if(!item.path||typeof item.path!=='string')continue;const entry=zip.file(root+item.path);if(!entry)throw new Error(`Missing font in archive: ${item.fileName||item.path}`);const binary=await entry.async('blob');const ext=String(item.fileName||'').split('.').pop()?.toLowerCase();const mime=ext==='woff2'?'font/woff2':ext==='woff'?'font/woff':ext==='ttf'?'font/ttf':ext==='otf'?'font/otf':'application/octet-stream';const blob=new Blob([binary],{type:mime});const {path,...meta}=item;fonts.push({...meta,blob,id:typeof item.id==='string'?item.id:uid()});}
  return {...data,id:uid(),assets,fonts,colors:Array.isArray(data.colors)?data.colors:[],variations:Array.isArray(data.variations)?data.variations:[],guidelineSections:Array.isArray(data.guidelineSections)?data.guidelineSections:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
}
function safe(value:string){return value.replace(/[^a-z0-9._-]+/gi,'-').replace(/^-|-$/g,'')||'asset';}
