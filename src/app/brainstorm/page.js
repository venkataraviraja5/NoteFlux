"use client"
// pages/brainstorm.js
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useSession } from "next-auth/react";

// Dynamically import Excalidraw so that it only loads on the client-side
const Excalidraw = dynamic(() => import("@excalidraw/excalidraw").then(mod => mod.Excalidraw), {
  ssr: false,
});

export default function Brainstorm() {
  
  const [items,setItems] = useState(null)
  const session = useSession()
  const[initial,setInitial] = useState(null)
 // console.log(session?.data?.user?.id,'userID')


  const saveCanvas = async() => {
    if(session?.data?.user?.id != undefined){
      console.log("calling...")
      try{
        const fetchUrl = await fetch('/api/canvasStore',{
          method:"POST",
          headers:{
            "Content-Type" : "application/json"
          },
          body:JSON.stringify({
            userId : session?.data?.user?.id,
            items : items
          })
        })
  
        if(fetchUrl.ok){
          const jsonUrl = await fetchUrl.json()
          console.log(jsonUrl)
        }else {
          console.error("Failed to save canvas:", await response.text());
        }
      }
      catch(err){
        console.log(err)
      }
    }
  }


  const getCanvas = async() =>{
    if(session?.data?.user?.id != undefined){
      try{
        const fetchUrl = await fetch(`/api/canvasStore?userId=${encodeURIComponent(session?.data?.user?.id)}`)
        
        if(fetchUrl.ok){
          const jsonFile = await fetchUrl.json()
          console.log(jsonFile.result.items,"getCanvas")
          if (jsonFile?.result?.items) {
            const initialData = {
              elements: jsonFile.result.items,
              appState: {
                viewBackgroundColor: "#ffffff",
              },
            };
            setInitial(initialData);
            setItems(jsonFile.result.items); 
          } else {
            console.error("Failed to retrieve canvas:", await response.text());
          }
        }
      }
      catch(err){
         console.log(err)
      }
    }
  }

  useEffect(() => {
    getCanvas()
  },[session?.data?.user?.id])

  useEffect(() => {
    if (items) {
      saveCanvas();
    }
  }, [items]);

  return (
    <>
      <Head>
        <title>Brainstorm with Excalidraw</title>
        <meta name="description" content="Collaborate and brainstorm using Excalidraw" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex items-center justify-center">
      <div style={{ height: "90vh", width: "90vw", display: "flex", flexDirection: "column", backgroundColor: "black" }}>
        <div style={{ flexGrow: 1 }}>
          <Excalidraw
            theme="dark" // Set the theme to dark
            style={{ height: "100%", width: "100%" }} // Ensure Excalidraw fills the container
            initialData={initial}
            onChange={(elements) => setItems(elements)}
          />
        </div>
       
      </div>
       
      </div>
    </>
  );
}
