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
  await Laundry.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true
  })
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
  })
})

describe('GET /laundries', () => {
  test('should return list of laundry', async () => {
    const response = await request(app).get('/laundries')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body[0]).toHaveProperty("id", 1)
    expect(response.body[0]).toHaveProperty("name", "Joy Wash")
    expect(response.body[0]).toHaveProperty("location", "Jl Tanah Kusir")
    expect(response.body[0]).toHaveProperty("latitude", -6.260831)
    expect(response.body[0]).toHaveProperty("longitude", 106.781773)
    expect(response.body[0]).toHaveProperty("image", "https://i.pinimg.com/originals/1f/1c/55/1f1c55442e45f24420754ce64351f6c0.png")
    expect(response.body[1]).toHaveProperty("id", 2)
    expect(response.body[1]).toHaveProperty("name", "Joy Wash")
    expect(response.body[1]).toHaveProperty("location", "Jl Tanah Kusir")
    expect(response.body[1]).toHaveProperty("latitude", -6.260831)
    expect(response.body[1]).toHaveProperty("longitude", 106.781773)
    expect(response.body[1]).toHaveProperty("image", "https://ik.imagekit.io/pashouses/pandu/pages/wp-content/uploads/2023/04/washing-machine-minimal-laundry-room-interior-design-scaled.jpg")
  })
})

