export async function sendSMS(mobile, otp) {
  const message = `Dear User, ${otp} is your OTP for Sanskar Tv verification Sanskar Tv`;

  const params = new URLSearchParams({
    mobile: process.env.SMS_USER,
    pass: process.env.SMS_PASS,
    senderid: process.env.SMS_SENDER,
    to: mobile,
    msg: message,
    peid: process.env.SMS_PEID,
    templateid: process.env.SMS_TEMPLATE_ID,
  });

  const url = `${process.env.SMS_API_URL}?${params.toString()}`;

  const response = await fetch(url);
  const text = await response.text();

  console.log("📩 SMS RESPONSE:", text);

  if (text.includes("SMS Sent") || text.includes("Message Id")) {
    return { success: true };
  }

  return { success: false, message: text };
}




