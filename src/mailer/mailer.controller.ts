import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MailerService } from './mailer.service';
import { NewsLetterFormDto } from './newsLetterForm.dto';

@ApiTags('mailer')
@Controller('mailer')
export class MailerController {
  constructor(private readonly appService: MailerService) {}

  @Post('newsletter')
  @ApiOperation({ summary: 'Enviar newsletter por email' })
  @ApiBody({ type: NewsLetterFormDto })
  @ApiResponse({
    status: 200,
    description: 'Newsletter enviado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Newsletter sent successfully' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o errores de validación',
  })
  @ApiBearerAuth()
  async sendNewsletterMailController(
    @Body() newsLetterForm: NewsLetterFormDto
  ) {
    if (
      !newsLetterForm.title ||
      !newsLetterForm.subtitle ||
      !newsLetterForm.description
    )
      return 'Titulo, Subtitulo y Descripción son requeridos.';

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
