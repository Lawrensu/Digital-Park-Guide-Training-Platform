import prisma from '../lib/prisma.js';

// Cyndia — implement each function below
// all routes here are admin-only, RBAC is already enforced in routes/stations.js

export const list = async (req, res) => {
    // return all stations, ordered by name
    // no pagination needed — station list is small and used for dropdowns
    try {
        const stations = await prisma.station.findMany({
            orderBy: { name: 'asc' } // Alphabetical order for dropdowns
        });
        return res.status(200).json({ success: true, data: stations });
    } catch (err){
        return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message }});
    }
};


export const create = async (req, res) => {
    try {
        // create station with req.body.name
        const station = await prisma.station.create({
            data: { name: req.body.name }
        });
        // return 201 with created station
        return res.status(201).json({ success: true, data: station });
    } catch (err){
        // name must be unique — catch P2002 Prisma error and return 409
        if (err.code === 'P2002'){
            return res.status(409).json({
                success: false,
                error: { code: 'CONFLICT', message: 'A station with this mame already exists'}
            });
        }
        return res.status(500).json({ success: false, error:{ code: 'SERVER_ERROR', message: err.message }});
    }
};


export const getOne = async (req, res) => {
    try {
        // find station by req.params.id
        const station = await prisma.station.findUnique({
            where: { id: req.params.id }
        });

        // return 404 if not found
        if (!station) {
            return res.status(404).json({
                success: false,
                error:{ code: 'NOT_FOUND', message: 'Station not found' }
            });
        }
        return res.status(200).json({ success: true, data: station });
    } catch (err) {
        return res.status(500).json({ success: false, error:{ code: 'SERVER_ERROR', message: err.message }});
    }
};


export const update = async (req, res) => {
    try{
        // find station by req.params.id — return 404 if not found
        const station = await prisma.station.findUnique({
            where: { id: req.params.id }
        });

        if (!station){
            return res.status(404).json({
                success: false,
                error: { code: 'NOT_FOUND', message: 'Station not found' }
            });
        }

        // update name
        const updatedStation = await prisma.station.update({
            where: { id: req.params.id },
            data: req.body 
        });

         return res.status(200).json({ success: true, data: updatedStation });
    } catch (err) {
        // name must be unique — catch P2002 and return 409
        if (err.code === 'P2002') {
            return res.status(409).json({ 
                success: false, 
                error: { code: 'CONFLICT', message: 'A station with this name already exists' } 
            });
        }
        return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
    }
};


export const remove = async (req, res) => {
    try {
        const stationId = req.params.id;

        // count users with stationId === req.params.id
        // We use camelCase 'stationId'
        const assignedGuidesCount = await prisma.user.count({
            where: { stationId: stationId }
        });

        // if count > 0, return 409
        if (assignedGuidesCount > 0) {
            return res.status(409).json({ 
                success: false, 
                error: { 
                    code: 'CONFLICT', 
                    message: 'Cannot delete station. Please reassign all assigned guides to another station first.' 
                } 
            });
        }

        // otherwise delete and return 204
        await prisma.station.delete({
            where: { id: stationId }
        });

        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
    }
};