import React, { useState } from 'react'
import {FaRegEye ,FaRegEyeSlash} from "react-icons/fa6";

const Password = ({onChange,value,placeholder}) => {
    const [isShowPassword,setIsShowPassword]= useState(false);

    function toggleShowPassowrd(){
        setIsShowPassword(!isShowPassword);
    }
  return (
    <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
      <input
        value={value}
        onChange={onChange}
        placeholder={ placeholder || "Password"}
        type={isShowPassword? "text": "password"}
        className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'
      />
      
      {isShowPassword? <FaRegEye
        size={22}
        className="text-primary cursor-pointer"
        onClick={()=>toggleShowPassowrd()}
      />:
      <FaRegEyeSlash
        size={22}
        className="text-primary cursor-pointer"
        onClick={()=>toggleShowPassowrd()}
      />
      }

    </div>
  )
}

export default Password
