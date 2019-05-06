require('dotenv').config();
const express = require('express'),
    session = require('express-session')
    bodyParser = require('body-parser'),
    controller = require('./controller'),
    // [] makeExecutableSchema } = require('graphql-tools');
    { ApolloServer } = require('apollo-server-express'),
    typeDefs = require('./typeDefs/typeDefs'),
    { productResolver, categoryResolver, userResolver } = require('./resolvers/resolvers'),
    _ = require('lodash');

const mainResolver = _.merge(productResolver, categoryResolver, userResolver);


// const schema = makeExecutableSchema({typeDefs, mainResolver})

const app = express();

app.use(bodyParser.json());

app.use(session({
    saveUninitialized: false,
    resave: true,
    secret: 'Secret',
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}))

app.get('/myCart', controller.myCart);

app.post('/addToMyCart', controller.addToMyCart);

app.delete('/deleteFromCart/:id', controller.removeFromCart);

const server = new ApolloServer({
                                typeDefs, 
                                resolvers: mainResolver,
                                context: async ({req}) => {
                                    return { 
                                        req
                                    }
                                }
                            });

server.applyMiddleware({app})

app.listen(process.env.PORT, () => console.log("Listening on Port " + process.env.PORT));