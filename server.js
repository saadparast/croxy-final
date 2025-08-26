import { createServer } from 'vite';

const server = await createServer({
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
  root: '/home/user/webapp'
});

await server.listen();

console.log('Vite dev server running at http://0.0.0.0:5173');