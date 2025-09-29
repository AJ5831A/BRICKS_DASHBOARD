import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const studentSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type: String,
            required: true,
            minlength: [3, "First name should be at least 3 characters long"],
        },
        lastname: {
            type: String,
            minlength: [3, "Last name should be at least 3 characters long"],
        }
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minlength: [3, "Email should be at least 3 characters long"],
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    enrollmentNumber:{
        type: String,
        required : true,
        unique:true,
    },
    school:{
        type: String,
        required: true
    },
    grade:{
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    avtarUrl:{
        type: String,
        default: null
    },
    bio:{
        type: String,
        default: "Excited to learn, explore, and grow with BRICKS Bootcamp <3"
    },
    points:{
        type: Number,
        default: 0
    },
    streak:{
        type: Number,
        default: 0
    },
    lastActive:{
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

studentSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id} , process.env.JWT_SECRET , {expiresIn:'24h'});
    return token;
}

studentSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password , this.password);
}

studentSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password , 10);
}



const studentModel = mongoose.model('student' , studentSchema);

export default studentModel;