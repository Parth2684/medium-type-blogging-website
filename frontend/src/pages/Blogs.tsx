import { AppBar } from "../components/AppBar"
import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks"


export const Blogs = () => {
    const {loading, blogs} = useBlogs();
    if(loading){
        return <div>
            loading...
        </div>
    }
    if (!blogs || blogs.length === 0) {
        return <div>No blogs found.</div>;
    }
    

    return <div> 
        <AppBar />
        <div className="flex justify-center"> 
            <div>
                {blogs.map(blog =>  <BlogCard id={blog.id} authorName={blog.author.name} title={blog.title} content={blog.content} publishedDate={"Just Somewhen after the world was born"} />)}
            </div>
        </div>
    </div>
} 