const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
  return response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const newBlog = new Blog({
      title: body.title,
      url: body.url,
      author: body.author,
      likes: body.likes,
      user: body.userId
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
    const blog = await Blog.findById(request.params.id)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    if (blog.user.toString() === decodedToken.id.toString()) {
      Blog.findByIdAndRemove(blog.id)
      response.status(204).end()
    } else {
      response.status(403).end()
    }
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