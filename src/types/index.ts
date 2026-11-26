export type AssetCategory = 'Primary Logo' | 'Secondary Logo' | 'Symbol / Icon' | 'Wordmark' | 'Alternative Logo' | 'Graphic' | 'Custom';
export type AssetKind = 'svg' | 'image' | 'pdf' | 'font';
export interface BrandAsset { id: string; name: string; originalName: string; category: AssetCategory; kind: AssetKind; mime: string; size: number; blob: Blob; svgText?: string; createdAt: string; width?: number; height?: number; }
export interface BrandColor { id: string; name: string; hex: string; category: string; description?: string; }
export interface FontRecord { id: string; name: string; fileName: string; blob: Blob; role: string; weight: string; style: string; }
export interface Variation { id: string; name: string; sourceAssetId: string; mode: 'original' | 'black' | 'white' | 'gray'; enabled: boolean; description: string; }
export interface GuidelineSection { id: string; title: string; body: string; enabled: boolean; }
export interface BrandProject { id: string; name: string; company: string; description: string; client: string; projectDate: string; createdAt: string; updatedAt: string; assets: BrandAsset[]; colors: BrandColor[]; fonts: FontRecord[]; variations: Variation[]; guidelineSections: GuidelineSection[]; }
export type ModuleKey = 'overview' | 'assets' | 'variations' | 'colors' | 'type' | 'favicons' | 'guidelines' | 'export' | 'settings';
