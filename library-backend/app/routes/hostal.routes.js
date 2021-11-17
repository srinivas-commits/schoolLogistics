module.exports = app => {
    const hostal = require("../controllers/hostal.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", hostal.create);

    // Retrieve all Tutorials
    router.get("/", hostal.findAll);

    // Retrieve a single Tutorial with id
    router.get("/:id", hostal.findOne);

    // Update a Tutorial with id
    router.put("/:id", hostal.update);

    // Delete a Tutorial with id
    router.delete("/:id", hostal.delete);

    // Create a new Tutorial
    router.delete("/", hostal.deleteAll);

    app.use("/api/hostal", router);
};