import React, { useEffect, useState } from 'react';
import Navbar from '../../commponents/Navbar/Navbar';
import NoteCard from '../../commponents/Cards/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Toast from '../../commponents/ToastMessage/Toast';
import EmptyCard from '../../commponents/EmptyCard/EmptyCard';
import AddNoteImg from '../../assets/images/AddNoteImg.png'
import NoDataImge from '../../assets/images/NoDataImge.jpg'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    type: "add",
    message:""
  })

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch,setIsSearch] = useState(false);
  const navigate = useNavigate();

  const handelEdit = (noteDetails)=>{
    setOpenAddEditModal({ isShown:true, data: noteDetails ,type: "edit"})
  }

  const handleCloseToast = ()=>{
    setShowToastMsg({
      isShown:false,
      message: ""
    })
  }

  const showToastMessage = (message, type)=>{
    setShowToastMsg({
      isShown:true,
      message,
      type
    })
  }

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("error");
    }
  };

  const deleteNote = async (data) =>{
    const nodeId = data._id
    try{
      const response = await axiosInstance.delete("/delete-note/"+ nodeId);
  
      if(response.data && !response.data.error){
        showToastMessage("Note Delete Successful");
        getAllNotes();
  
      }
     }catch(error){
      if(error.response && error.response.data && error.response.data.message){
       console.log("An unexpected error occured. Please try again.");
      }
     }
  }

  const onSearchNote = async (query) =>{
    try{
      const response = await axiosInstance.get("/search-notes",{
        params: {query}
      })

      if(response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes); 
      }

    }catch(error){
      console.log(error);
    }
  }

  const updateIsPinned = async(noteData)=>{
    const nodeId = noteData._id
    try{
      const response = await axiosInstance.put("/update-note-pinned/"+ nodeId,{
        isPinned:!noteData.isPinned
      });
  
      if(response.data && response.data.note){
        showToastMessage("Note Updated Successful");
        getAllNotes();
      
      }
     }catch(error){
      console.log(error);
     }
  }

  const handelClearSearch=()=>{
    setIsSearch(false);
    getAllNotes();
  }

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <div>
      <Navbar handelClearSearch={handelClearSearch} userInfo={userInfo} onSearchNote={onSearchNote} />

      <div className='container mx-auto px-5'>
        {allNotes.length > 0 ?<div className='grid grid-cols-3 gap-4 mt-8'>
          {allNotes.map((item) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handelEdit(item)}
              onDelete={() => deleteNote(item)}
              onPinNote={() => updateIsPinned(item)}
            />
          ))}
        </div> : <EmptyCard
          imgSrc={isSearch? NoDataImge : AddNoteImg}
          message={isSearch? `Oops no data found matching your search`:"Start creating your first note! Click the 'ADD' button to jot down yourthoughts, idea, and remainder. Let's get started!"}
        />}
      </div>

      <button
        className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)"
          },
        }}
        contentLabel=''
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Home;
