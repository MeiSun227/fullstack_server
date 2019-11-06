const listHelper = require('../utils/list_helper')


describe('total likes', () => {
  const listWithManyBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
  ]
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(17)
  })

  test('when list has more than one blog ', () => {
    const answer = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    console.log(result)
    expect(result).toEqual(answer)
  })
})