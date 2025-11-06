import { useEffect, useState } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, BookOpen, Calendar, ListChecks, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Attempt {
    id: number;
    student_id: number;
    course_id: number;
    answers: { question_id: number; selected_option_id: number }[];
    score: number;
    submitted_at: string;
    courses: { course_name: string };
}

interface ApiResponse {
    success: boolean;
    count: number;
    data: Attempt[];
}

export default function MockTestAttempts({ studentId }: { studentId: number }) {
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🗓️ Date filters
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const fetchAttempts = async () => {
        if (!studentId) return;

        setLoading(true);
        setError(null);

        try {
            let url = `/api/mock-test/attempts/${studentId}`;
            const params: string[] = [];
            if (startDate) params.push(`start_date=${startDate}`);
            if (endDate) params.push(`end_date=${endDate}`);
            if (params.length) url += `?${params.join("&")}`;

            const res = await apiClient.get<ApiResponse>(url);

            if (res.data?.success && res.data.data) {
                setAttempts(res.data.data);
            } else {
                setError("No attempts found.");
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to fetch attempts.";
            toast.error(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttempts();
    }, [studentId]);

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAttempts();
    };

    //  Set default range (Last 30 Days)
    useEffect(() => {
        const today = new Date();
        const past = new Date();
        past.setDate(today.getDate() - 30);
        setStartDate(past.toISOString().split("T")[0]);
        setEndDate(today.toISOString().split("T")[0]);
    }, []);


    // 🦴 Loading skeletons
    if (loading) {
        return (
            <div className="space-y-4 mt-10">
                <Skeleton className="h-6 w-48 bg-white/10" />
                <div className="space-y-3">
                    <Skeleton className="h-20 w-full bg-white/10 rounded-xl" />
                    <Skeleton className="h-20 w-full bg-white/10 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-400 mt-10 text-center">{error}</p>;
    }

    if (attempts.length === 0) {
        return (
            <div className="mt-10 text-center">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-3">
                    🧠 Mock Test Attempts
                </h2>
                <FilterBar
                    startDate={startDate}
                    endDate={endDate}
                    onStartChange={setStartDate}
                    onEndChange={setEndDate}
                    onFilter={handleFilter}
                />
                <p className="text-gray-400 mt-8">No mock test attempts yet.</p>
            </div>
        );
    }

    return (
        <div className="mt-10">
            {/* Header + Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                    🧠 Mock Test Attempts
                </h2>

                <FilterBar
                    startDate={startDate}
                    endDate={endDate}
                    onStartChange={setStartDate}
                    onEndChange={setEndDate}
                    onFilter={handleFilter}
                />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                {attempts.map((attempt) => (
                    <div
                        key={attempt.id}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-[0_0_15px_rgba(100,70,255,0.2)] backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-base font-semibold text-gray-100 flex items-center gap-2">
                                    <BookOpen className="text-cyan-400" size={16} />
                                    {attempt.courses?.course_name || "Unknown Course"}
                                </h3>
                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                    <Calendar size={13} className="text-purple-300" />
                                    {new Date(attempt.submitted_at).toLocaleString("en-IN", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy className="text-yellow-400" size={18} />
                                <span className="text-base font-semibold text-yellow-300">
                                    {attempt.score}
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-gray-300 text-xs">
                            <ListChecks size={14} className="text-green-400" />
                            <span>{attempt.answers.length} Questions Attempted</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 🧩 Responsive Filter Bar
function FilterBar({
    startDate,
    endDate,
    onStartChange,
    onEndChange,
    onFilter,
}: {
    startDate: string;
    endDate: string;
    onStartChange: (v: string) => void;
    onEndChange: (v: string) => void;
    onFilter: (e: React.FormEvent) => void;
}) {
    return (
        <form
            onSubmit={onFilter}
            className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-2"
        >
            {/* Mobile view stacked date pickers */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
                    <label className="text-sm text-gray-300 sm:hidden">From</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => onStartChange(e.target.value)}
                        className="w-full sm:w-auto bg-transparent border border-white/10 rounded-lg px-3 py-2 text-gray-200 text-sm focus:ring-2 focus:ring-cyan-400/40 outline-none"
                    />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
                    <label className="text-sm text-gray-300 sm:hidden">To</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => onEndChange(e.target.value)}
                        className="w-full sm:w-auto bg-transparent border border-white/10 rounded-lg px-3 py-2 text-gray-200 text-sm focus:ring-2 focus:ring-purple-400/40 outline-none"
                    />
                </div>
            </div>

            <Button
                type="submit"
                size="sm"
                className="mt-2 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 rounded-lg text-white text-sm font-medium"
            >
                <Filter size={14} /> Filter
            </Button>
        </form>
    );
}
