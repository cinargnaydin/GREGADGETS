import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSMS(to: string, body: string) {
  if (!client || !twilioPhoneNumber) {
    console.warn('Twilio is not configured. SMS not sent.');
    return false;
  }

  try {
    const message = await client.messages.create({
      body,
      from: twilioPhoneNumber,
      to, // Must include country code, e.g., +1234567890
    });
    console.log('SMS sent successfully. SID:', message.sid);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}
