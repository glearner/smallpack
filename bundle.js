(modules=>{
        const require = id=>{
            const {factory,map} = modules[id];
            const localRequire = name => require(map[name]);
            const module = { exports :{ }}
            factory(module, localRequire)
            return module.exports
        }
        require(0)
    })({0: {
            factory : (module,require) => {
                const log = require("./logging");

log("hello world");

            },
            map: {"./logging":1}
        },1: {
            factory : (module,require) => {
                const logger = message => {
  console.log(message);
};
module.exports = logger;

            },
            map: {}
        }})