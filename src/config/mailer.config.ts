import * as sgMail from '@sendgrid/mail';
import { config as dotenvconfig } from 'dotenv';

dotenvconfig({ path: '.env' });

// Only set API key if it's provided and valid
const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (sendgridApiKey && sendgridApiKey.startsWith('SG.')) {
  sgMail.setApiKey(sendgridApiKey);
} else if (sendgridApiKey) {
  console.warn('SENDGRID_API_KEY is set but does not have a valid format (should start with "SG.")');
}

export default sgMail;
