const appointments = require("../model/appointments")
const doctor = require("../model/doctor")
const { updateDoctorSchema } = require('../validation/doctorValidator');


const all_appointments = async (req, res) => {
    const id = req.id;

    try {

        const all_appointments = await appointments.find({ doctor: id }).populate("user");
        console.log(all_appointments)
        if (!all_appointments) {
            return res
                .status(401)
                .json({success:false, message: "no appointments found" });
        } else {
            return res.json({success:true, message: "appointments found successfully"});
        }


    } catch (error) {
        return res.status(500).json({ success: false,message: error.message });
    }
}



const get_single_doctor = async (req, res) => {
    const id = req.id
    console.log(id)

    try {
        const data = await doctor.findById(id)
        console.log(data)
        if (!data) {
            return res.status(401).json({
                success:false,
                message: "cannot find doctor"

            })
        }
        return res.status(202).json({
            success:true,
            message: "find doctor successfully",
            data: data

        })

    }
    catch (e) {
        return res.status(400).json({ message: e.message })



    }
}


const update_doctor = async (req, res) => {
    const id = req.id;
    const { error } = updateDoctorSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { name, image, contact, email, desc, ammount } = req.body;

    try {
        const data = await doctor.findById(id);
        if (!data) {
            return res.status(401).json({success:false, message: "cannot find doctor" });
        } else {
            const update = await doctor.findByIdAndUpdate(id, { name, image, contact, email, desc, ammount }, { new: true });
            return res.status(202).json({success:true, message: "update successfully", data: update });
        }
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};



const change_date = async (req, res) => {

    try {
        const { _id, date } = req.body;
        console.log(_id, date);
        const new_date = await appointments.findByIdAndUpdate({ _id }, { date });


        // console.log(req.body);
        console.log(new_date);
        return res.status(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }



}


const update_medicine = async (req, res) => {
    const { _id, medicine, about } = req.body;
    console.log(_id, medicine, about);  
    try {

        // const { id, medicine, about } = req.body;    
        console.log(id, medicine, about)
        // console.log(id, medicine, about);
        if (!_id | !medicine | !about) {
            return res.status(202).json({success:false, message: "incomplete-content" });
        } else {
            const appointment = await appointments.findOne({ _id });
            console.log(appointment)
            if (!appointment) {
                return res.status(401).json({success:false, message: "no appointment exist" });
            } else {
                await appointments.findByIdAndUpdate({ _id }, { medicine, about });
                return res.status(200).json({success:true, message: "appointment updated" });  
            }

        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}


module.exports = { all_appointments, get_single_doctor, update_doctor, change_date, update_medicine }
