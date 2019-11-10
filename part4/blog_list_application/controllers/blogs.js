const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})
// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })

    }
    const user = await User.findById(decodedToken.id)

    const newBlog = new Blog({
      title: body.title,
      url: body.url,
      author: body.author,
      likes: body.likes,
      user: body.id
    })

    const result = await newBlog.save()
    user.blogs = user.blogs.concat(result.id)
    await user.save()
    return response.status(201).json(result)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const result = await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()

  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const newBlogBody = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlogBody, { new: true })

    return response.json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})



module.exports = blogsRouter