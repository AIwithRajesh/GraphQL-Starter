import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import bodyParser from "body-parser";
import cors from "cors";

async function startServer() {
  const app = express();

  const typeDefs = `


    type Users {
      id: ID!
      name: String
      username: String
      email: String
    }

    type User {
      id: ID!
      name: String
      username: String
      email: String      
    }

    type Todo {
      id: ID!
      title: String!
      completed: Boolean
      user: User
    }
    
    type Query {
      getTodos: [Todo]
      getUsers: [Users]
      getUser(id: ID!): User
    }

  `;

  const resolvers = {
    Todo: {
      user: async (todo) => {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users/${todo.id}`
        );
        if (!res.ok) return "Error";
        const data = res.json();
        return data;
      },
    },
    Query: {
      getTodos: async () => {
        const res = await fetch("https://jsonplaceholder.typicode.com/todos");
        if (!res.ok) {
          return "Error";
        }
        const data = res.json();
        return data;
      },
      getUsers: async () => {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) return "Error";
        const data = res.json();
        return data;
      },
      getUser: async (parent, { id }) => {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users/${id}`
        );
        if (!res.ok) return "Error";
        const data = res.json();
        return data;
      },
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(server));

  app.listen(8000, () =>
    console.log("🚀 Server ready at http://localhost:8000/graphql")
  );
}

startServer();
