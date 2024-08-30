import { NextResponse } from "next/server"
import Canva from "../../../models/canvas"
import connect from "../../../utils/db"

export const POST = async(request) => {
    await connect()
    const{userId,items} = await request.json()
    //console.log(userId,items)

    const userIdCheck = await Canva.findOne({userId : userId})
   // console.log(userIdCheck,"..............")
    if(!userIdCheck){
        const usercanvas = await new Canva({
            userId : userId,
            items : items,
            name: "raja"
        })
        await usercanvas.save()
        return NextResponse.json({result:"succesfull"},{status:200})
    }
    else{
          userIdCheck.items = items
          await userIdCheck.save()
        return NextResponse.json({success : true,result : "succesfull"},{status : 200})
    }
}

export const GET = async(request) => {
    await connect()

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    
    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    try {
        const res = await Canva.findOne({ userId });

        if (res) {
            return NextResponse.json({ result: res }, { status: 200 });
        } else {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}