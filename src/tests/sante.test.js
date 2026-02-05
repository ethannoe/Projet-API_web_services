const assert = require("assert");

const app = require("../app");

const tester = () => {
  assert.ok(app, "L'application doit être chargée correctement.");
  assert.strictEqual(typeof app.get, "function", "Express doit exposer des méthodes HTTP.");
  console.log("Tests de santé réussis.");
};

tester();
