const app = require('../app')
const request = require('supertest')
const { Laundry, User } = require('../models/index')

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
    role: "client"
  })
})

afterAll(async () => {
  await User.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true
  })
})

describe('POST /laundries', () => {
  let tokenOwner
  let tokenClient
  beforeAll(async () => {
    const responseOwner = await request(app).post('/login').send({
      usernameOrEmail: "panduganteng@gmail.com",
      password: "panduganteng"
    })

    const responseClient = await request(app).post('/login').send({
      usernameOrEmail: "dwiky",
      password: "panduganteng"
    })

    tokenOwner = responseOwner.body.access_token
    tokenClient = responseClient.body.access_token
  })

  const req = {
    name: "Joy Wash",
    location: "Jl Tanah Kusir",
    latitude: -6.260831,
    longitude: 106.781773
  }

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).post('/laundries').send(req)

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).post('/laundries').send(req).set("Authorization", "panduganteng")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).post('/laundries').send(req)
      .set("Authorization", "New eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).post('/laundries').send(req)
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).post('/laundries/').send(req)
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTl9.YeaC-bu0MFyeg_sZ5TvQ9rQwweroN8LVK4wNafk3a4M")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 403 (forbidden)', async () => {
    const response = await request(app).post('/laundries').send(req)
      .set("Authorization", "Bearer " + tokenClient)

    expect(response.status).toBe(403)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Forbidden")
  })

  test('should return 400 (name required)', async () => {
    const response = await request(app).post('/laundries').send({
      ...req,
      name: ""
    }).set("Authorization", "Bearer " + tokenOwner)

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Name is required")
  })

  test('should return 400 (location required)', async () => {
    const response = await request(app).post('/laundries').send({
      ...req,
      location: ""
    }).set("Authorization", "Bearer " + tokenOwner)

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Location is required")
  })

  test('should return 400 (latitude required)', async () => {
    const response = await request(app).post('/laundries').send({
      ...req,
      latitude: ""
    }).set("Authorization", "Bearer " + tokenOwner)

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Google maps input is required (latitude)")
  })

  test('should return 400 (longitude required)', async () => {
    const response = await request(app).post('/laundries').send({
      ...req,
      longitude: ""
    }).set("Authorization", "Bearer " + tokenOwner)

    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Google maps input is required (longitude)")
  })

  test('should return 400 (latitude only double)', async () => {
    const response = await request(app).post('/laundries').send({
      ...req,
      latitude: "Jl Tanah Kusir"
    }).set("Authorization", "Bearer " + tokenOwner)
  
    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Latitude is invalid")
  })

  test('should return 400 (longitude only double)', async () => {
    const response = await request(app).post('/laundries').send({
      ...req,
      longitude: "Jl Tanah Kusir"
    }).set("Authorization", "Bearer " + tokenOwner)
  
    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Longitude is invalid")
  })

  test('should return created laundry (without image)', async () => {
    const response = await request(app).post('/laundries').send(req)
      .set("Authorization", "Bearer " + tokenOwner)

    expect(response.status).toBe(201)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("id", 1)
    expect(response.body).toHaveProperty("name", "Joy Wash")
    expect(response.body).toHaveProperty("location", "Jl Tanah Kusir")
    expect(response.body).toHaveProperty("latitude", -6.260831)
    expect(response.body).toHaveProperty("longitude", 106.781773)
    expect(response.body).toHaveProperty("image", "https://i.pinimg.com/originals/1f/1c/55/1f1c55442e45f24420754ce64351f6c0.png")
    expect(response.body).toHaveProperty("createdAt", expect.any(String))
  })

  test('should return created laundry (with image)', async () => {
    const response = await request(app).post('/laundries').send({
      ...req,
      image: "https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/04/washing-machine-minimal-laundry-room-interior-design-scaled.jpg"
    })
      .set("Authorization", "Bearer " + tokenOwner)

    expect(response.status).toBe(201)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("id", 2)
    expect(response.body).toHaveProperty("name", "Joy Wash")
    expect(response.body).toHaveProperty("location", "Jl Tanah Kusir")
    expect(response.body).toHaveProperty("latitude", -6.260831)
    expect(response.body).toHaveProperty("longitude", 106.781773)
    expect(response.body).toHaveProperty("image", "https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/04/washing-machine-minimal-laundry-room-interior-design-scaled.jpg")
    expect(response.body).toHaveProperty("createdAt", expect.any(String))
  })
})

describe('GET /laundries', () => {
  test('should return list of laundry', async () => {
    const response = await request(app).get('/laundries')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body[0]).toBeInstanceOf(Object)
    expect(response.body[0]).toHaveProperty("id", 1)
    expect(response.body[0]).toHaveProperty("name", "Joy Wash")
    expect(response.body[0]).toHaveProperty("location", "Jl Tanah Kusir")
    expect(response.body[0]).toHaveProperty("latitude", -6.260831)
    expect(response.body[0]).toHaveProperty("longitude", 106.781773)
    expect(response.body[0]).toHaveProperty("image", "https://i.pinimg.com/originals/1f/1c/55/1f1c55442e45f24420754ce64351f6c0.png")
    expect(response.body[0].owner).toBeInstanceOf(Object)
    expect(response.body[0].owner).toHaveProperty("id", 1)
    expect(response.body[0].owner).toHaveProperty("name", "Pandu")
    expect(response.body[0].owner).toHaveProperty("image", "https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png")
    expect(response.body[1]).toBeInstanceOf(Object)
    expect(response.body[1]).toHaveProperty("id", 2)
    expect(response.body[1]).toHaveProperty("name", "Joy Wash")
    expect(response.body[1]).toHaveProperty("location", "Jl Tanah Kusir")
    expect(response.body[1]).toHaveProperty("latitude", -6.260831)
    expect(response.body[1]).toHaveProperty("longitude", 106.781773)
    expect(response.body[1]).toHaveProperty("image", "https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/04/washing-machine-minimal-laundry-room-interior-design-scaled.jpg")
    expect(response.body[1].owner).toBeInstanceOf(Object)
    expect(response.body[1].owner).toHaveProperty("id", 1)
    expect(response.body[1].owner).toHaveProperty("name", "Pandu")
    expect(response.body[1].owner).toHaveProperty("image", "https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png")
  })
})

describe('GET /laundries/:laundryId', () => {
  test('should return 400 (invalid params)', async () => {
    const response = await request(app).get('/laundries/asd')

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 400 (not found)', async () => {
    const response = await request(app).get('/laundries/99')

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return laundry', async () => {
    const response = await request(app).get('/laundries/1')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("id", 1)
    expect(response.body).toHaveProperty("name", "Joy Wash")
    expect(response.body).toHaveProperty("location", "Jl Tanah Kusir")
    expect(response.body).toHaveProperty("latitude", -6.260831)
    expect(response.body).toHaveProperty("longitude", 106.781773)
    expect(response.body).toHaveProperty("image", "https://i.pinimg.com/originals/1f/1c/55/1f1c55442e45f24420754ce64351f6c0.png")
    expect(response.body.owner).toBeInstanceOf(Object)
    expect(response.body.owner).toHaveProperty("id", 1)
    expect(response.body.owner).toHaveProperty("name", "Pandu")
    expect(response.body.owner).toHaveProperty("image", "https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png")
  })
})

describe('PUT /laundries/:laundryId', () => {
  let tokenUser1
  let tokenUser2
  beforeAll(async () => {
    const responseUser1 = await request(app).post('/login').send({
      usernameOrEmail: "panduganteng@gmail.com",
      password: "panduganteng"
    })

    const responseUser2 = await request(app).post('/login').send({
      usernameOrEmail: "dwiky",
      password: "panduganteng"
    })

    tokenUser1 = responseUser1.body.access_token
    tokenUser2 = responseUser2.body.access_token
  })

  const req = {
    image: "https://i.pinimg.com/originals/ad/72/7f/ad727f15820d3d211eaf2a927e5b337d.png"
  }

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).put('/laundries/1').send(req)

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).put('/laundries/1').send(req).set("Authorization", "panduganteng")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).put('/laundries/1').send(req)
      .set("Authorization", "New eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).put('/laundries/1').send(req)
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).put('/laundries/1').send(req)
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTl9.YeaC-bu0MFyeg_sZ5TvQ9rQwweroN8LVK4wNafk3a4M")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 403 (forbidden)', async () => {
    const response = await request(app).put('/laundries/1').send(req)
      .set("Authorization", "Bearer " + tokenUser2)

    expect(response.status).toBe(403)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Forbidden")
  })

  test('should return 400 (latitude only double)', async () => {
    const response = await request(app).put('/laundries/1').send({
      latitude: "Jl Tanah Kusir"
    }).set("Authorization", "Bearer " + tokenUser1)
  
    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Latitude is invalid")
  })

  test('should return 400 (longitude only double)', async () => {
    const response = await request(app).put('/laundries/1').send({
      longitude: "Jl Tanah Kusir"
    }).set("Authorization", "Bearer " + tokenUser1)
  
    expect(response.status).toBe(400)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Longitude is invalid")
  })

  test('should return 400 (invalid params)', async () => {
    const response = await request(app).put('/laundries/asd').send(req)
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 400 (not found)', async () => {
    const response = await request(app).put('/laundries/99').send(req)
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return updated laundry', async () => {
    const response = await request(app).put('/laundries/1').send(req)
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("id", 1)
    expect(response.body).toHaveProperty("name", "Joy Wash")
    expect(response.body).toHaveProperty("location", "Jl Tanah Kusir")
    expect(response.body).toHaveProperty("latitude", -6.260831)
    expect(response.body).toHaveProperty("longitude", 106.781773)
    expect(response.body).toHaveProperty("image", "https://i.pinimg.com/originals/ad/72/7f/ad727f15820d3d211eaf2a927e5b337d.png")
    expect(response.body).toHaveProperty("updatedAt", expect.any(String))
  })
})

describe('DELETE /laundries/:laundryId', () => {
  let tokenUser1
  let tokenUser2
  beforeAll(async () => {
    const responseUser1 = await request(app).post('/login').send({
      usernameOrEmail: "panduganteng@gmail.com",
      password: "panduganteng"
    })

    const responseUser2 = await request(app).post('/login').send({
      usernameOrEmail: "dwiky",
      password: "panduganteng"
    })

    tokenUser1 = responseUser1.body.access_token
    tokenUser2 = responseUser2.body.access_token
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).delete('/laundries/1')

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).delete('/laundries/1').set("Authorization", "panduganteng")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).delete('/laundries/1')
      .set("Authorization", "New eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).delete('/laundries/1')
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbmR1In0._Wtk6FScacHZIcIo_PGnHUrUygBa8E0NLqVkP1CEhNc")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 401 (invalid token)', async () => {
    const response = await request(app).delete('/laundries/1')
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTl9.YeaC-bu0MFyeg_sZ5TvQ9rQwweroN8LVK4wNafk3a4M")

    expect(response.status).toBe(401)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Invalid Token")
  })

  test('should return 403 (forbidden)', async () => {
    const response = await request(app).delete('/laundries/1')
      .set("Authorization", "Bearer " + tokenUser2)

    expect(response.status).toBe(403)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Forbidden")
  })

  test('should return 400 (invalid params)', async () => {
    const response = await request(app).delete('/laundries/asd')
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return 400 (not found)', async () => {
    const response = await request(app).delete('/laundries/99')
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(404)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("message", "Not Found")
  })

  test('should return deleted laundry', async () => {
    const response = await request(app).delete('/laundries/1')
      .set("Authorization", "Bearer " + tokenUser1)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Object)
    expect(response.body).toHaveProperty("id", 1)
    expect(response.body).toHaveProperty("name", "Joy Wash")
    expect(response.body).toHaveProperty("location", "Jl Tanah Kusir")
    expect(response.body).toHaveProperty("latitude", -6.260831)
    expect(response.body).toHaveProperty("longitude", 106.781773)
    expect(response.body).toHaveProperty("image", "https://i.pinimg.com/originals/ad/72/7f/ad727f15820d3d211eaf2a927e5b337d.png")
  })
})