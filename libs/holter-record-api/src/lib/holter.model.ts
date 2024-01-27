export const ONE_MINUTE_MS = 60 * 1000;

export enum ECGWaveType {
  P = 'P',
  QRS = 'QRS',
  T = 'T',
  INV = 'INV',
}

export enum ECGWaveTag {
  '',
}

export interface HolterRecordItem {
  type: ECGWaveType;
  waveStart: number;
  waveEnd: number;
  waveTag?: ECGWaveTag[];
}

export interface HolterRecordPatient {
  patientName: string;
  id: string;
  read: boolean;
}

export interface HolterRecordUpdatedData extends HolterRecordPatient {
  recordStart: number;
  recordEnd: number;
}

export interface HolterRecord extends HolterRecordPatient {
  startTime: number;
  records: HolterRecordItem[];
}

export interface HolterRecordSummary extends HolterRecordPatient {
  avgHeartRate: number;
  minHeartRate: number;
  minHeartRateTime: number;
  maxHeartRate: number;
  maxHeartRateTime: number;
}
