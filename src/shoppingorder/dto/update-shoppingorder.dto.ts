import { PartialType } from '@nestjs/mapped-types';
import { CreateShoppingorderDto } from './create-shoppingorder.dto';

export class UpdateShoppingorderDto extends PartialType(CreateShoppingorderDto) {}
