import { IsEmail, MinLength, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingDto {
    
    @IsNotEmpty()
    @IsString()
    address: String

    @IsNotEmpty()
    @IsString()
    addressNumber: String

    @IsOptional()
    @IsString()
    details?: String

    @IsNotEmpty()
    @IsString()
    city: String
    
    @IsNotEmpty()
    @IsString()
    country: String
    
    @IsNotEmpty()
    @IsString()
    state: String
    
    @IsNotEmpty()
    @IsString()
    postalCode: String
}
