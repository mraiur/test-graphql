const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const Path = require('path');
const SERVER_PORT = 3000;

const Faker = require('faker');

let fakeUsers = [];
for( let i = 0; i < 10000; i++)
{
	fakeUsers.push({
		id: i,
		firstName: Faker.name.firstName(),
		lastName: Faker.name.lastName()
	});
}

const typeDefs = gql`
  type Query{
  	countUsers(search: String): Int
  	users(pageSize: Int!, search: String, offset: Int): [Person]
  },
  type Person{
  	id: Int
  	firstName: String
  	lastName: String
  }
`;

let filterUsers = function(args){
	let searchExp = new RegExp("^"+args.search, 'i');
	return fakeUsers.filter(user => {
		if( args.search )
		{
			return user.firstName.search(searchExp) > -1 ;
		}
		return true;
	});
};

const  resolvers = {
	Query : {
		countUsers: (a, args) => {
			return filterUsers(args).length;
		},
		users: function(a, args)
		{
			let users = filterUsers(args);

			let offset = 0;
			if( args.offset && args.offset > 0 )
			{
				offset = args.offset;
				if(args.offset > users.length){
					offset = users.length;
				}
			}
			let limit = offset+args.pageSize;
			if( limit > users.length)
			{
				limit = users.length;
			}
			return users.slice(offset, limit);
		},
	}
};


const apolloServer = new ApolloServer({ typeDefs, resolvers });

let server = express();

server.use(	express.static( Path.join(__dirname, 'public')));
server.set('views', Path.join(__dirname, 'views'));
server.set('view engine', 'pug');

server.get('/', function(req, res) {
	res.render('index', { title: 'GraphQl' });
});

apolloServer.applyMiddleware({app : server});

server.listen(SERVER_PORT);
console.log(`Running a GraphQL server not localhost:${SERVER_PORT}/graphql`);