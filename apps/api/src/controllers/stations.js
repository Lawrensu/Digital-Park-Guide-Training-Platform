import prisma from '../lib/prisma.js';

// Cyndia — implement each function below
// all routes here are admin-only, RBAC is already enforced in routes/stations.js

export const list = async (req, res) => {
    // return all stations, ordered by name
    // no pagination needed — station list is small and used for dropdowns
};


export const create = async (req, res) => {
    // 1. create station with req.body.name
    // 2. name must be unique — catch P2002 Prisma error and return 409
    // 3. return 201 with created station
};


export const getOne = async (req, res) => {
    // 1. find station by req.params.id
    // 2. return 404 if not found
};


export const update = async (req, res) => {
    // 1. find station by req.params.id — return 404 if not found
    // 2. update name
    // 3. name must be unique — catch P2002 and return 409
};


export const remove = async (req, res) => {
    // station cannot be deleted while guides are assigned to it
    // 1. count users with stationId === req.params.id
    // 2. if count > 0, return 409 with message explaining guides must be reassigned first
    // 3. otherwise delete and return 204
};
