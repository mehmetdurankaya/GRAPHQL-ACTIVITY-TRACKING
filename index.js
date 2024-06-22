const { ApolloServer, gql } = require("apollo-server");
const { users, events, participants, locations } = require("./data.json");
const {nanoid}=require('nanoid');
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
    input createUserInput{
      username:String!
      email:String!
    }


    input updateUserInput{
      username:String
      email:String
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
  input createEventInput{
    title:String!
    desc: String!
    date: String!
    from: String
    to: String
    location_id:ID
    user_id:ID
  }

 input updateEventInput{
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: ID
    user_id: ID
 }

  #Location
  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
  }
  input createLocationInput{
    name:String!
    desc:String!
    lat:Float!    
    lng:Float!
  }
  input updateLocationInput{
    id: ID
    name: String
    desc: String
    lat: Float
    lng: Float
  }


  #Participant
  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
    user: User!
    event: Event!
  }

  input createParticipantInput{
    user_id:ID!
    event_id:ID!
  }

  input updateParticipantInput{
    id: ID
    user_id: ID
    event_id: ID    
  }

  type DeleteAllOutput{
  count:Int!
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
 type Mutation{
 # User
  addUser(data:createUserInput):User!
  updateUser(id: ID!,data:updateUserInput!):User!
  deleteUser(id:ID!):User!
  deleteAllUsers:DeleteAllOutput!

  #Event
  addEvent(data:createEventInput):Event!
  updateEvent(id:ID!, data:updateEventInput!):Event!
  deleteEvent(id:ID!):Event!
  deleteAllEvents:DeleteAllOutput!

  #Location
  addLocation(data:createLocationInput):Location!
  updateLocation(id:ID!,data:updateLocationInput!):Location!
  deleteLocation(id:ID!):Location!
  deleteAllLocations:DeleteAllOutput!


  #Participant
  addParticipant(data:createParticipantInput):Participant!  
  updateParticipant(id:ID!,data:updateParticipantInput!):Participant!
  deleteParticipant(id:ID!):Participant!
  deleteAllParticipants:DeleteAllOutput!
  }
  
`;

const resolvers = {
  Mutation:{
    //User    
    addUser:(parent,{data})=>{
      const user={
        id:nanoid(),
        ...data
      }
     users.push(user);
     return user;
    },
    updateUser:(parent,{id,data})=>{
         
        const user_index = users.findIndex((user) => user.id === parseInt(id)); 
          if(user_index === -1){         
          throw new Error("User not found");
        }
        const updated_user=users[user_index]={
          ...users[user_index],
          ...data,
        }


        return updated_user;
    },
    deleteUser:(parent,{id})=>{
      const numId=parseInt(id);
      const user_index=users.findIndex((user)=>user.id===numId);
      if(user_index===-1){
        throw new Error("User not found");
      }
      const deleted_user=users[user_index];
      users.splice(user_index, 1);
      return deleted_user;
    },
    deleteAllUsers:()=>{
      const length=users.length;
      users.splice(0,length);
      return {
        count:length,
      };
    },
    //Event
    addEvent:(parent,{data})=>{
      const event={
        id:nanoid(),
        ...data
      }
      events.push(event);
      return event;
    },
   
    updateEvent:(parent,{id,data})=>{
      const numId=parseInt(id);
       console.log(numId)
      const event_index=events.findIndex((event)=> event.id === numId);
      console.log(event_index)
      if(event_index === -1){
        throw new Error("Event not found");
      }
      const updated_event=events[event_index]={
          ...events[event_index],
          ...data,
      }
      return updated_event;

    },
    deleteEvent:(parent,{id})=>{
      const numId=parseInt(id);
      const event_index=events.findIndex((event)=>event.id===numId);
      if(event_index === -1){
        throw new Error("Event not found"); 
      }
      const deleted_event=events[event_index];
      events.splice(event_index, 1);
      return deleted_event;
    },
    deleteAllEvents:()=>{
      const length=events.length;
      events.splice(0,length);
      return {
        count:length,
      };
    },
  
    //Location
    addLocation:(parent,{data})=>{
      const location={
        id: nanoid(),
        ...data
      }
      locations.push(location);
      return location;
    },
    updateLocation:(parent,{id,data})=>{
      const numId=parseInt(id);

      const location_index=locations.findIndex((location)=>location.id===numId);
      if(location_index===-1){
        throw new Error("Location not found")
      }
      const updated_location=locations[location_index]={
        ...locations[location_index],
        ...data,
      }
      return updated_location;
    },
    deleteLocation:(parent,{id})=>{
      const numId=parseInt(id);
      const location_index=locations.findIndex((location)=>location.id===numId);
      if(location_index===-1){
        throw new Error("Location not found");
      }
      const deleted_location=locations[location_index];
      locations.splice(location_index, 1);
      return deleted_location;
    },
    deleteAllLocations:()=>{
      const length=locations.length;
      locations.splice(0,length);
      return {
        count:length,
      };
    },

    //Participant
    addParticipant:(parent,{data})=>{
      const participant={
        id:nanoid(),
        ...data
      }
      participants.push(participant);
      return participant;
    },
    updateParticipant:(parent,{id,data})=>{
      const numId=parseInt(id);

      const participant_index=participants.findIndex((participant)=>participant.id===numId);
      if(participant_index===-1){
        throw new Error("Participant not found");
      }
      const updated_participant=participants[participant_index]={
        ...participants[participant_index],
        ...data,
      }
      return updated_participant;
    },
    deleteParticipant:(parent,{id})=>{
      const numId=parseInt(id);
      const participant_index=participants.findIndex((participant)=>participant.id===numId);
      if(participant_index===-1){
        throw new Error("Participant not found");
      }
      const deleted_participant=participants[participant_index];
      participants.splice(participant_index, 1);
      return deleted_participant;
    },
    deleteAllParticipants:()=>{
      const length=participants.length;
      participants.splice(0,length);
      return {
        count:length,
      };
    },
  },
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
