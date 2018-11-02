var Pengine = require('pengines');

module.exports = function(RED) {
	function PengineRPCNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		node.on('input', function(msg) {
				var pengine = new Pengine({
					server: config.server,
					chunk: parseInt(config.chunk),
					src: config.sourceText,
					ask: msg.payload,
					template: config.template,
					ondata: handleData,
					onerror: handleError
				});
				function handleData(result) {
					node.send({payload: result});
				}
				function handleError(result) {
					node.warn(result.data);
					node.error('pengine error ', result.data);
				}
		});
	}
	RED.nodes.registerType('pengine-rpc', PengineRPCNode);
};
