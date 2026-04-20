// src/hooks/useCoursePayment.ts
import { useState, useCallback } from "react";
import { apiClient } from "@/utils/axiosConfig";
import { loadRazorpay } from "@/utils/loadRazorpay";

type CreateOrderResponse = {
  success: boolean;
  data: {
    paymentId: number | string;
    orderId: string;
    amount: number;
    currency: string;
    key: string;
    courseName: string;
  };
};

type VerifyResponse = {
  success: boolean;
  message?: string;
  data?: {
    invoiceNumber?: string;
    enrolledCourseId?: number | string;
    userId?: number | string;
  };
};

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type CurrentUser = {
  id: number | string;
  user_name?: string;
  email?: string;
  mobile?: string;
} | null;

export type PaymentStatus = "idle" | "creating" | "checkout" | "verifying";

interface UsePaymentOpts {
  onSuccess?: (info: {
    invoiceNumber?: string;
    courseId: number | string;
  }) => void;
  onFailure?: (message: string) => void;
  onDismiss?: () => void;
  currentUser: CurrentUser;
}

/**
 * Centralised payment flow for course purchases.
 * UPI-only — cards, netbanking, and wallets are hidden from the checkout.
 */
export function useCoursePayment({
  onSuccess,
  onFailure,
  onDismiss,
  currentUser,
}: UsePaymentOpts) {
  const [status, setStatus] = useState<PaymentStatus>("idle");

  const pay = useCallback(
    async (courseId: number | string, courseName?: string) => {
      if (!currentUser?.id) {
        onFailure?.("Please log in to continue");
        return;
      }

      try {
        // 1. Load Razorpay SDK
        setStatus("creating");
        const sdkLoaded = await loadRazorpay();
        if (!sdkLoaded) {
          setStatus("idle");
          onFailure?.(
            "Payment gateway could not load. Please check your connection and try again.",
          );
          return;
        }

        // 2. Create order on backend
        const { data } = await apiClient.post<CreateOrderResponse>(
          "/api/course-payments/create-order",
          { courseId },
        );

        if (!data?.success || !data?.data?.orderId) {
          setStatus("idle");
          onFailure?.("Could not create order. Please try again.");
          return;
        }

        const order = data.data;

        // 3. Open Razorpay checkout — UPI-only
        setStatus("checkout");

        const options = {
          key: order.key,
          order_id: order.orderId,
          amount: order.amount,
          currency: order.currency,
          name: "Artistic Vicky",
          description: order.courseName || courseName || "Course enrollment",
          prefill: {
            name: currentUser.user_name || "",
            email: currentUser.email || "",
            contact: currentUser.mobile || "",
          },
          // 🔒 UPI-only: show only the UPI block, hide everything else
          method: {
            upi: true,
            card: false,
            netbanking: false,
            wallet: false,
            emi: false,
            paylater: false,
          },
          config: {
            display: {
              blocks: {
                upi_block: {
                  name: "Pay using UPI",
                  instruments: [{ method: "upi" }],
                },
              },
              sequence: ["block.upi_block"],
              preferences: { show_default_blocks: false },
            },
          },
          theme: { color: "#0891b2" }, // matches site's cyan accent
          handler: async (response: RazorpayResponse) => {
            // 4. Verify on backend
            try {
              setStatus("verifying");
              const verify = await apiClient.post<VerifyResponse>(
                "/api/course-payments/verify",
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              );

              setStatus("idle");

              if (verify.data?.success) {
                onSuccess?.({
                  invoiceNumber: verify.data.data?.invoiceNumber,
                  courseId,
                });
              } else {
                onFailure?.(
                  verify.data?.message || "Payment verification failed",
                );
              }
            } catch (err: any) {
              setStatus("idle");
              onFailure?.(
                err?.response?.data?.message ||
                  "Payment verification failed. If money was deducted, it will be refunded.",
              );
            }
          },
          modal: {
            ondismiss: () => {
              setStatus("idle");
              onDismiss?.();
            },
          },
        };

        const Razorpay = (window as any).Razorpay;
        const rzp = new Razorpay(options);

        rzp.on("payment.failed", (response: any) => {
          setStatus("idle");
          onFailure?.(
            response?.error?.description ||
              "Payment failed. Please try again.",
          );
        });

        rzp.open();
      } catch (err: any) {
        setStatus("idle");
        onFailure?.(
          err?.response?.data?.message ||
            err?.message ||
            "Something went wrong. Please try again.",
        );
      }
    },
    [currentUser, onSuccess, onFailure, onDismiss],
  );

  return { pay, status, isBusy: status !== "idle" };
}