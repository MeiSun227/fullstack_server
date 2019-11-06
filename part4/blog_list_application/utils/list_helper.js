const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    console.log(blog)
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}