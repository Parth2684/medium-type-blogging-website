import { createBlogInput, updateBlogInput } from "@parth_bhosle/medium-common";
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
    const header = c.req.header("authorization") || "";
    console.log("Authorization Header:", header); // Debugging
    
    const token = header.split(" ")[1];
    if (!token) {
        c.status(403);
        return c.json({ error: "No token provided" });
    }

    try {
        // @ts-ignore
        const response = await verify(token, c.env.JWT_SECRET);
        console.log("Decoded JWT:", response); // Debugging
        
        if (response.id) {
            //@ts-ignore
            c.set("userId", response.id); // Ensure userId is stored
            return next();
        } else {
            c.status(403);
            return c.json({ error: "Invalid token" });
        }
    } catch (err) {
        console.error("JWT Verification Error:", err);
        c.status(403);
        return c.json({ error: "Token verification failed" });
    }
});


  

blogRouter.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const { success } = createBlogInput.safeParse(body);
        if(!success) {
            return c.json({
                msg: "Enter correct details nigga"
            })
        }
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
        const { success } = updateBlogInput.safeParse(body);
        if(!success){
            return c.json({
                msg: "enter correct details nigga"
            })
        }
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

