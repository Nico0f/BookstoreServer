import { CartItem, Shipping } from './create-ordercart-types'

export class CreateOrdercartDto {
    shipping: Shipping
    subTotal: CartItem[]
}