import { apiClient } from "@/utils/axiosConfig";

export interface RequestDeleteOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyDeleteOtpResponse {
  success: boolean;
  message: string;
  deletionScheduledAt?: string;
}

/**
 * Send deletion OTP to the logged-in user's email
 */
export const requestDeleteAccountOtp =
  async (): Promise<RequestDeleteOtpResponse> => {
    const { data } = await apiClient.post("/api/account/delete/request-otp");

    return data;
  };

/**
 * Verify deletion OTP and schedule account deletion
 */
export const verifyDeleteAccountOtp = async (
  otp: string,
): Promise<VerifyDeleteOtpResponse> => {
  const { data } = await apiClient.post("/api/account/delete/verify-otp", {
    otp,
  });

  return data;
};
