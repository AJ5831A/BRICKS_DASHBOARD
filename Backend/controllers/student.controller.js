import studentModel from "../models/student.model.js";
import {validationResult } from "express-validator";
import bcrypt from 'bcrypt';

const login = async(req , res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {enrollmentNumber , password} = req.body;
    const student = await studentModel.findOne({enrollmentNumber}).select('+password');
    const hash = await bcrypt.hash("password123" , 10);

    if(!student){
        return res.status(400).json({errors:[{msg:'Invalid enrollment number or password'}]});
    }

    const isMatch = await bcrypt.compare(password , student.password);

    if(!isMatch){
        return res.status(400).json({errors:[{msg:'Invalid enrollment number or password'}]});
    }

    const token = student.generateAuthToken();
    res.cookie('token' , token);

    res.status(200).json({token , student});
}

export default {login};
