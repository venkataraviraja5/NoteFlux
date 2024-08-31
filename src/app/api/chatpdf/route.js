
import { NextResponse } from 'next/server';
import PdfParse from 'pdf-parse'
import fetch from 'node-fetch';
import { OpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RetrievalQAChain } from 'langchain/chains';
import { Document } from "@langchain/core/documents";


export const POST = async(request) => {
    const {pdfUrl,question} = await request.json()
   // console.log(pdfUrl,question) 
    try {
      // Fetch the PDF from the URL
      const response = await fetch(`https://utfs.io/f/${pdfUrl}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Get the buffer from the response
      const buffer = await response.buffer();
  
      // Parse the PDF
      const data = await PdfParse(buffer);
  
  
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });
         
        //Convert data into chunks
        const splits = await textSplitter.splitDocuments([
          new Document({ pageContent: data.text }),
        ]);
  
        const embeddings = new OpenAIEmbeddings({
          // apiKey: "sk-proj-iXmuyBnlBWxhn54fvphAT3BlbkFJvCKR8TcejWDkn4XNZXdq"
        });
        const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);
  
        const model = new OpenAI({apiKey: "sk-proj-iXmuyBnlBWxhn54fvphAT3BlbkFJvCKR8TcejWDkn4XNZXdq"});
        const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  
      // Get answer
      const answer = await chain.call({
        query: question,
      });
  
      // Return the parsed text as JSON
      return NextResponse.json({success : true, result: answer.text},{status : 200});
    } catch (error) {
      // Handle errors and return an appropriate response
      return NextResponse.json({ error: "not fetched" }, { status: 400 });
    }
  
}
