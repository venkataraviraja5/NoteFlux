"use client"
import React from 'react'
import { useParams } from 'next/navigation'

const page = () => {
    const {id} = useParams()
  return (
    <div>
      <h1>View</h1>
      {id}
    </div>
  )
}

export default page
