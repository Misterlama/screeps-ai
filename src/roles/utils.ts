export function goGetResource(
  creep: Creep,
  resource: ResourceConstant,
  minStock = 0
) {
  var targets = creep.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        (structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN) &&
        (structure.store.getUsedCapacity(resource) || 0) > minStock
      );
    }
  });
  if (targets.length > 0) {
    if (creep.withdraw(targets[0], resource) == ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0], {
        visualizePathStyle: { stroke: "#00ff00" }
      });
      return true;
    }
  }
  return false;
}

export function goStoreResource(
  creep: Creep,
  resource: ResourceConstant
): boolean {
  var targets = Game.spawns["Spawn1"].room.find(FIND_MY_STRUCTURES, {
    filter: (structure: Structure) => {
      return (
        (structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType === STRUCTURE_CONTAINER) &&
        (structure.store.getFreeCapacity(resource) || 0) > 0
      );
    }
  });
  if (targets.length > 0) {
    if (creep.transfer(targets[0], resource) == ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0], {
        visualizePathStyle: { stroke: "#ff0f0" }
      });
      return true;
    }
  }
  return false;
}

export function goHarvest(
  creep: Creep,
  resource: ResourceConstant,
  limit = true
) {
  if (creep.store.getFreeCapacity(resource) === 0) return false;
  if (!creep.memory.node) {
    var nodes = creep.room.find(FIND_SOURCES);
    var node = findNode(nodes, limit);
    if (!node) return false;
    creep.memory.node = node;
  }
  var object = Game.getObjectById(creep.memory.node.id);
  if (!object) return false;
  if (creep.harvest(object) == ERR_NOT_IN_RANGE) {
    creep.moveTo(object, {
      visualizePathStyle: { stroke: "#00ffff" }
    });
  }
  return true;
}
export function goPillage(creep: Creep) {
  if (creep.store.getFreeCapacity() === 0) return false;
  for (let flag in Game.flags) {
    if (Game.flags[flag].color === COLOR_ORANGE) {
      if (Game.flags[flag].room) {
        // test
        var targets = Game.flags[flag].room!.find(FIND_RUINS, {
          filter: (structure: Structure) => {
            return structure.store.getUsedCapacity() > 0;
          }
        });
        if (targets.length > 0) {
          if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
              visualizePathStyle: { stroke: "#ffffff" }
            });
            return true;
          }
        }
        return false;
      } else {
        creep.moveTo(Game.flags[flag], {
          visualizePathStyle: { stroke: "#ff00ff" }
        });
      }
    }
  }

  return false;
}

export function goUpgradeController(creep: Creep) {
  if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;
  let controller = creep.room.controller;
  if (!controller) return false;
  if (
    creep.upgradeController(controller) === ERR_NOT_IN_RANGE
    //creep.signController(creep.room.controller, "") === ERR_NOT_IN_RANGE
  ) {
    creep.moveTo(controller, {
      visualizePathStyle: { stroke: "#ffffff" }
    });
  }
  return true;
}

export function goBuild(creep: Creep) {
  if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;
  var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
  if (targets.length) {
    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0], {
        visualizePathStyle: { stroke: "#ffffff" }
      });
    }
    return true;
  }
  return false;
}

export function goRepair(creep: Creep) {
  if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return false;
  var targets = creep.room.find(FIND_STRUCTURES, {
    filter: (structure: Structure) => {
      return structure.hits / structure.hitsMax < 0.2;
    }
  });
  if (targets.length) {
    if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0], {
        visualizePathStyle: { stroke: "#ffffff" }
      });
    }
    return true;
  }
  return false;
}

function findNode(nodes: Source[], limit: boolean) {
  if (nodes.length === 0) return false;
  if (!Memory.nodes) Memory.nodes = {};
  var idx = 0;
  while (idx < nodes.length) {
    if (!Memory.nodes[nodes[idx].id]) {
      if (limit) {
        Memory.nodes[nodes[idx].id] = 1;
      }
      return nodes[idx];
    } else if (Memory.nodes[nodes[idx].id] < 3) {
      if (limit) {
        Memory.nodes[nodes[idx].id] += 1;
      }
      return nodes[idx];
    }
    idx += 1;
  }
  return false;
}
