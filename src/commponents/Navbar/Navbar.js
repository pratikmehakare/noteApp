import React, { useState } from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import toast from 'react-hot-toast';

const Navbar = ({handelClearSearch,userInfo,onSearchNote}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate(); // Correct usage of useNavigate

  const onLogout = () => {
    localStorage.clear();
    toast.success("Logout")
    navigate("/");
  }

  const handleSearch = () => {
    // Your search handling logic here
    if(searchQuery){
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handelClearSearch();
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <h2 className='text-xl font-medium text-black py-2'>Notes</h2>

      <SearchBar
        value={searchQuery} // Fixed typo from 'searcQuery' to 'searchQuery'
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo= {userInfo} onLogout={onLogout} />
    </div>
  );
}

export default Navbar;
