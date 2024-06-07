import React, { useState } from "react";
import Navbar from "../../commponents/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Password from "../../commponents/Input/Password";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e)=>{
     e.preventDefault();

     if(!name){
      setError("Please Enter Name");
      return;
     }

     if(!validateEmail(email)){
      setError("Please Enter Valid Email..")
      return;
     }   

     if(!password){
      setError("Please Enter Password");
      return;
     }

     setError("");

     try {
      const response = await axiosInstance.post("/create-account", {
        fullName:name,
        email: email,
        password: password,
      });

      if (response.data && response.data.error) {
         setError(response.data.message)
         return 
      }

      // if(response.data && response.data.accessToken){
      //   localStorage.setItem("token",response.data.accessToken);
      //   navigate('/dashboard');
      // }

      if(response.data ){
        toast.success("Sign Up Successful");
        navigate('/');
      }


    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    }

  }

  

  return (
    <div>
      <Navbar />

      <div className="flex justify-center items-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">SignUp</h4>

            <input
              type="text"
              value={name}
              onChange={(e)=>{setName(e.target.value)}}
              placeholder="Name"
              className="input-box"
            />

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <Password 
              value={password}
              onChange={(e)=>{
                setPassword(e.target.value)
              }}
            />

            {
              error && <p className="text-red-500 text-xs pb-1">{error}</p>
            }

            <button type="submit" className="btn-primary">
              SignUp
            </button>

            <p className="text-sm text-center mt-4">
              Already have an Account?{" "}
              <Link to="/" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp
