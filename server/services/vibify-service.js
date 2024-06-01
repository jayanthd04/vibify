const express =require('express');
const Model = require('../model/model')
const padding = 0.1;
class VibifyService{
    async getNRandomSongsGivenValenceAndEnergy(valence,energy,n) {
        try{
            const data = await Model.aggregate([
                {
                    $match:{valence:{$lt:valence+padding,$gt:valence-padding},
                        energy:{$lt:energy+padding,$gt:energy-padding}
                    }
                },
                {$project:{_id:0,track_id:1}},
                {$sample:{size:n}}
            ]);
            return data;
        }
        catch(error){
            return error.message;
        }
    }
    async getSongCountForValenceAndEnergy(valence,energy){
        try{
            const data = await Model.find({
                valence:{$lt:valence+padding,$gt:valence-padding},
                energy:{$lt:energy+padding,$gt:energy-padding}}).count();
            return data;
        }
        catch(error){
            return error.message;
        }
    }
}

module.exports = VibifyService;
