// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}
import { IsEmail, MinLength, IsString } from 'class-validator';

export class UpdateUserDto {
    
    @MinLength(2)
    @IsString()
    firstName?: string;
    
    @MinLength(2)
    @IsString()
    lastName?: string;
    
    @IsEmail()
    email?: string;
}
