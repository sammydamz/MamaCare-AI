import africastalking from 'africastalking';

// Setup credentials
const credentials = {
  apiKey: process.env.AFRICASTALKING_API_KEY || 'sandbox',
  username: process.env.AFRICASTALKING_USERNAME || 'sandbox'
};

// Initialize the SDK
const at = africastalking(credentials);

// Export the services we need
export const voice = at.VOICE;
export const sms = at.SMS;
