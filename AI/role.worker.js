let utils = require('utils');

let roleWorker = {
    
    S_IDLE : 0,
    S_GATHER : 1,
    S_TRANSFER : 2,
    S_UPGRADE : 3,
    S_BUILD : 4,

    updateState:function(creep){
        if(creep.memory.state === this.S_IDLE) {
            creep.memory.state = this.S_GATHER;
            creep.memory.target = null;
            return;
        }
        
        if (creep.memory.state === this.S_GATHER) {
            if(creep.carry.energy === creep.carryCapacity){
                let target = utils.findClosestTransferTarget(creep);
                if(target){
                    creep.memory.state = this.S_TRANSFER;
                    creep.memory.target = target.id;
                    creep.memory.debug2 = 'found transfer target ' + target.id;
                    return;
                }
                
                let buildTarget = utils.findClosestBuildTarget(creep);
                if(buildTarget){
                    creep.memory.state = this.S_BUILD;
                    creep.memory.target = buildTarget.id;
                    creep.debug2 = 'found build target ' + buildTarget.id;
                    return;
                }
                creep.memory.state = this.S_UPGRADE;
                creep.memory.target = null;
                creep.memory.debug2 = 'didnt find transfer target';
            }
            return;
        }
        
        if (creep.memory.state === this.S_BUILD) {
            if(creep.carry.energy === 0){
                creep.memory.state = this.S_GATHER;
                creep.memory.target = null;
            }
            if (creep.memory.target === this.null) {
                creep.memory.state = S_IDLE;
            }
            return;
        }
        
        if (creep.memory.state === this.S_TRANSFER) {
            if(creep.carry.energy === 0){
                creep.memory.state = this.S_GATHER;
                creep.memory.target = null;
            }
            if(creep.memory.target === null){
                creep.memory.state = this.S_IDLE;
            }
            return;
        }
        
        if (creep.memory.state === this.S_UPGRADE) {
            if(creep.carry.energy === 0){
                creep.memory.state = this.S_GATHER;
                creep.memory.target = null;
            }
            return;
        }
    },
    
    executeState:function(creep){
        if (creep.memory.state === this.S_GATHER) {
            if(creep.memory.target === null){
                let target = utils.findClosestSource(creep);

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
        
        if (creep.memory.state === this.S_BUILD) {
            if(creep.memory.target === null){
                let target = utils.findClosestBuildTarget(creep);
                
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
        
        if (creep.memory.state === this.S_TRANSFER) {
            if(creep.memory.target === null){
                let target = utils.findClosestTransferTarget(creep);
                
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
        
        if (creep.memory.state === this.S_UPGRADE) {
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