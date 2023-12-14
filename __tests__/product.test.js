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

  test('should return 404 (invalid params)', async () => {
    const response = await request(app).post('/laundries/asd/products').send(req)
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 404 (not found)', async () => {
    const response = await request(app).post('/laundries/99/products').send(req)
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 400 (name required)', async () => {
    const response = await request(app).post('/laundries/1/products').send({
      ...req,
      name: ""
    })
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Name is required")
  })

  test('should return 400 (price required)', async () => {
    const response = await request(app).post('/laundries/1/products').send({
      ...req,
      price: 0
    })
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Price is required")
  })

  test('should return 400 (price only integer)', async () => {
    const response = await request(app).post('/laundries/1/products').send({
      ...req,
      price: "pandu"
    })
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Data Type")
  })

  test('should return 400 (description required)', async () => {
    const response = await request(app).post('/laundries/1/products').send({
      ...req,
      description: ""
    })
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Description is required")
  })

  test('should return 400 (category required)', async () => {
    const reqDeletedCategory = { ...req }
    delete reqDeletedCategory.categoryId
    const response = await request(app).post('/laundries/1/products').send(reqDeletedCategory)
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Category is required")
  })

  test('should return 404 (category required)', async () => {
    const response = await request(app).post('/laundries/1/products').send({
      ...req,
      categoryId: 99
    })
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "categoryId Not Found")
  })

  test('should return created product (without image)', async () => {
    const response = await request(app).post('/laundries/1/products').send(req)
      .set("Authorization", "Bearer " + tokenUser1)
    
    expect(response.status).toBe(201)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("id", 2)
    expect(response.body).toHaveProperty("name", "Express")
    expect(response.body).toHaveProperty("price", 7000)
    expect(response.body).toHaveProperty("description", "3-4 hari")
    expect(response.body).toHaveProperty("image", "https://cdn.icon-icons.com/icons2/773/PNG/512/label_icon-icons.com_64593.png")
    expect(response.body).toHaveProperty("category", "Sepatu")
  })

  test('should return created product (without image)', async () => {
    const response = await request(app).post('/laundries/1/products').send({
      ...req,
      image: "https://i.pinimg.com/originals/ad/72/7f/ad727f15820d3d211eaf2a927e5b337d.png"
    })
      .set("Authorization", "Bearer " + tokenUser1)
    
    expect(response.status).toBe(201)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("id", 3)
    expect(response.body).toHaveProperty("name", "Express")
    expect(response.body).toHaveProperty("price", 7000)
    expect(response.body).toHaveProperty("description", "3-4 hari")
    expect(response.body).toHaveProperty("image", "https://i.pinimg.com/originals/ad/72/7f/ad727f15820d3d211eaf2a927e5b337d.png")
    expect(response.body).toHaveProperty("category", "Sepatu")
  })
})

describe("PUT /laundries/:laundryId/products/:productId", () => {
  const req = {
    name: "Instant",
    price: 14000,
    description: "1-2 hari",
    categoryId: 1,
    image: "https://i.pinimg.com/originals/2c/2d/d7/2c2dd767544d5c7f42357c1737eb4847.jpg"
  }

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).put('/laundries/1/products/2').send(req)

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).put('/laundries/1/products/2').send(req)
      .set("Authorization", "panduganteng")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).put('/laundries/1/products/2').send(req)
      .set("Authorization", "New eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).put('/laundries/1/products/2').send(req)
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).put('/laundries/1/products/2').send(req)
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTl9.YeaC-bu0MFyeg_sZ5TvQ9rQwweroN8LVK4wNafk3a4M")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 403 (forbidden)', async () => {
    const response = await request(app).put('/laundries/1/products/2').send(req)
      .set("Authorization", "Bearer " + tokenUser2)

    expect(response.status).toBe(403)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Forbidden")
  })

  test('should return 404 (invalid params)', async () => {
    const response = await request(app).put('/laundries/asd/products/2').send(req)
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 404 (not found)', async () => {
    const response = await request(app).put('/laundries/99/products/2').send(req)
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 404 (invalid params)', async () => {
    const response = await request(app).put('/laundries/1/products/asd').send(req)
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 404 (not found)', async () => {
    const response = await request(app).put('/laundries/1/products/99').send(req)
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 400 (price only integer)', async () => {
    const response = await request(app).put('/laundries/1/products/2').send({
      ...req,
      price: "pandu"
    })
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Data Type")
  })

  test('should return 404 (category required)', async () => {
    const response = await request(app).put('/laundries/1/products/2').send({
      ...req,
      categoryId: 99
    })
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "categoryId Not Found")
  })

  test('should return updated product',  async () => {
    const response = await request(app).put('/laundries/1/products/2').send(req)
      .set("Authorization", "Bearer " + tokenUser1)
    
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("id", 2)
    expect(response.body).toHaveProperty("name", "Instant")
    expect(response.body).toHaveProperty("price", 14000)
    expect(response.body).toHaveProperty("category", "Sepatu")
    expect(response.body).toHaveProperty("description", "1-2 hari")
    expect(response.body).toHaveProperty("image", "https://i.pinimg.com/originals/2c/2d/d7/2c2dd767544d5c7f42357c1737eb4847.jpg")
    expect(response.body).toHaveProperty("updatedAt", expect.any(String))
  })
})

describe("GET /laundries/1/products", () => {
  test('should return 404 (invalid params)', async () => {
    const response = await request(app).get('/laundries/asd/products')

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 404 (not found)', async () => {
    const response = await request(app).get('/laundries/99/products')

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test("should return list of product laundry", async () => {
    const response = await request(app).get('/laundries/1/products')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body[0]).toBeInstanceOf(Object)
    expect(response.body[0]).toHaveProperty("id", 2)
    expect(response.body[0]).toHaveProperty("name", "Instant")
    expect(response.body[0]).toHaveProperty("price", 14000)
    expect(response.body[0].category).toBeInstanceOf(Object)
    expect(response.body[0].category).toHaveProperty("name", "Sepatu")
    expect(response.body[0]).toHaveProperty("description", "1-2 hari")
    expect(response.body[0]).toHaveProperty("image", "https://i.pinimg.com/originals/2c/2d/d7/2c2dd767544d5c7f42357c1737eb4847.jpg")
    expect(response.body[1]).toBeInstanceOf(Object)
    expect(response.body[1]).toHaveProperty("id", 3)
    expect(response.body[1]).toHaveProperty("name", "Express")
    expect(response.body[1]).toHaveProperty("price", 7000)
    expect(response.body[1].category).toBeInstanceOf(Object)
    expect(response.body[1].category).toHaveProperty("name", "Sepatu")
    expect(response.body[1]).toHaveProperty("description", "3-4 hari")
    expect(response.body[1]).toHaveProperty("image", "https://i.pinimg.com/originals/ad/72/7f/ad727f15820d3d211eaf2a927e5b337d.png")
  })
})

describe("DELETE /laundries/:laundryId/products/:productId", () => {
  test('should return 401 (invalid token)', async () => {
    const response = await request(app).delete('/laundries/1/products/2')

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).delete('/laundries/1/products/2')
      .set("Authorization", "panduganteng")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).delete('/laundries/1/products/2')
      .set("Authorization", "New eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).delete('/laundries/1/products/2')
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).delete('/laundries/1/products/2')
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTl9.YeaC-bu0MFyeg_sZ5TvQ9rQwweroN8LVK4wNafk3a4M")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 403 (forbidden)', async () => {
    const response = await request(app).delete('/laundries/1/products/2')
      .set("Authorization", "Bearer " + tokenUser2)

    expect(response.status).toBe(403)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Forbidden")
  })

  test('should return 404 (invalid params)', async () => {
    const response = await request(app).delete('/laundries/asd/products/2')
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 404 (not found)', async () => {
    const response = await request(app).delete('/laundries/99/products/2')
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 404 (invalid params)', async () => {
    const response = await request(app).delete('/laundries/1/products/asd')
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 404 (not found)', async () => {
    const response = await request(app).delete('/laundries/1/products/99')
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return deleted product', async () => {
    const response = await request(app).delete('/laundries/1/products/2')
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("id", 2)
    expect(response.body).toHaveProperty("name", "Instant")
    expect(response.body).toHaveProperty("price", 14000)
    expect(response.body).toHaveProperty("category", "Sepatu")
    expect(response.body).toHaveProperty("description", "1-2 hari")
    expect(response.body).toHaveProperty("image", "https://i.pinimg.com/originals/2c/2d/d7/2c2dd767544d5c7f42357c1737eb4847.jpg")
  })
})