export class Address {
  id: number;
  street: string;
  number: number;
  complement: string;
  postalCode: string;
  city: string;
  state: string;
  neighborhood: string;

  constructor(address) {
    this.id = address.id;
    this.street = address.street;
    this.number = address.number;
    this.complement = address.complement;
    this.postalCode = address.postalCode;
    this.city = address.city;
    this.state = address.state;
    this.neighborhood = address.neighborhood;
  }

  static create(data) {
    return new Address({
      id: data.id,
      street: data.street,
      number: data.number,
      complement: data.complement,
      postalCode: data.postal_code,
      city: data.city,
      state: data.state,
      neighborhood: data.neighborhood,
    });
  }
}
