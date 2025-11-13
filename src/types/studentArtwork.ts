export interface StudentArtwork {
    id: number;
    student_name: string;
    title: string;
    city: string;
    image: string;
    created_by: number;
    created_at: string;
    updated_at: string;
}

export interface StudentArtworkResponse {
    success: boolean;
    count: number;
    data: StudentArtwork[];
}
