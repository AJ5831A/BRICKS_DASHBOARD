import { validationResult } from "express-validator";
import assignmentModel from "../models/assignment.model.js";
import studentModel from "../models/student.model.js";


const createAssignment = async (req , res) =>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {
            title ,
            description,
            batch,
            assignmentType,
            questions,
            dueDate,
            settings,
            isPublished
        } = req.body;

        const instructor = req.instructor;

        if(!instructor.batches.includes(batch)){
            return res.status(403).json({errors:[{msg:'You are not authorized to create assignments for this batch'}]});
        }

        if(new Date(dueDate)<=new Date()){
            return res.status(400).json({errors:[{msg:'Due date must be in the future'}]});
        }

        const newAssignment = await assignmentModel.create({
            title,
            description,
            batch,
            instructor:instructor._id,
            instructorName:`${instructor.fullname.firstname} ${instructor.fullname.lastname || ''}`.trim(),
            assignmentType,
            questions : questions || [],
            dueDate,
            settings : settings || {},
            isPublished : isPublished || false,
            publishedAt : isPublished ? Date.now() : null
        });

        res.status(201).json({
            msg:'Assignment created successfully',
            assignment:newAssignment
        });


    }catch(err){
        console.error('Create assignment error:', err);
        res.status(500).json({errors:[{msg:'Server error during assignment creation'}]});
    }
}