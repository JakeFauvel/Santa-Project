var stopped = false;

function setStopped(isStopped) {
	stopped = isStopped;
};

function getStopped() {
	return stopped;
};

module.exports = {
	setStopped: setStopped,
	getStopped: getStopped
};