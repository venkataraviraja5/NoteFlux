
import { NextResponse } from 'next/server';
import PdfParse from 'pdf-parse';
import fs from "fs"

export const GET = async(req, res) => {
  const fileBuffer = fs.readFileSync("https://utfs.io/f/541e43bc-0dde-4b44-8950-8caca813d75e-oatxwx.pdf.pdf");
  const data = await PdfParse(fileBuffer);
  
  return NextResponse.json({text:data})
}
