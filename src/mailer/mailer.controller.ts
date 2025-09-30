// import { Body, Controller, Post } from '@nestjs/common';
// import { MailerService } from './mailer.service';
// import { NewsLetterFormDto } from './newsLetterForm.dto';

// @Controller('mailer')
// export class MailerController {
//   constructor(private readonly appService: MailerService) {}

//   @Post('newsletter')
//   async sendNewsletterMailController(
//     @Body() newsLetterForm: NewsLetterFormDto
//   ) {
//     if (
//       !newsLetterForm.title ||
//       !newsLetterForm.subtitle ||
//       !newsLetterForm.description
//     )
//       return 'Titulo, Subtitulo y Descripción son requeridos.';

//     if (newsLetterForm.title.length < 5 || newsLetterForm.title.length > 20)
//       return 'Titulo, debe tener entre 5 y 20 caracteres.';

//     if (
//       newsLetterForm.subtitle.length < 5 ||
//       newsLetterForm.subtitle.length > 20
//     )
//       return 'Subtitulo, debe tener entre 5 y 20 caracteres.';

//     if (newsLetterForm.description.length < 5)
//       return 'Descripción, debe tener mas de 5 caracteres.';

//     return await this.appService.sendNewsletterMail(newsLetterForm);
//   }
// }
