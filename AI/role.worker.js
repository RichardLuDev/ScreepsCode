let S_IDLE = 0;
let S_GATHER = 1;
let S_TRANSFER = 2;
let S_UPGRADE = 3;
let S_BUILD = 4;

let roleWorker = {
    
    findClosestTransferTarget:function(creep){
        return creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_EXTENSION
                                || structure.structureType === STRUCTURE_SPAWN)
                                && structure.energy < structure.energyCapacity;
                    }
        });
    },
    
    findClosestSource:function(creep){
        return creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (source) => {
                return source.energy > 0;
            }
        });
    },
    
    findHighestEnergySource:function(creep){
        let sources = creep.room.find(FIND_SOURCES);
        
        let max = 0;
        let maxSource = null;
        for(let sourceName in sources){
            let source = sources[sourceName];
            if(source.energy > max){
                max = source.energy;
                maxSource = source;
            }
        }
        return maxSource;
    },
    
    findClosestBuildTarget:function(creep){
        return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    },
    
    updateState:function(creep){
        if(creep.memory.state === S_IDLE) {
            creep.memory.state = S_GATHER;
            creep.memory.target = null;
            return;
        }
        
        if(creep.memory.state === S_GATHER){
            if(creep.carry.energy === creep.carryCapacity){
                let target = this.findClosestTransferTarget(creep);
                if(target){
                    creep.memory.state = S_TRANSFER;
                    creep.memory.target = target.id;
                    creep.memory.debug2 = 'found transfer target ' + target.id;
                    return;
                }
                
                let buildTarget = this.findClosestBuildTarget(creep);
                if(buildTarget){
                    creep.memory.state = S_BUILD;
                    creep.memory.target = buildTarget.id;
                    creep.debug2 = 'found build target ' + buildTarget.id;
                    return;
                }
                creep.memory.state = S_UPGRADE;
                creep.memory.target = null;
                creep.memory.debug2 = 'didnt find transfer target';
            }
            return;
        }
        
        if(creep.memory.state === S_BUILD){
            if(creep.carry.energy === 0){
                creep.memory.state = S_GATHER;
                creep.memory.target = null;
            }
            if(creep.memory.target === null){
                creep.memory.state = S_IDLE;
            }
            return;
        }
        
        if(creep.memory.state === S_TRANSFER){
            if(creep.carry.energy === 0){
                creep.memory.state = S_GATHER;
                creep.memory.target = null;
            }
            if(creep.memory.target === null){
                creep.memory.state = S_IDLE;
            }
            return;
        }
        
        if(creep.memory.state === S_UPGRADE){
            if(creep.carry.energy === 0){
                creep.memory.state = S_GATHER;
                creep.memory.target = null;
            }
            return;
        }
    },
    
    executeState:function(creep){
        if(creep.memory.state === S_GATHER){
            if(creep.memory.target === null){
                let target = this.findClosestSource(creep);
                
                if(target){
                    creep.memory.target = target.id;
                }
            } 
            else {
                let target = Game.getObjectById(creep.memory.target);
                let response = creep.harvest(target);
                creep.memory.debug = 'harvest response is ' + response + ' for ' + creep.memory.target;
                
                if(response === ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
                
                if(response !== OK && response !== ERR_NOT_IN_RANGE){
                    creep.memory.target = null;
                }

            }
        }
        
        if(creep.memory.state === S_BUILD){
            if(creep.memory.target === null){
                let target = this.findClosestBuildTarget(creep);
                
                if(target){
                    creep.memory.target = target.id;
                }
            }
            else {
                let target = Game.getObjectById(creep.memory.target);
                let response = creep.build(target);
                creep.memory.debug = 'build response is ' + response + ' for ' + creep.memory.target;
                
                if(response === ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
                
                if(response !== OK && response !== ERR_NOT_IN_RANGE){
                    creep.memory.target = null;
                }
            }
        }
        
        if(creep.memory.state === S_TRANSFER){
            if(creep.memory.target === null){
                let target = this.findClosestTransferTarget(creep);
                
                if(target){
                    creep.memory.target = target.id;
                }
            }
            else{
                let target = Game.getObjectById(creep.memory.target);
                let response = creep.transfer(target, RESOURCE_ENERGY);
                creep.memory.debug = 'transfer response is ' + response + ' for ' + creep.memory.target;
                
                if(response === ERR_NOT_IN_RANGE){
                    creep.moveTo(target);
                }
                
                if(response !== OK && response !== ERR_NOT_IN_RANGE){
                    creep.memory.target = null;
                }
            }
        }
        
        if(creep.memory.state === S_UPGRADE){
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller);
            }
        }
    },
    
    run:function(creep){
        this.updateState(creep);
        this.executeState(creep);
    }
}


module.exports = roleWorker;