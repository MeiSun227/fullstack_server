const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

blogsRouter.post('/', async (request, response,next) => {
  try {
    const blog = new Blog(request.body)
    const result = await blog.save()
    return response.status(201).json(result)

  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter