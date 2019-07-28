const detective = require("detective");
const reslove = require("resolve").sync;
const fs = require("fs");
const path = require("path");

let ID = 0;
createModuleObject = filePath => {
  const source = fs.readFileSync(filePath, "utf-8");
  const requires = detective(source);
  const id = ID++;

  return { id, filePath, source, requires };
};

getModules = entry => {
  const rootModule = createModuleObject(entry);
  rootModule;
  const modules = [rootModule];

  for (const module of modules) {
    module.map = {};
    module.requires.forEach(dependency => {
      const basedir = path.dirname(module.filePath);
      const dependencyPath = reslove(dependency, { basedir });
      const dependencyObject = createModuleObject(dependencyPath);
      module.map[dependency] = dependencyObject.id;
      modules.push(dependencyObject);
    });
  }
  return modules;
};

pack = modules => {
  const modulesSource = modules
    .map(
      module =>
        `${module.id}: {
            factory : (module,require) => {
                ${module.source}
            },
            map: ${JSON.stringify(module.map)}
        }`
    )
    .join();

  return `(modules=>{
        const require = id=>{
            const {factory,map} = modules[id];
            const localRequire = name => require(map[name]);
            const module = { exports :{ }}
            factory(module, localRequire)
            return module.exports
        }
        require(0)
    })({${modulesSource}})`;
};

module.exports = entry => pack(getModules(entry));
