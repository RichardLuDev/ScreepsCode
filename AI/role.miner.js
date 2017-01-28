let roleMiner = {
    S_IDLE: 0,
    S_GATHER: 1,

    updateState: function (miner) {
        if (miner.memory.state === this.S_IDLE) {
            if (miner.carry.energy !== miner.carryCapacity) {
                miner.memory.state = this.S_GATHER;
            }
            return;
        }

        if (miner.memory.state === this.S_GATHER) {
            if (miner.carry.energy === miner.carryCapacity) {
                miner.memory.state = this.S_IDLE;
            }
            return;
        }
    },

    executeState: function (miner) {
        if (miner.memory.state === this.S_GATHER && miner.memory.target !== null) {
            let target = Game.getObjectById(miner.memory.target);
            let response = miner.harvest(target);
            miner.memory.debug = 'harvest response is ' + response + ' for ' + miner.memory.target;

            if (response === ERR_NOT_IN_RANGE) {
                miner.moveTo(target);
            }
        }

        if (miner.memory.transferTargets) {
            let transferTargets = miner.memory.transferTargets;
            for (let i = 0; i < transferTargets.length; i++) {
                let transferTarget = Game.getObjectById(miner.memory.transferTargets[i]);
                if (transferTarget) {
                    miner.transfer(transferTarget, RESOURCE_ENERGY);
                }
            }

            miner.memory.transferTargets = [];
        }
    },

    run: function (miner) {
        this.updateState(miner);
        this.executeState(miner);
    },

    requestTransfer: function (minerID, transferTargetID) {
        let miner = Game.getObjectById(minerID);
        if (miner.memory.transferTargets) {
            miner.memory.transferTargets.push(transferTargetID);
        } else {
            miner.memory.transferTargets = [transferTargetID];
        }
    }
}

module.exports = roleMiner;