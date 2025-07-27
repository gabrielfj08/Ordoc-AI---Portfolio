interface UserData {
  first_name: string;
  last_name: string;
  birth_year: number;
}

export class User {
  firstName: string;
  lastName: string;
  birthYear: number;

  constructor(data: UserData) {
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.birthYear = data.birth_year;
  }
}

const data: Array<UserData> = [
  {
    first_name: 'Eduardo',
    last_name: 'Nakanishi',
    birth_year: 1994,
  },
  {
    first_name: 'Fabiana',
    last_name: 'Ramos',
    birth_year: 1998,
  }
]

const users = data.map(userData => new User(userData));
