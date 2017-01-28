let roleWorker = require('role.worker');
let buildingTower = require('building.tower');

module.exports.loop = function() {

    let myWorkers = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker');
    
    if(myWorkers.length < 8){
        let newName = Game.spawns['Sp1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], undefined, {role : 'worker', state : 0, target : null});
        console.log('Spawning new worker: ' + newName);
    }

    for(let name in Game.creeps){
        let creep = Game.creeps[name];
        if(creep.memory.role === 'worker'){
            roleWorker.run(creep);
        }
    }

    for (let name in Game.structures) {
        let structure = Game.structures[name];
        if (structure.structureType === STRUCTURE_TOWER) {
            buildingTower.run(structure);
        }
    }
}