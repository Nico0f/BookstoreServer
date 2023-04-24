import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class DeleteAvatarDto {

    @MinLength(2)
    @IsNotEmpty()
    url: string;
}