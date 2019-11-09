const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,

  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: 'http://www.example.com/edsger',
    likes: 12
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(initialBlogs.length)
})

test('Verify blog with ID', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const newBlog = {
    author: 'kissa ja koira',
    likes: 100,
    title: 'suomi elämä',
    url: 'example.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.map(r => r.author)

  expect(response.body.length).toBe(initialBlogs.length + 1)
  expect(contents).toContain(
    'kissa ja koira'
  )
})

test('default blog likes are zero', async () => {
  const newBlog = {
    author: 'siili',
    title: 'talviuni',
    url: 'example.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const contents = response.body.filter(r => r.author === 'siili')
  console.log(contents)
  expect(contents[0].likes).toBe(0)
})

test('blog title and url are required', async () => {
  console.log(initialBlogs)
  const newBlog = {
    url: 'www.example.com',
    author: 'siili'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})

