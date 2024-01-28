export enum HOLTER_HEART_RATE_EXCEPTION {
  LOW = 'low heart rate',
  HIGH = 'high heart rate',
}

export interface HolterRecordPatient {
  patientName: string;
  id: string;
  read: boolean;
}
export interface HolterRecordPatient {
  patientName: string;
  id: string;
  read: boolean;
}

export interface HolterRecordExceptionItem {
  type: HOLTER_HEART_RATE_EXCEPTION;
  startTime: string;
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
}
export interface HolterRecordReadableSummary {
  avgHeartRate: number;
  minHeartRate: number;
  minHeartRateTime: string; // time string
  maxHeartRate: number;
  maxHeartRateTime: string; // time string
  exceptionActivities?: HolterRecordExceptionItem[];
  heartRateHistory?: HolterHeartRateHistoryItem[];
}
