import { ActiveModelSerializer, createServer, Factory, Model, Response } from 'miragejs';
import { faker } from '@faker-js/faker';

export type MirageUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export function makeServer() {
  const server = createServer({
    serializers: {
      aplication: ActiveModelSerializer,

    },

    models: {
      user: Model.extend<Partial<MirageUser>>({})
    },

    factories: {
      user: Factory.extend({
        name(i: number) {
          return `User ${i + 1}`;
        },
        email() {
          return faker.internet.email().toLocaleLowerCase();
        },
        createdAt() {
          return faker.date.recent({ days: 10 }).toISOString(); // Corrigido
        },
      })
    },
    
    seeds(server) {
      server.createList('user', 200); // Mais dados para testar paginação
    },
    
    routes() {
      this.namespace = 'api';
      this.timing = 750;

      this.get('/users', (schema, request) => {
        const { page = "1", per_page = "10" } = request.queryParams;

        const pageNumber = Number(page);
        const perPageNumber = Number(per_page);

        const allUsers = schema.all('user').models; 
        const total = allUsers.length;

        const pageStart = (pageNumber - 1) * perPageNumber;
        const pageEnd = pageStart + perPageNumber;

        const users = allUsers.slice(pageStart, pageEnd);

        return new Response(
          200,
          { 'x-total-count': String(total) },
          { users }
        );
      });

      this.get('/users/:id');
      this.post('/users', (schema, request) => {
        const attrs = JSON.parse(request.requestBody).user;

        const user = schema.create('user', {
          ...attrs,
          createdAt: new Date().toISOString(),
        });

        return {
          user,
        };
      });


      this.namespace = '';
      this.passthrough();
    }
  });

  return server;
}
