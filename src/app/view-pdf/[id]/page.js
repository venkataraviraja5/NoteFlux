"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'


const page = () => {
   const {id} = useParams()
   const [messages, setMessages] = useState([]);
   const[question,setQuestion] = useState("")

   const pdfUrl = `https://utfs.io/f/${id}`;
   // console.log(id)

    // Api call for chat with PDF
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
             setMessages([...messages, { text: question, sender: 'user' }, { text: answer.result, sender: 'chatgpt' }]);
             //console.log(answer)
              chatStore({ text: question, sender: 'user' }, { text: answer.result, sender: 'chatgpt' })
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
  
    const chatStore = async(question,answer) =>{
      if(id){
        try{
          const fetchUrl = await fetch("/api/chatStore",{
            method:"POST",
            headers:{
              "Content-Type" : "application/json"
            },
            body:JSON.stringify({
              pdfId : id,
              question : question,
              answer : answer
            })
          })

          if(fetchUrl.ok){
            const jsonObj = await fetchUrl.json()
            console.log(jsonObj,"chat")
          
          }
        }
        catch(err){

        }
      }
    }

    const getChatStore = async() =>{
       if(id){
        try{
          const fetchUrl = await fetch(`/api/chatStore?query=${encodeURIComponent(id)}`)
          const jsonObj = await fetchUrl.json()
         // console.log(jsonObj.result,"userchat")
          setMessages([...messages,...jsonObj.result])
         }
         catch(err){
          console.log(err)
         }
       }
    }  


    useEffect(() => {
      getChatStore()
    },[id])

  return (
    <div className='flex justify-center items-center gap-2  mt-2'>

      {/* iframe to view PDF */}
      <div  className="h-screen w-[40%]">
        <iframe src={pdfUrl} height="500px" width="500px"></iframe> 
      </div>

      {/* Display Chat div */}
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
           placeholder='Enter your question'
        />
        <button onClick={pdfChat}>Enter</button>
      </div>
    </div>
  )
}

export default page
