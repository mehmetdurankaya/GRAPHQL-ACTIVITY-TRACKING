const { ApolloServer, gql } = require("apollo-server");
const { users, events, participants, locations } = require("./data.json");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const typeDefs = gql`
  #User
  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
    event(id: ID): Event!
  }

  #Event
  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID!
    user_id: ID!
    user: User!
    participants: [Participant!]!
    location: Location!
  }
  #Location
  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }
  #Participant
  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
    user: User!
    event: Event!
  }

  type Query {
    #User
    users: [User!]!
    user(id: ID!): User!
    

    #Event
    events: [Event!]!
    event(id: ID): Event!

    #Location
    locations: [Location!]!
    location(id: ID!): Location!

    #Participant
    participants: [Participant!]!
    participant(id: ID!): Participant
  }
`;

const resolvers = {
  Query: {
    //User
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === parseInt(args.id)),

    //Event
    events: () => events,
    event: (parent, args) =>
      events.find((event) => event.id === parseInt(args.id)),

    //Location
    locations: () => locations,
    location: (parent, args) =>
      locations.find((location) => location.id === parseInt(args.id)),

    //Participant
    participants: () => participants,
    participant: (parent, args) =>
      participants.find((participant) => participant.id === parseInt(args.id)),
  },
  Event: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
    location: (parent) =>
      locations.find((location) => location.id === parent.location_id),
    participants: (parent) =>
      participants.filter((participant) => participant.event_id === parent.id),
  },
  User: {
    events: (parent) => events.filter((event) => event.user_id === parent.id),
    event: (parent, args) =>
      events.find(
        (event) => event.id === args.id && event.user_id === parent.id
      ),
  },
  Participant: {
    user: (parent) => users.find((user) => user.id === parent.user_id),
    event: (parent) => events.find((event) => event.id === parent.event_id),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      //options
    }),
  ],
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
