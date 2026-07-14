import Dexie, { Table } from 'dexie';
import { Batch, AnimalEvaluation } from './types';

export class AppDatabase extends Dexie {
  batches!: Table<Batch, string>;
  evaluations!: Table<AnimalEvaluation, string>;

  constructor() {
    super('MonitoriaAbateDB');
    this.version(1).stores({
      batches: 'id, date, batchId, farm',
      evaluations: 'id, batchId, animalIndex'
    });
  }
}

export const db = new AppDatabase();
