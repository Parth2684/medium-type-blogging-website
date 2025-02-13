import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput } from "@parth_bhosle/medium-common";
import { signupInput } from "@parth_bhosle/medium-common";


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
      const { success } = signupInput.safeParse(body)
      if(!success) {
        return c.json({
          msg: "Incorrect inputs"
        })
      }
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
  
    try{
      const body = await c.req.json()
    const { success } = signinInput.safeParse(body);
    if(!success) {
      return c.json({
        msg: "Enter correct inputs nigga"
      })
    }
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
  
    const token = await sign({id: user.id}, c.env.JWT_SECRET)
    return c.json({token})
    }catch(e){
      console.error(e)
      return c.json({
        error: e
      })
    }
})
  