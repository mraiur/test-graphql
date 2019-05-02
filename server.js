const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const Path = require('path');
const SERVER_PORT = 3000;

const Faker = require('faker');

let data = [];
for( let i = 0; i < 500; i++)
{
	data.push({
		id: i,
		firstName: Faker.name.firstName(),
		lastName: Faker.name.lastName()
	});
}

let schema = buildSchema(`
	type Query {
		name: String
	}
`);


let root = {
	getRows: () => {
		return [];
	}
};

let server = express();

server.use(	express.static( Path.join(__dirname, 'public')));
server.set('views', Path.join(__dirname, 'views'));
server.set('view engine', 'pug');

server.get('/', function(req, res) {
	res.render('index', { title: 'GraphQl' });
});
server.use('/graphql', graphqlHTTP({
	schema: schema,
	rootValue: root,
	grapiql: true
}));

server.listen(SERVER_PORT);
console.log(`Running a GraphQL server not localhost:${SERVER_PORT}/graphql`);