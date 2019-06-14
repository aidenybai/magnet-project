import Client from './Client.js';
const client = new Client({ port: process.env.PORT });

client.start();