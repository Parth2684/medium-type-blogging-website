import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

userRouter.post('/signup', async (c) => {

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json()
    try {
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          name: body.name 
        }
      })
      const token = await sign({
        id: user.id
      }, c.env.JWT_SECRET)
    
      return c.json({
        msg: "Signed Up",
        jwt: token
      })  
    } catch (e) {
      console.log(e)
      return c.json({
        msg: 'Error While Creating Account',
      err: e 
    })
    }
    
  })
  
  
userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
  
    const body = await c.req.json()
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
        password: body.password
      }
    })
    if(!user) {
      c.status(403)
      return c.json({error: "User does not exist"})
    }
  
    const token = await sign({email: user.email}, c.env.JWT_SECRET)
    return c.json({token})
})
  