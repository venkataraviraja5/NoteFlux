import { NextResponse } from "next/server"
import connect from "../../../utils/db"
import PdfChatStore from "../../../models/PdfChatStore"

export const GET = async(request) => {
    await connect()

    if (request.method === 'GET') {
        const url = new URL(request.url);
        const queryParam = url.searchParams.get('query');
       // console.log(queryParam ,"url")

        if(queryParam){
            const chatHistory = await PdfChatStore.findOne({pdfId : queryParam})
            return NextResponse.json({success : true, result:chatHistory.chatStoreInArray },{status : 200})
        }
        else{  
            return NextResponse.json({result : "Not able to decode Query"},{status : 404})
        }
      
    }
}

export const POST = async(request) => {
      await connect()
     const {pdfId,question,answer} = await request.json()
    // console.log(answer,"pdf......id")

     if(pdfId){
        const chatStorePdfId = await PdfChatStore.findOne({pdfId : pdfId})

        if(!chatStorePdfId){
          const createNewPdfChatId = await new PdfChatStore({
            pdfId : pdfId,
            chatStoreInArray :[question,answer]
          })

          await createNewPdfChatId.save()
          return NextResponse.json({success : true, result : "Chat Store Created"},{status : 200})
        }
        else{
           chatStorePdfId.chatStoreInArray.push(question)
           chatStorePdfId.chatStoreInArray.push(answer)
           
           await chatStorePdfId.save()
           return NextResponse.json({success : true , result : "Added Succesfull"},{status : 200})
        }
     }
     else{
        return NextResponse.json({result : "Pdf Id missing"},{status:404})
     }
}