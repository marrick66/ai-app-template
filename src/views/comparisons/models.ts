export interface ComparisonEntry {
  id: string;
  report_type: string;
  section_name: string;
  year1: number;
  year2: number;
}

export interface ComparisonParams {
  report_type: string;
  section_name: string;
  year1: number;
  year2: number;
}