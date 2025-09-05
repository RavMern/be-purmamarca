import { Module } from '@nestjs/common';
import { AvailableNowService } from './available-now.service';
import { AvailableNowController } from './available-now.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabeNow } from 'src/entities/availableNow.entity';
import { Products } from 'src/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailabeNow, Products]), 
  ],
  providers: [AvailableNowService],
  controllers: [AvailableNowController],
  exports: [AvailableNowModule, AvailableNowService]
})
export class AvailableNowModule {}
