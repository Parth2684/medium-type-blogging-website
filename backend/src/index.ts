import { Hono } from 'hono'

const app = new Hono()

app.post('/api/v1/signup', (c) => {
  return c.text('Hello Hono!')
})


app.post('api/v1/signin', (c) => {
  
})


app.post('api/v1/blog', (c) => {

})


app.put('api/v1/blog', (c) => {

})


app.get('api/v1/blog/:id', (c) => {

})
export default app
