export const ONE_MINUTE_MS = 60 * 1000;
export const EXCEPTION_INTERVAL = ONE_MINUTE_MS * 2;
export const LOW_WARNING_HEART_RATE = 50;
export const HIGH_WARNING_HEART_RATE = 110;

export enum ECGWaveType {
  P = 'P',
  QRS = 'QRS',
  T = 'T',
  INV = 'INV',
}

export enum HOLTER_EXCEPTION {
  LOW = 'low heart rate',
  HIGH = 'high heart rate',
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

export interface HolterRecordExceptionItem {
  type: HOLTER_EXCEPTION;
  startTime: number;
  duration: number;
}

export interface HolterHeartRateHistoryItem {
  time: number;
  heartRate: number;
}

export interface HolterRecordSummary extends HolterRecordPatient {
  avgHeartRate: number;
  minHeartRate: number;
  minHeartRateTime: number;
  maxHeartRate: number;
  maxHeartRateTime: number;
  exceptionActivities: HolterRecordExceptionItem[];
  heartRateHistory?: HolterHeartRateHistoryItem[];
}
