import { SignupInput } from "@parth_bhosle/medium-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config";


export const Auth = ({type}: {type: "signup" | "signin"}) => {
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    async function sendRequest () {
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type==="signup" ? "signup" : "signin"}`, postInputs)
            const jwt = response.data.token;
            localStorage.setItem("token", jwt)
            navigate("/blogs")
        }catch(e){
            console.error(e)
        }
    }

    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-3xl font-bold">
                        Create an account
                    </div>
                    <div className="text-slate-500">
                        {type === "signin" ? "Don't have an account?": "Already have an account?" }     
                        <Link className="underline" to={type === "signin" ? "/signup": "/signin"}>{type === "signin"? "Sign up": "Sign in"}</Link>  
                    </div>
                </div>
                <div className="pt-8">
                    {type === "signup" ? <LabelledInputs type="text" label="Name" placeholder="Enter Your Name" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }} /> : null}
                    <LabelledInputs type="email" label="Emails" placeholder="Enter Your Email" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            email: e.target.value
                        })
                    }} />
                    <LabelledInputs type="password" label="Password" placeholder="Enter Your Password" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                    <button onClick={sendRequest} type="button" className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-8">{ type==="signup" ? "Sign up": "Sign in" }</button>

                </div>
                
            </div>
        </div>
    </div>
}

interface LabelledInputsType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type: string;
}

function LabelledInputs({label, placeholder, onChange, type}: LabelledInputsType) {
    return <div>
        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white pt-4">{label}</label>
        <input onChange={onChange} type={type} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
    </div>

}