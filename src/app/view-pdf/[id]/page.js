"use client"
import { useParams } from 'next/navigation'
import React, { useState } from 'react'


const page = () => {
   const {id} = useParams()
   const [messages, setMessages] = useState([]);
   const[question,setQuestion] = useState("")

   const pdfUrl = `https://utfs.io/f/${id}`;
    console.log(id)
    
    const pdfChat = async() =>{
        if(id){
         try{
           const chatWithPdfUrl = await fetch("/api/chatpdf",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question : question,
              pdfUrl : id
            }),
           })
 
           if(chatWithPdfUrl.ok){
             const answer = await chatWithPdfUrl.json()
             setMessages([...messages, { text: question, sender: 'user' }, { text: answer.result, sender: 'bot' }]);
             //console.log(answer)
           }
         }
         catch(err){
           console.log("not fetched")
         }
         finally{
          setQuestion("")
         }
        }
    }
  
   
  return (
    <div className='flex justify-center items-center gap-2  mt-2'>
      <div  className="h-screen w-[40%]">
        <iframe src={pdfUrl} height="500px" width="500px"></iframe> 
      </div>
      <div  className="h-screen w-[60%] p-2.5">
        <div className="h-[90vh] overflow-scroll border-0" >
         {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <p style={{ display: 'inline-block', padding: '5px 10px', borderRadius: '5px', backgroundColor: msg.sender === 'user' ? '#d1e7dd' : '#e9ecef', marginTop:"10px"}}>
              {msg.text}
            </p>
          </div>
         ))}
        </div>
        <input type='text' width="500px"
          onChange={(e) => setQuestion(e.target.value)}
           placeholder='Enter'
        />
        <button onClick={pdfChat}>Enter</button>
      </div>
    </div>
  )
}

export default page
