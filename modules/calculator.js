
function process(message) {
    return new Promise(function(resolve, reject) {
        try {
            let result = eval(message);
            resolve(message + ' = ' + result);
        } catch (e) {
            reject(e);
        }
    })
}

var exports = module.exports;
exports.process = process;