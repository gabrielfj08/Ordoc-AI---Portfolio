export class App {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  logo: string;
  description: string;
  prn: string;

  constructor(app) {
    this.id = app.id;
    this.name = app.name;
    this.createdAt = app.createdAt;
    this.updatedAt = app.updatedAt;
    this.logo = app.logo;
    this.description = app.description;
    this.prn = app.prn;
  }

  static create(data) {
    return new App({
      id: data.id,
      name: data.name,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      logo: data.logo,
      description: data.description,
      prn: data.prn,
    });
  }
}
