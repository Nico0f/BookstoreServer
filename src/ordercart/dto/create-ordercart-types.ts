export interface Shipping {
    method: string,
    price: number,
    firstName: string,
    lastName: string,
    email: string,
    address: string,
    detail: string,
    city: string,
    country: string,
    state: string,
    postalCode: string,
    phone: string,
}

export interface CartItem {
    id: number,
    price: number,
    quantity: number,
    version: string
}