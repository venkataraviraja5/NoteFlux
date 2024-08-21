import mongoose from "mongoose";


const chatStoreSchema = new mongoose.Schema({
    pdfId : {
        type : String,
        require : true
    },
    chatStoreInArray : {
        type : [],
        require : true
    }
})

const modelName = 'PdfChatStore';
const existingModel = mongoose.models[modelName];

const PdfChatStore = existingModel || mongoose.model(modelName, chatStoreSchema);

export default PdfChatStore;