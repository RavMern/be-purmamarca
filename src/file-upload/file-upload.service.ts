import { Injectable } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
    constructor(
        private readonly fileUploadRepository: FileUploadRepository,
        @InjectRepository(Products) private readonly productsRepository: Repository<Products>,
    ) {}

    async uploadFiles(files: Express.Multer.File[], productId: string) {
        const product = await this.productsRepository.findOneBy({ id: productId });
        if (!product) throw new Error('Product not found');

        // Cargar múltiples archivos y obtener sus URLs
        const uploadedFiles = await Promise.all(
            files.map(file => this.fileUploadRepository.uploadFile(file)),
        );

        // Obtener las URLs seguras de cada archivo
        const updatedImgs = [
            ...(product.imgs || []), // Mantén las imágenes existentes
            ...uploadedFiles.map(file => file.secure_url), // Agrega las nuevas imágenes
        ];

        // Actualizar el producto con las nuevas imágenes
        await this.productsRepository.update(product.id, { imgs: updatedImgs });

        const updatedProduct = await this.productsRepository.findOneBy({ id: productId });
        return updatedProduct;
    }

}
