import mongoose, { Schema } from "mongoose";


const canvasSchema = new Schema({
    userId : {
        type : String,
        required : true
    },
    items : {
        type : [Schema.Types.Mixed],
        required : true
    },
    name : {
        type : String,
        required : true
    }
})

const modelname = "canvas"

const existing = mongoose.models[modelname]

const Canva = existing || mongoose.model(modelname,canvasSchema)

export default Canva