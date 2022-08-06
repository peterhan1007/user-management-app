import gql from "graphql-tag";

export const SIGN_UP_MUTATION = gql`
  mutation registerMutation(
    $name: String!
    $title: String!
    $description: String!
    $email: String!
    $password: String!
  ) {
    register(
      name: $name
      email: $email
      title: $title
      description: $description
      password: $password
    )
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation loginMutation($name: String!, $password: String!) {
    login(name: $name, password: $password)
  }
`;

export const GET_USERS_QUERY = gql`
  query getUsers {
    users {
      id
      name
      title
      description
      email
    }
  }
`;

export const GET_USER_QUERY = gql`
  query getUser($id: Int!) {
    user(id: $id) {
      id
      name
      title
      description
      email
    }
  }
`;
