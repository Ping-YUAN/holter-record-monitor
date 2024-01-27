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
}
