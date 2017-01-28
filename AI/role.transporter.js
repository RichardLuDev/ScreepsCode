let roleMiner = require('role.miner');

let roleTransporter = {
    S_READY_FOR_PICKUP: 0,
    S_PICKUP: 1,
    S_READY_FOR_DROPOFF: 2,
    S_DROPOFF: 3,

    updateState: function (transporter) {
        if (transporter.memory.state === this.S_READY_FOR_PICKUP) {
            if (transporter.memory.pickupTarget) {
                transporter.memory.state = this.S_PICKUP;
            }
            return;
        }

        if (transporter.memory.state === this.S_READY_FOR_DROPOFF) {
            if (transporter.memory.dropoffTarget) {
                transporter.memory.state = this.S_DROPOFF;
            }
            return;
        }

        if (transporter.memory.state === this.S_PICKUP) {
            if (transporter.carry.energy === transporter.carryCapacity) {
                transporter.memory.state = this.S_READY_FOR_DROPOFF;
                return;
            }
            if (!transporter.memory.pickupTarget) {
                transporter.memory.state = this.S_READY_FOR_PICKUP;
                return;
            }
        }

        if (transporter.memory.state === this.S_DROPOFF) {
            if (transporter.carry.energy === 0) {
                transporter.memory.state = this.S_READY_FOR_PICKUP;
                return;
            }
            if (!transporter.memory.dropoffTarget) {
                transporter.memory.state = this.S_READY_FOR_DROPOFF;
                return;
            }
        }
    },

    executeState: function (transporter) {
        if (transporter.memory.state === this.S_PICKUP && transporter.memory.pickupTarget) {
            let pickupTarget = Game.getObjectById(transporter.memory.pickupTarget);
            if (!pickupTarget) {
                transporter.memory.pickupTarget = null;
                return;
            }

            let isNear = transporter.pos.isNearTo(pickupTarget);
            if (isNear) {
                roleMiner.requestTransfer(pickupTarget.id, transporter.id);
            }
            else {
                transporter.moveTo(pickupTarget);
            }
        }

        if (transporter.memory.state === this.S_DROPOFF && transporter.memory.dropoffTarget) {
            let dropoffTarget = Game.getObjectById(transporter.memory.dropoffTarget);
            if (!dropoffTarget) {
                transporter.memory.dropoffTarget = null;
                return;
            }

            let response = transporter.transfer(dropoffTarget, RESOURCE_ENERGY);
            transporter.memory.debug = 'transfer response is ' + response + ' for ' + transporter.memory.dropoffTarget;

            if (response === ERR_NOT_IN_RANGE) {
                transporter.moveTo(dropoffTarget);
            }

            if (response !== OK && response !== ERR_NOT_IN_RANGE) {
                transporter.memory.dropoffTarget = null;
            }
        }
    }
}

module.exports = roleTransporter;