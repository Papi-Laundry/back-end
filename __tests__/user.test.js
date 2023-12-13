const app = require('../app')
const request = require('supertest')
const { User } = require('../models/index')

afterAll(async () => {
  await User.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true
  })
})

describe('POST /register', () => {
  const req = {
    username: "PaNdu",
    email: "panduganteng@gmail.com",
    password: "panduganteng",
    role: "owner"
  }

  test('should return 400 (username required)', async () => {
    const response = await request(app).post('/register').send({
      ...req,
      username: ""
    })

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Username is required")
  })

  test('should return 400 (email required)', async () => {
    const response = await request(app).post('/register').send({
      ...req,
      email: ""
    })

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Email is required")
  })

  test('should return 400 (password required)', async () => {
    const response = await request(app).post('/register').send({
      ...req,
      password: ""
    })

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Password is required")
  })

  test('should return 400 (role required)', async () => {
    const response = await request(app).post('/register').send({
      ...req,
      role: ""
    })

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Role is required")
  })

  test('should return 400 (email invalid)', async () => {
    const response = await request(app).post('/register').send({
      ...req,
      email: "panduganteng"
    })

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Email is invalid")
  })

  test('should return 400 (password less than 6)', async () => {
    const response = await request(app).post('/register').send({
      ...req,
      password: "pandu"
    })

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Password must more than 6 characters")
  })

  test('should return 400 (role only owner or client)', async () => {
    const response = await request(app).post('/register').send({
      ...req,
      role: "admin"
    })

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Role only have owner or client")
  })

  test('should return created user', async () => {
    const response = await request(app).post('/register').send(req)

    expect(response.status).toBe(201)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('id', 1)
    expect(response.body).toHaveProperty('userId', 1)
    expect(response.body).toHaveProperty('username', "pandu")
    expect(response.body).toHaveProperty('name', "Pandu")
    expect(response.body).toHaveProperty('email', "panduganteng@gmail.com")
    expect(response.body).toHaveProperty('role', "owner")
    expect(response.body).toHaveProperty('image', "https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png")
    expect(response.body).toHaveProperty('createdAt', expect.any(String))
    expect(response.body).not.toHaveProperty('password')
  })

  test('should return 400 (username already exist)', async () => {
    const response = await request(app).post('/register').send({
      ...req,
      email: "pandu@gmail.com"
    })

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Username is already exist")
  })

  test('should return 400 (email already exist)', async () => {
    const response = await request(app).post('/register').send({
      ...req,
      username: "panduganteng"
    })

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Email is already exist")
  })
})

describe('POST /login', () => {
  test('should return 400 (invalid usernameOrEmail)', async () => {
    const response = await request(app).post('/login')

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Invalid Login")
  })

  test('should return 400 (invalid usernameOrEmail)', async () => {
    const response = await request(app).post('/login').send({
      usernameOrEmail: "panduganteng",
      password: "pandu"
    })

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Invalid Login")
  })

  test('should return 400 (invalid password)', async () => {
    const response = await request(app).post('/login').send({
      usernameOrEmail: "pandu",
      password: "pandu"
    })

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('message', "Invalid Login")
  })

  test('should return access token (login with username)', async () => {
    const response = await request(app).post('/login').send({
      usernameOrEmail: "pandu",
      password: "panduganteng"
    })
  
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('access_token', expect.any(String))
  })

  test('should return access token (login with email)', async () => {
    const response = await request(app).post('/login').send({
      usernameOrEmail: "panduganteng@gmail.com",
      password: "panduganteng"
    })

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('access_token', expect.any(String))
  })
})

describe('GET /profiles', () => {
  let token
  beforeAll(async () => {
    const response = await request(app).post('/login').send({
      usernameOrEmail: "panduganteng@gmail.com",
      password: "panduganteng"
    })

    token = response.body.access_token
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).get('/profiles')

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).get('/profiles').set("Authorization", "panduganteng")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).get('/profiles').set("Authorization", "New eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).get('/profiles').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).get('/profiles').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTl9.YeaC-bu0MFyeg_sZ5TvQ9rQwweroN8LVK4wNafk3a4M")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return user profiles', async () => {
    const response = await request(app).get('/profiles').set("Authorization", "Bearer " + token)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('id', 1)
    expect(response.body).toHaveProperty('name', "Pandu")
    expect(response.body).toHaveProperty('image', "https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png")
  })
})

describe('PUT /profiles', () => {
  let token
  beforeAll(async () => {
    const response = await request(app).post('/login').send({
      usernameOrEmail: "panduganteng@gmail.com",
      password: "panduganteng"
    })

    token = response.body.access_token
  })

  const req = {
    name: "Dwiky Pandu Aqri",
    image: "https://placekitten.com/g/400/300"
  }

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).put('/profiles').send(req)

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).put('/profiles').send(req).set("Authorization", "panduganteng")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return updated user', async () => {
    const response = await request(app).put('/profiles').send(req)
      .set("Authorization", "Bearer " + token)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty('id', 1)
    expect(response.body).toHaveProperty('name', "Dwiky Pandu Aqri")
    expect(response.body).toHaveProperty('image', "https://placekitten.com/g/400/300")
    expect(response.body).toHaveProperty('updatedAt', expect.any(String))
  })
})