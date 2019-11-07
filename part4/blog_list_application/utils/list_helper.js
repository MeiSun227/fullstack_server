const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {

    return sum + blog.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => max.likes > blog.likes
    ? max : blog)
}


const mostBlogs = (blogs) => {
  const nameArray = blogs.map((blog) => blog.author)
  return result = _.head(_(nameArray)
  .countBy()
  .entries()
  .maxBy(_.last));

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}