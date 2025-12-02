import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/utils/axiosConfig";
import type { Course } from "@/types/course";
import { AuthContext, type User } from "@/context/AuthContext";
import Login from "@/components/Login";

declare global {
    interface Window {
        Razorpay: any;
    }
}

async function loadRazorpayScript(): Promise<boolean> {
    const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) return true;

    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

type CourseEnrollCardProps = {
    course: Course;
    isEnrolled: boolean;
    onEnrolledChange: (enrolled: boolean) => void; // so parent can update state
};

export function CourseEnrollCard({
    course,
    isEnrolled,
    onEnrolledChange,
}: CourseEnrollCardProps) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [loginOpen, setLoginOpen] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const handleButtonClick = async () => {
        if (!user) {
            setLoginOpen(true);
            return;
        }

        if (isEnrolled) {
            navigate(`/my-courses/${course.id}`);
            return;
        }

        await startCoursePayment();
    };

    const startCoursePayment = async () => {
        if (!user) return;

        try {
            setIsPaying(true);

            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                alert("Razorpay SDK failed to load. Please check your connection.");
                return;
            }

            // 1️⃣ Create order from backend
            const { data } = await apiClient.post(
                "/api/course-payments/create-order",
                {
                    userId: user.id,
                    courseId: course.id,
                }
            );

            if (!data?.success) {
                alert(data?.message || "Unable to create order. Please try again.");
                return;
            }

            const { key, orderId, amount, currency, courseName } = data.data;

            // 2️⃣ Setup Razorpay checkout
            const options = {
                key,
                amount,
                currency,
                name: "Artistic Vickey",
                description: courseName || course.course_name,
                order_id: orderId,
                prefill: {
                    name: user.user_name || "",
                    email: user.email || "",
                    contact: user.mobile || "",
                },
                theme: {
                    color: "#0f1b3d",
                },

                // 🔽 UPI-only config
                config: {
                    display: {
                        // Only show UPI in the list
                        sequence: ["upi"],

                        // Don't show Razorpay's default blocks (cards, netbanking, etc.)
                        preferences: {
                            show_default_blocks: false,
                        },
                    },
                },

                handler: async function (response: any) {
                    try {
                        // 3️⃣ Verify payment on backend (also auto-enroll)
                        const verifyRes = await apiClient.post(
                            "/api/course-payments/verify",
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }
                        );

                        if (verifyRes.data?.success) {
                            onEnrolledChange(true);
                            navigate(`/my-courses/${course.id}`);
                        } else {
                            alert(
                                verifyRes.data?.message ||
                                "Payment verification failed. Please contact support."
                            );
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                        alert(
                            "Payment captured but verification failed. Please contact support."
                        );
                    }
                },
                modal: {
                    ondismiss: () => {
                        // optional: handle close
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("startCoursePayment error:", err);
            alert("Unable to start payment. Please try again.");
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <>
            <aside className="lg:sticky lg:top-28 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg space-y-5 h-fit">
                {/* Show price if user not logged in (same as your logic) */}
                {!user && (
                    <div className="flex flex-col items-center">
                        <span className="text-gray-300 text-sm">Course Price</span>
                        <h3 className="text-4xl font-bold text-cyan-300 mb-2">
                            ₹{course.price}
                        </h3>
                    </div>
                )}

                <button
                    onClick={handleButtonClick}
                    disabled={isPaying}
                    className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed ${isEnrolled
                            ? "bg-green-600 hover:bg-green-500"
                            : "bg-cyan-600 hover:bg-cyan-500"
                        }`}
                >
                    {isPaying
                        ? "Processing payment..."
                        : isEnrolled
                            ? "Continue learning 🚀"
                            : "Enroll Now 🚀"}
                </button>

                <p className="text-center text-gray-400 text-sm">
                    {isEnrolled
                        ? "You're already enrolled! Continue learning and explore new modules."
                        : "Learn. Create. Showcase. • Guided lessons • Join our creative community"}
                </p>
            </aside>

            {/* Login modal (only used when needed) */}
            <Login open={loginOpen} onOpenChange={setLoginOpen} />
        </>
    );
}
