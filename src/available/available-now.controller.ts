import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AvailabeNow } from 'src/entities/availableNow.entity';
import { CreateAvailableNowDto } from './addWaitingProduct.dto';
import { AvailableNowService } from './available-now.service';

@Controller('available-now')
export class AvailableNowController {
    constructor(
        private readonly availableNowService: AvailableNowService
    ) {}

    @Post()
    async addEmail(@Body() addWaitingProduct:CreateAvailableNowDto):Promise<AvailabeNow> {
        if (!addWaitingProduct) {
          
            throw new Error('Data not received');
        }
        console.log(addWaitingProduct);
        
        return await this.availableNowService.availableNowService(addWaitingProduct)
    }

    @Get(':productId')

    async getEmails(@Param('productId') productId:string):Promise<AvailabeNow[]> {
        if(!productId) throw new Error('productId not received')
        return await this.availableNowService.getEmails(productId)
    }

}
