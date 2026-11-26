import Dexie, { type Table } from 'dexie';
import type { BrandProject } from '../types';
class StudioDatabase extends Dexie {
  projects!: Table<BrandProject, string>;
  constructor() { super('brand-delivery-studio'); this.version(1).stores({ projects: 'id, name, updatedAt' }); }
}
export const db = new StudioDatabase();
export const projectStore = {
  all: () => db.projects.orderBy('updatedAt').reverse().toArray(),
  get: (id: string) => db.projects.get(id),
  save: (project: BrandProject) => db.projects.put({ ...project, updatedAt: new Date().toISOString() }),
  remove: (id: string) => db.projects.delete(id),
};
