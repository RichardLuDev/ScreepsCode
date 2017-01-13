let roleWorker = require('role.worker');

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
}