let utils = require('utils');

let roomManager = {

    REQUIRED_WORKERS : 6,
    REQUIRED_MINERS : 2,
    REQUIRED_TRANSPORTERS : 6,

    run: function (room) {
        let creeps = room.find(FIND_MY_CREEPS);

        let workers = [];
        let miners = [];
        let transporters = [];

        for (let i = 0; i < creeps.length; i++) {
            let creep = creeps[i];
            if (creep.memory.role === 'worker') workers.push(creep);
            if (creep.memory.role === 'miner') miners.push(creep);
            if (creep.memory.role === 'transporter') transporters.push(creep);
        }

        //Spawn creeps as needed
        let roomSpawns = room.find(FIND_MY_SPAWNS);
        if (roomSpawns.length > 0) {
            let roomSpawn = roomSpawns[0];
            if (workers.length < this.REQUIRED_WORKERS) {
                let name = roomSpawn.creepCreep([WORK, CARRY, CARRY, MOVE, MOVE], undefined, { role: 'worker', state: 0, target: null });
                console.log('Spawning new worker: ' + name);
            }
            if (miners.length < this.REQUIRED_MINERS) {
                let name = roomSpawn.creepCreep([WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, WORK, CARRY, MOVE, MOVE], undefined, { role: 'miner', state: 0, target: null });
                console.log('Spawning new miner: ' + name);
            }
            if (transporter.length < this.REQUIRED_TRANSPORTERS) {
                let name = roomSpawn.creepCreep([CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], undefined, { role: 'miner', state: 0, target: null });
                console.log('Spawning new transporter: ' + name);
            }
        }

        //Assign work to miners
        let energySourcesInfo = getEnergySourcesInfo(room);

        for (let i = 0; i < miners.length; i++) {
            let miner = miners[i];
            if (miner.spawning) continue;
            
            if (miner.memory.target) {
            }
        }
    },

    getEnergySourcesInfo(room) {
        let energySources = room.find(FIND_SOURCES);
        let energySourcesInfo = [];
        for (let i = 0; i < energySources.length; i++) {
            energySourcesInfo.push({
                source: energySources[i],
                miners: []
            });
        }
        return energySourcesInfo;
    },

    addMinerToSourcesInfo(energySourcesInfo, miner) {
        if (miner.spawning) return;
        if (miner.memory.target) {
            for (let i = 0; i < energySourcesInfo.length; i++) {
                if (energySourcesInfo[i].source.id === miner.memory.target) {
                    energySourcesInfo[i].miners.push(miner);
                }
            }
        }
    }
}

module.exports = roomManager;