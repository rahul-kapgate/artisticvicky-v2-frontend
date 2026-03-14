export type MasterclassDetails = {
  id?: number;
  course_id?: number;
  masterclass_start_at?: string;
  masterclass_end_at?: string;
  meeting_provider?: "zoom" | "google_meet" | "custom" | null;
  meeting_url?: string | null;
  meeting_visible_before_minutes?: number;
  approval_required?: boolean;
  ppt_file_url?: string | null;
  ppt_file_name?: string | null;
  masterclass_status?: "draft" | "published" | "completed" | "cancelled";
  created_at?: string;
  updated_at?: string;
};

export type Course = {
  id: number;
  course_name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  level?: string;
  language?: string;
  duration?: string;
  is_published?: boolean;
  created_by?: number;
  students_enrolled?: number[];
  rating?: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  price_without_discount?: number;
  course_type?: "course" | "masterclass";
  masterclass_details?: MasterclassDetails | null;
};

export interface CourseResponse {
  success: boolean;
  message: string;
  count: number;
  data: Course[];
}
