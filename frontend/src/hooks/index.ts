import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";

export interface Blog {
    content: string;
    title: string;
    id: string;
    author: {
        name: string;
    }
}
export const useBlog = ({id}: {id: string}) => {
    
    const [blog, setBlog] = useState<Blog>()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setBlog(response.data.blog)
                setLoading(false)
            })
    }, [id])
    return {
        loading,
        blog
    }
}

export const useBlogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token being sent:", token);  // Debugging log

        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: token,
            },
        })
        .then(response => setBlogs(response.data.blogs))
        .catch(err => console.error("Error fetching blogs:", err))
        .finally(() => setLoading(false));
    }, []);

    return { loading, blogs };
};
