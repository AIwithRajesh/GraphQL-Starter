import "./App.css";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

function App() {
  const query = gql`
    query GetTodosWithUser {
      getTodos {
        id
        title
        completed
        user {
          name
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(query);

  if (error) return <h1>Somwthing wrong</h1>;
  if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <p>{JSON.stringify(data)}</p>
    </>
  );
}

export default App;
