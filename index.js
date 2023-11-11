import { ApolloServer, gql } from "apollo-server";
import {v1 as uuid} from 'uuid';

const persons = [
    {
        id: '1',
        name: 'John',
        age: 25,
        gender: 'male',
        address: 'managua'
    },
    {
        id: '2',
        name: 'Jane',
        age: 30,
        gender: 'female',
        hobbies: 'Viajar y conocer lugares'
    },
    {
        id: '3',
        name: 'Bob',
        age: 18,
        gender: 'male',
        address: 'león',
        hobbies: 'Ir al Gym'
    }
];

const typeDefs = gql`
type Person 
{
    id: ID!
    name: String!
    age: Int!
    gender: Gender!
    address: String
    hobbies: String
}
enum Gender {
    male
    female
}
type Query 
{
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!):Person
}
type Mutation {
    addPerson(
        name: String!
        age: Int!
        gender: Gender!
        address: String
        hobbies: String
    ): Person!
    updatePerson(id:ID!,name:String,age:Int,gender:Gender,address:String,hobbies:String): Boolean
}
`

const resolvers = {
    Query :{
        personCount:() => persons.length,
        allPersons: () => persons,
        findPerson: (root, args) => {
            return persons.find((person)=>person.name===args.name);
        }
    },
    Mutation:{
        addPerson:(root,args) => {
            const newPerson={...args, id: uuid()};
            persons.push(newPerson);
            return newPerson;
        },
        updatePerson:(root,args) => {
            let index=persons.findIndex((p)=> p.id === args.id);
            if(index !== -1){
                persons[index]=args;
                return true;
            }else{
                throw new Error('No such user');
            }           
        }
        
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
})