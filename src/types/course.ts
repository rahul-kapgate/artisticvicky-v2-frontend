export interface Course {
    id: number;
    course_name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    level: string | null;
    language: string | null;
    duration: string | null;
    is_published: boolean | null;
    created_by: number;
    students_enrolled: number[] | null;
    rating: number;
    tags: string[] | null;
    created_at: string;
  }
  
  export interface CourseResponse {
    success: boolean;
    message: string;
    count: number;
    data: Course[];
  }
  