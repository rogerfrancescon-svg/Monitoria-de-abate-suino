import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AnimalEvaluation } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LOBE_WEIGHTS = {
  rightCranial: 10,
  rightMiddle: 10,
  rightCaudal: 25,
  accessory: 10,
  leftCranial: 10,
  leftMiddle: 10,
  leftCaudal: 25,
};

export const PIFFER_BRITO_WEIGHTS = {
  rightCranial: 11, // Apical direito (AD)
  rightMiddle: 11,  // Cardíaco direito (CD)
  rightCaudal: 34,  // Diafragmático direito (DD)
  accessory: 5,     // Intermediário (I)
  leftCranial: 6,   // Apical esquerdo (AE)
  leftMiddle: 6,    // Cardíaco esquerdo (CE)
  leftCaudal: 27,   // Diafragmático esquerdo (DE)
};

export function calculateAnimalStats(evaluation: Partial<AnimalEvaluation>) {
  const lobes = [
    'rightCranial',
    'rightMiddle',
    'rightCaudal',
    'accessory',
    'leftCranial',
    'leftMiddle',
    'leftCaudal',
  ] as const;

  let totalScore = 0;
  let areaAffected = 0;
  let areaAffectedPiffer = 0;

  for (const lobe of lobes) {
    const score = evaluation[lobe] || 0;
    totalScore += score;
    areaAffected += (score / 4) * LOBE_WEIGHTS[lobe];
    areaAffectedPiffer += (score / 4) * PIFFER_BRITO_WEIGHTS[lobe];
  }

  const spes = evaluation.spes || 0;
  // APPI (APP Index) only considers SPES scores of 2, 3, and 4.
  const appi = spes >= 2 ? spes : 0;

  return {
    totalScore,
    areaAffected,
    areaAffectedPiffer,
    spes,
    appi
  };
}

export function getEPIndexClassification(epIndex: number) {
  if (epIndex <= 1.49) return 'Leve';
  if (epIndex <= 2.4) return 'Intermediário';
  return 'Grave';
}

export function getAPIndexClassification(apIndex: number) {
  if (apIndex < 0.3) return 'Leve';
  if (apIndex <= 0.6) return 'Intermediário';
  return 'Grave';
}

export function getIPCategory(areaAffected: number): number {
  if (areaAffected === 0) return 0;
  if (areaAffected <= 11) return 1;
  if (areaAffected <= 21) return 2;
  if (areaAffected <= 31) return 3;
  if (areaAffected <= 41) return 4;
  if (areaAffected <= 51) return 5;
  return 6;
}

export function getIPInterpretation(ip: number) {
  if (ip <= 0.55) return 'Aceitável (Ideal)';
  if (ip <= 0.65) return 'Aceitável (Margem de segurança)';
  if (ip <= 0.89) return 'Atenção';
  return 'Grave (Situação complicada)';
}

export function getClassificationColor(classification: string) {
  switch (classification) {
    case 'Leve':
    case 'Aceitável (Ideal)':
      return 'text-emerald-400';
    case 'Intermediário':
    case 'Aceitável (Margem de segurança)':
      return 'text-amber-400';
    case 'Atenção':
      return 'text-orange-500';
    case 'Grave':
    case 'Grave (Situação complicada)':
      return 'text-red-400';
    default: return 'text-slate-400';
  }
}

export function generateId() {
  return crypto.randomUUID();
}
