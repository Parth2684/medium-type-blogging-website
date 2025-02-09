import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";



export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>()



blogRouter.use('/*', async (c, next) => {
    const token = c.req.header("Authorization");
    if (!token) {
        return c.json({ error: "Missing Authorization Token" }, 401);
    }

    try {
        const response = await verify(token, c.env.JWT_SECRET);
        if (!response || !response.id) {
            return c.json({ error: "Invalid Token" }, 401);
        }
        //@ts-ignore
        c.set("userId", response.id);
        await next();
    } catch (error) {
        return c.json({ error: "Token Verification Failed", details: error.message }, 401);
    }
});
  

blogRouter.post('/', async (c) => {
    try {
        const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const userId = c.get("userId")
    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: userId,
            published: true
        }
    })
    return c.json({
        msg: "Blog Published",
        post
    })
    } catch(e) {
        console.error(e)
        return c.json({
            msg: "Error posting blog",
            err: e
        })
    }
})


blogRouter.put('/', async (c) => {
    try{
        const body = await c.req.json()
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const post = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    })
    return c.json({
        post,
        msg: "post updated successfully"
    })

    }catch(e){
        console.error(e)
        return c.json({
            msg: "Some error occured",
            err: e
        })
    }
})


blogRouter.get('/:id', async (c) => {
    try{
        const postId = await c.req.param("id")
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    })
    const post = await prisma.post.findFirst({
        where: {
            id: postId
        }
    })
    return c.json({
        post,
        
    })
    }catch(e){
        console.error(e)
        return c.json({
            msg: "Some error occured",
            err: e
        })
    }
})


blogRouter.get('/bulk', async (c) => {
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const blogs = await prisma.post.findMany();
        return c.json({
            blogs,
            msg: "All the blogs you need"
        })
    }catch(e){
        console.error(e)
        return c.json({
            msg: "Some error occured",
            err: e
        })
    }
})

