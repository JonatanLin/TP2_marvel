import {getData} from "./api.js";
import Fastify from 'fastify'
import handlebars from 'handlebars';
import fastifyView from '@fastify/view';

console.log(await getData("https://gateway.marvel.com/v1/public/characters"))

const fastify = Fastify({
    logger: true
})

fastify.register(fastifyView, {
    engine: {
        handlebars,
    },
    includeViewExtension: true,
    templates: 'templates',
    options: {
        partials: {
            header: 'header.hbs',
            footer: 'footer.hbs'
        }
    }
})

fastify.get('/', async function handler (request, reply) {
    const marvelChar = await getData("https://gateway.marvel.com:443/v1/public/characters")
    return reply.view('index.hbs', { marvelChar })
})

try {
    await fastify.listen({ port: 3000 })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}