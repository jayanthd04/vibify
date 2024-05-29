const express = require('express');

const router = express.Router();
const Model = require('../model/model')
const VibifyService = require('../services/vibify-service');
const vibifyService = new VibifyService();
module.exports = router;

router.get('/getSongCountForValence&Energy/:valence/:energy',async (req,res)=>{
    let valen = Number(req.params.valence);
    let energ = Number(req.params.energy);
    const resp = await vibifyService.getSongCountForValenceAndEnergy(valen,energ);
    res.status(200).json(resp);
})
