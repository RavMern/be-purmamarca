import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvailableNowDto } from './addWaitingProduct.dto';
import { AvailabeNow } from 'src/entities/availableNow.entity';
import { Repository } from 'typeorm';
import { Products } from 'src/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import sgMail from 'src/config/mailer.config';

@Injectable()
export class AvailableNowService {
  constructor(
    @InjectRepository(AvailabeNow)
    private availableNowRepository: Repository<AvailabeNow>,
    @InjectRepository(Products) private productsRepository: Repository<Products>
  ) {}
  async availableNowService(
    addWaitingProduct: CreateAvailableNowDto
  ): Promise<AvailabeNow> {
    if (!addWaitingProduct) {
      throw new Error('Data not received');
    }
    const product = await this.productsRepository.findOneBy({
      id: addWaitingProduct.productId
    });
    if (!product)
      throw new NotFoundException(
      `No se encontro el producto con id: ${addWaitingProduct.productId}`
      );
    const availableNow = new AvailabeNow();
    availableNow.name = addWaitingProduct.name;
    const foundEmail = await this.availableNowRepository.findOneBy({
      email: addWaitingProduct.email
    })
    if (foundEmail) {
      throw new ConflictException('Email already exists');
    }
    availableNow.email = addWaitingProduct.email;
    availableNow.product = product;
    return await this.availableNowRepository.save(availableNow);
  }

  async getEmails(productId: string): Promise<AvailabeNow[]> {
    const emailsAndNames = await this.availableNowRepository.find({
      where: {
        product: {
          id: productId
        }
      },
      select: ['email', 'name']
    });
    return emailsAndNames;
  }

  async notifyUsersWhenStockRestored(productId: string): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: productId }
    });

    if (!product) {
      console.log('No se encontró el producto con id: ', productId);

      throw new Error(`No se encontró el producto con id: ${productId}`);
    }

    const interestedUsers = await this.getEmails(productId);

    if (interestedUsers.length > 0) {

      const mailSent = await this.sendNotificationEmail(
        interestedUsers,
        product
      );
      if (mailSent === 'ok') {
        await this.availableNowRepository.delete({
          product: { id: productId }
        });
      }

    }
  }

  private async sendNotificationEmail(
    users: AvailabeNow[],
    product: Products
  ): Promise<string> {
    const mailList = users.map((user) => user.email);

    const msg = {
      to: mailList,
      from: 'nicolasaddamo1@gmail.com', //! cambiar este email por el de la vendedora o topcarteras
      subject: 'Producto en venta nuevamente',
      text: `El producto ${product.name} está disponible nuevamente.`,
      html: `
                    <!DOCTYPE html>
                    <html lang="es">
                    <body>
                        <h1>¡El producto está de vuelta!</h1>
                        <p>El producto <strong> ${product.name}</strong> está disponible nuevamente en nuestro stock. Encontralo en https://top-carteras.vercel.app/</p>
                    </body>
                    </html>
                `
    };
    try {
      await sgMail.send(msg);
      console.log('Email enviado');
    } catch (error) {
      console.error('Error sending newsletter email:', error);
    }
    console.log('proceso terminado');
    return 'ok';
  }
}
