// /* eslint-disable prettier/prettier */
// import { Injectable } from '@nestjs/common';
// import { AvailableNowService } from 'src/available/available-now.service';
// import sgMail from 'src/config/mailer.config';

// @Injectable()
// export class MailerService {
//   constructor(private readonly availableNowService: AvailableNowService) {}

//   async sendNewsletterMail(newsLetterForm): Promise<void> {
//     try {
//       const users = await this.availableNowService.getEmails(
//         newsLetterForm.productId
//       );
//       const mailList = users.map(user => user.email);
//       console.log(mailList);

//       const msg = {
//         to: mailList,
//         from: 'nicolasaddamo1@gmail.com',
//         subject: 'Producto en venta nuevamente',
//         text: `este es el texto`,
//         html: `
//                 <!DOCTYPE html>
//                   <html lang="es">

//                 <body>
//                   <h1>Prueba de correo</h1>
//                   <p>Esto es un correo de prueba</p>
//                 </body>
//               </html>
//               `,
//       };
//       await sgMail.send(msg);
//     } catch (error) {
//       console.error('Error sending newsletter email:', error);
//     }
//   }
// }
