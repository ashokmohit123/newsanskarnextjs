// tempOtpStore.js
const otpStore = new Map();

export function saveOTP(mobile, otp) {
  otpStore.set(mobile, {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  });
}

export function verifyOTP(mobile, otp) {
  const data = otpStore.get(mobile);
  if (!data) return false;
  if (Date.now() > data.expires) return false;
  return data.otp === otp;
}
