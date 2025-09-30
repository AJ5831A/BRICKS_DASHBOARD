import studentModel from "../models/student.model.js";
import {validationResult } from "express-validator";
import bcrypt from 'bcrypt';
import blacklistTokenModel from "../models/blacklistToken.model.js";

const login = async(req , res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {enrollmentNumber , password} = req.body;
    const student = await studentModel.findOne({enrollmentNumber}).select('+password');

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

const getProfile = async(req , res) =>{
    const student = req.student;
    
    res.status(200).json({student});
}

const logout = async(req , res) =>{
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistTokenModel.create({token});
    res.status(200).json({msg:'Logged out successfully'});
}

const forgotPassword = async(req , res , next) =>{
    
}

const resetPassword = async(req , res , next) =>{
    
}

export default {login , getProfile , logout , forgotPassword , resetPassword};