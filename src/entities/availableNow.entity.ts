import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Products } from './product.entity';

@Entity()
export class AvailabeNow {
  @ApiProperty({
    example: 'd2a5e0f9-4f8b-4f3f-a932-bb6a0b1b8e3a',
    description: 'ID único del registro',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre de la persona interesada',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    example: 'juan@mail.com',
    description: 'Correo electrónico del interesado',
  })
  @Column({ type: 'varchar', nullable: false })
  email: string;

  @ApiProperty({
    type: () => Products,
    description: 'Producto asociado a la lista de espera',
  })
  @ManyToOne(() => Products, product => product.availableNow)
  product: Products;
}
