// Write your tests here
const request = require('supertest')
const db = require("../data/dbConfig")
const server = require("../api/server")
const usersModel = require("../api/users/users-model")

const user1 = {username: 'creinoso', password: "food"}
const user2 = {username: 'dj', password: "twins"}


beforeAll(async ()=>{
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async ()=>{
  await db("users").truncate()
})

afterAll(async ()=> {
  await db.destroy()
})

it('correct env var', ()=>{
  expect(process.env.NODE_ENV).toBe('testing')
})

describe("mode-router functions", ()=>{
  describe("register a new user", ()=> {
    it('adds a user to the db', async () => {
      let users
      await usersModel.add(user1)
      users = await db('users')
      expect(users).toHaveLength(1)

      await usersModel.add(user2)
      users = await db('users')
      expect(users).toHaveLength(2)
    })
    it('inserted username and password', async () => {
      const User = await usersModel.add(user1)
      expect(User).toMatchObject({id:1, ...User})
    })
  })
})

describe("register api", () => {
  it("tests to see whether user was registered", async() => {
    let user
    await usersModel.add(user1)
    // console.log(await request(server).post('/api/auth/register').send(user1))
    

    user = await db('users').first()
    console.log(user)
    expect(user).toMatchObject({id:1, ...user1})
    // expect(user.password).toMatchObject(/^\$2[ayb]\$.{56}$/)
    expect(user.username).toBe(user1.username)
    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("username")
    expect(user).toHaveProperty("password")
  })
})



// test('sanity', () => {
//   expect(true).toBe(true)
// })
