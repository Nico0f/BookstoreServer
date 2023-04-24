import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdercartDto } from './create-ordercart.dto';

export class UpdateOrdercartDto extends PartialType(CreateOrdercartDto) {}
