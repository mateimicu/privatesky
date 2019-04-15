var pubSub = $$.require("soundpubsub").soundPubSub;
var mq = $$.require("foldermq");
var path = require("path");

exports.create = function(folder, core){
    var inbound = mq.createQue(path.join(folder, "/mq/inbound/"), $$.defaultErrorHandlingImplementation);
    var outbound = mq.createQue(path.join(folder, "/mq/outbound/"), $$.defaultErrorHandlingImplementation);
        outbound.setIPCChannel(process);
        outbound = outbound.getHandler();

    inbound.setIPCChannel(process);
    inbound.registerAsIPCConsumer(function(err, swarm){
        //restore and execute this tasty swarm
        global.$$.swarmsInstancesManager.revive_swarm(swarm);
    });

    /*inbound.registerConsumer(function(err, swarm){
       //restore and execute this tasty swarm
        global.$$.swarmsInstancesManager.revive_swarm(swarm);
    });*/

    pubSub.subscribe($$.CONSTANTS.SWARM_FOR_EXECUTION, function(swarm){
        outbound.sendSwarmForExecution(swarm);
    });

    return pubSub;
};
