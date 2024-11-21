import { Router } from "express";


import mongoose from 'mongoose';
const addvehicle = Router()



const vehicleSchema=new mongoose.Schema({
    serviceNo:{type:String,unique:true},
    vehicleNo:{type:String,unique:true},
    vehicleType:{ type: String, required: true, enum: ['Car', 'Bike', 'Lorry'] },
    serviceGivenDate: { type: Date, required: true },
    estimatedCompletionTime: { type: Date, required: true },

    ownerName: { type: String, required: true },
    serviceDetails: { type: String, required: true } 

}) 

const Vehicle = mongoose.model('vehicle', vehicleSchema) 

mongoose.connect('mongodb://localhost:27017/Vehiclesystem_exam')



addvehicle.post('/addvehicle',async(req,res)=>{
 
    const { serviceNo, vehicleNo, vehicleType, serviceGivenDate, estimatedCompletionTime, ownerName, serviceDetails } = req.body;
       
  
try {


    const existingVehicle = await Vehicle.findOne({serviceNo: serviceNo })
    console.log('current :',existingVehicle);
    // if (existingVehicle) {
    //     return res.status(409).json({ message: "vehicle details already exists" });
    // }
    
          const newVehicle =  new Vehicle({
            serviceNo:serviceNo,
            vehicleNo:vehicleNo,
            vehicleType: vehicleType,
            serviceGivenDate: serviceGivenDate,
            estimatedCompletionTime: estimatedCompletionTime,
            ownerName: ownerName,
            serviceDetails: serviceDetails,
             })
          await newVehicle.save();
       res.status(200).json({message:"   vehicle details added ",newVehicle})
    
   
} catch (error) {
    res.status(500).json(error)
}   
})

addvehicle.patch('/updateVehicle', async (req, res) => {
   

    const { serviceNo, vehicleNo, vehicleType, serviceGivenDate, estimatedCompletionTime, ownerName, serviceDetails } = req.body;

    try {
        const existingVehicle = await Vehicle.findOne({ serviceNo: serviceNo });
        if (!existingVehicle) {
            return res.status(404).json({ message: "vehicle not found" });
        }

        
            existingVehicle.vehicleNo =vehicleNo || existingVehicle.vehicleNo;
            existingVehicle.vehicleType = vehicleType || existingVehicle.vehicleType;
        existingVehicle.serviceGivenDate = serviceGivenDate || existingVehicle.serviceGivenDate;
        existingVehicle.estimatedCompletionTime = estimatedCompletionTime || existingVehicle.estimatedCompletionTime;
        existingVehicle.ownerName = ownerName || existingVehicle.ownerName;
        existingVehicle.serviceDetails = serviceDetails || existingVehicle.serviceDetails;
          

            await existingVehicle.save();

            res.status(200).json({ message: " updated vehicle details", existingVehicle });
        

    } catch (error) {
        res.status(500).json(error);
    }
});





addvehicle.get('/getVehicle/:no', async(req,res)=>{


    const serviceNo=req.params.no

    const response = await Vehicle.findOne({serviceNo:serviceNo})
try {
    if(response){

        return res.status(200).json({
            message: "vehicle",
            books: response,
        });    
    }else{
        return res.status(401).json({message:"vehicle is not found"})
    }
} catch (error) {
    
    res.status(500).json(error)
}   
})








addvehicle.delete('/delete/:vname', async (req, res) => {
    const serviceNo = req.params.vname;
    try {

     const result = await Vehicle.findOneAndDelete({serviceNo:serviceNo})   

     if(!result){

       return res.status(400).json({message:"No vehicle name"});

     }
       
           res.status(200).json({message:"vehicle deleted successfully"});
        
    } catch (error) {
        res.status(500).json(error);
    }
});



addvehicle.get('/viewVehicles', async(req,res)=>{
    try{
    
        const getAllvehicle= await Vehicle.find()

        if(getAllvehicle){
           
            
        res.status(200).json(Array.from(getAllvehicle.entries()))
    }
else{
    res.status(404).json({message:'No vehicle added'});
}}
    catch{
        res.status(404).json({message:"Internal error"})
    }
})


export {addvehicle}