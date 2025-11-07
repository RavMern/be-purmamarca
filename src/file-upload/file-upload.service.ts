import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { FileUploadRepository } from './file-upload.repository';

@Injectable()
export class FileUploadService {
  constructor(
    private readonly fileUploadRepository: FileUploadRepository,
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>
  ) {}

  async uploadFiles(
    files: Express.Multer.File[],
    productId: string
  ): Promise<Products> {
    let product: Products | null;

    try {
      product = await this.productsRepository.findOne({
        where: { id: productId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching product: ' +
          (error instanceof Error ? error.message : String(error))
      );
    }

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    // Subir múltiples archivos
    const uploadedFiles = await Promise.all(
      files.map(file => this.fileUploadRepository.uploadFile(file))
    );

    // Obtener URLs de manera segura (Firebase devuelve 'url' o 'secure_url')
    const newImgs: string[] = uploadedFiles
      .filter(file => file && (file.url || file.secure_url))
      .map(file => file.url || file.secure_url || '');

    const existingImgs: string[] = Array.isArray(product.imgs)
      ? product.imgs
      : [];
    const updatedImgs = [...existingImgs, ...newImgs];

    // Actualizar el producto con las nuevas imágenes
    await this.productsRepository.update(product.id, { imgs: updatedImgs });

    // Devolver el producto actualizado
    const updatedProduct = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!updatedProduct) {
      throw new InternalServerErrorException('Error fetching updated product');
    }

    return updatedProduct;
  }
  async uploadTempFiles(files: Express.Multer.File[]) {
    try {
      const uploadedFiles = await Promise.all(
        files.map(file => this.fileUploadRepository.uploadFile(file))
      );

      const urls = uploadedFiles
        .filter(file => file && (file.url || file.secure_url))
        .map(file => file.url || file.secure_url || '');

      return urls;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error uploading temporary files: ' +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }

}
