let utils = {

    findClosestTransferTarget: function (creep) {
        return creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION
                        || structure.structureType === STRUCTURE_SPAWN
                        || structure.structureType === STRUCTURE_TOWER)
                        && structure.energy < structure.energyCapacity;
            }
        });
    },

    findClosestSource: function (creep) {
        return creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (source) => {
                return source.energy > 0;
            }
        });
    },

    findHighestEnergySource: function (creep) {
        let sources = creep.room.find(FIND_SOURCES);

        let max = 0;
        let maxSource = null;
        for (let sourceName in sources) {
            let source = sources[sourceName];
            if (source.energy > max) {
                max = source.energy;
                maxSource = source;
            }
        }
        return maxSource;
    },

    findClosestBuildTarget: function (creep) {
        return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    },
}

module.exports = utils;