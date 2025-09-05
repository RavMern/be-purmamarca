import { IsNotEmpty, IsString } from "class-validator";

export class NewsLetterFormDto {

    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title is required' })
    title: string;

    @IsString({ message: 'subtitle must be a string' })
    @IsNotEmpty({ message: 'subtitle is required' })
    subtitle: string;

    @IsString({ message: 'description must be a string' })
    @IsNotEmpty({ message: 'description is required' })
    description: string;

    @IsString({ message: 'email must be a string' })
    @IsNotEmpty({ message: 'email is required' })
    email: string;

    @IsString({ message: 'name must be a string' }) 
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @IsString({ message: 'product must be a string' })
    @IsNotEmpty({ message: 'product is required' })
    productId: string;
}