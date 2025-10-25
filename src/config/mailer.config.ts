import * as sgMail from '@sendgrid/mail';
import { config as dotenvconfig } from 'dotenv';

dotenvconfig({ path: '.env' });
console.log(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export default sgMail;
