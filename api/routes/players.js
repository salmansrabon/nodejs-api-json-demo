const express=require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:"Server is up"
    });
});
const apiRoute="/api/v1";

const db=path.join(__dirname, './data.json'); //Locate the data file
const data = fs.readFileSync(db); //Read data from data file
const stats = JSON.parse(data); //To make data in json format

router.get(apiRoute+'/list', function (req, res) {
    res.status(200).json(stats);
});

router.get(apiRoute+'/get/:id', (req, res, next) => {
    try {
        const playerStats = stats.find(player => player.id === Number(req.params.id));
        if (!playerStats) {
            const err = new Error('Player info not found');
            err.status = 404;
            throw err;
        }
        res.json(playerStats);
    } catch (e) {
        next(e);
    }
});

router.post(apiRoute+'/create', (req, res, next) => {
    try {
        const playerStats = stats.find(player => player.id === Number(req.body.id));
        if (!playerStats) {
            const newStats = {
                id: req.body.id,
                wins: req.body.wins,
                losses: req.body.losses,
                points_scored: req.body.points_scored,
            };
            stats.push(newStats);
            fs.writeFileSync(db, JSON.stringify(stats));
            res.status(201).json({
                message:"Success",
                newStats:newStats
            });
            
        }
        else{
            const err = new Error('Player already exists');
            err.status = 200;
            throw err;
        }
    } 
    catch (e) 
    {
        next(e);
    }
});
router.put(apiRoute+'/update/:id', (req, res, next) => {
    try {
        const playerStats = stats.find(player => player.id === Number(req.params.id));
        if (!playerStats) {
        const err = new Error('Player stats not found');
        err.status = 404;
        throw err;
        }
        const newStatsData = {
            id: req.body.id,
            wins: req.body.wins,
            losses: req.body.losses,
            points_scored: req.body.points_scored,
        };
        const newStats = stats.map(player => {
            if (player.id === Number(req.params.id)) {
                return newStatsData;
            } else {
                return player;
            }
        });
        fs.writeFileSync(db, JSON.stringify(newStats));
        res.status(200).json({
            message:"Success",
            newStatsData:newStatsData
        });
    } 
    catch (e) 
    {
        next(e);
    }

});

router.delete(apiRoute+'/delete/:id', (req, res, next) => {
    try {
        const playerStats = stats.find(player => player.id === Number(req.params.id));
        if (!playerStats) {
        const err = new Error('Player stats not found');
        err.status = 404;
        throw err;
        }
        const newStats = stats.map(player => {
            if (player.id === Number(req.params.id)) {
                return null;
            } else {
                return player;
            }
        })
        .filter(player => player !== null);
        fs.writeFileSync(db, JSON.stringify(newStats));
        res.status(200).json({
            message: 'Deleted player'
        })
    } 
    catch (e) {
        next(e);
    }
});

module.exports=router;