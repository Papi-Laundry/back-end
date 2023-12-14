const app = require('../app')
const request = require('supertest')
const { User, Category } = require('../models/index')

let tokenUser1
let tokenUser2

beforeAll(async () => {
  await request(app).post('/register').send({
    username: "pandu",
    email: "panduganteng@gmail.com",
    password: "panduganteng",
    role: "owner"
  })
  await request(app).post('/register').send({
    username: "dwiky",
    email: "dwikyganteng@gmail.com",
    password: "panduganteng",
    role: "owner"
  })

  const responseUser1 = await request(app).post('/login').send({
    usernameOrEmail: "panduganteng@gmail.com",
    password: "panduganteng"
  })
  const responseUser2 = await request(app).post('/login').send({
    usernameOrEmail: "dwikyganteng@gmail.com",
    password: "panduganteng"
  })
  
  tokenUser1 = responseUser1.body.access_token
  tokenUser2 = responseUser2.body.access_token

  await request(app).post('/laundries').send({
    name: "Joy Wash",
    location: "Jl Tanah Kusir",
    latitude: -6.260831,
    longitude: 106.781773
  })
    .set("Authorization", "Bearer " + tokenUser1)
  await request(app).post('/laundries').send({
    name: "Martis Wash",
    location: "Jl Tanah Kusir",
    latitude: -6.260831,
    longitude: 106.781773
  })
    .set("Authorization", "Bearer " + tokenUser2)

  await Category.create({
    name: "Sepatu"
  })
})

afterAll(async () => {
  await User.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true
  })
  await Category.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true
  })
})

describe("POST /laundries/:laundryId/products", () => {
  const req = {
    name: "Express",
    price: 7000,
    description: "3-4 hari",
    categoryId: 1
  }

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).post('/laundries/1/products').send(req)

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).post('/laundries/1/products').send(req)
      .set("Authorization", "panduganteng")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).post('/laundries/1/products').send(req)
      .set("Authorization", "New eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).post('/laundries/1/products').send(req)
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).post('/laundries/1/products').send(req)
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTl9.YeaC-bu0MFyeg_sZ5TvQ9rQwweroN8LVK4wNafk3a4M")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 403 (forbidden)', async () => {
    const response = await request(app).post('/laundries/1/products').send(req)
      .set("Authorization", "Bearer " + tokenUser2)

    expect(response.status).toBe(403)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Forbidden")
  })

  test('should return 400 (invalid params)', async () => {
    const response = await request(app).post('/laundries/asd/products').send(req)
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 400 (not found)', async () => {
    const response = await request(app).post('/laundries/99/products').send(req)
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })
})