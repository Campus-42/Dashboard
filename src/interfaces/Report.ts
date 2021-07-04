export interface Report {
  comment: string;
  reason: string;
  report_type: string;
  timestamp_ms: number;
  reported_uid: boolean;

  reported_by: string | boolean;

  path_to_doc: string;

  _id?: string;
}
