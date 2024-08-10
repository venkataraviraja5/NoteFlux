"use client"
import { useParams } from 'next/navigation'
import React from 'react'
import PdfChat from '../../../components/PdfChat'

const page = async() => {
   const {id} = useParams()

   const pdfUrl = `https://utfs.io/f/${id}`;

   
  return (
    <div>
      <iframe src={pdfUrl}></iframe> 
      <PdfChat />
    </div>
  )
}

export default page
