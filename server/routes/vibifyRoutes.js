const express = require('express');

const router = express.Router();
const Model = require('../model/model')

module.exports = router;

router.get('/getAll', async (req,res) =>{
    try{
       const data = await Model.find();
       res.json(data);
    }
    catch(error){
       res.status(500).json({message:error.message})
    }
})

router.get('/getSongsByValence&Energy/:valence/:energy', async (req,res)=>{
    
    let valen = Number(req.params.valence);
    let energ = Number(req.params.energy);
    try{
       const data = await Model.find({valence:{$lt:valen+0.1,$gt:valen-0.1},energy:{$lt:energ+0.1,$gt:energ-0.1}})
       res.status(200).json(data);
    }
    catch(error){
       res.status(500).json({message:error.message})
    }
})

async function getNRandomSongsGivenValenceAndEnergy(valence,energy,n){
    try{
        const data = await Model.aggregate([
            {
                $match:{valence:{$lt:valence+0.1,$gt:valence-0.1,
                    energy:{$lt:energy+0.1,$gt:energy-0.1}}}
            },
            {$sample:{size:n}}
        ]);
        return data;
    }
    catch(error){
        return error.message;
    }
} 

router.get('/getSongCountForValence&Energy/:valence/:energy',async (req,res)=>{
    let valen = Number(req.params.valence);
    let energ = Number(req.params.energy);
    try{
        const data = await Model.find({
            valence:{$lt:valen+0.1,$gt:valen-0.1},
            energy:{$lt:energ+0.1,$gt:energ-0.1}}).count();
        res.status(200).json(data);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
})
