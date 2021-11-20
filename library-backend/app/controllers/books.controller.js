const db = require("../models");
const { verifyJwtToken } = require("./users.controller");
const Books = db.books;

// Create and Save a new Tutorial
exports.create = (req, res) => {
    var access = verifyJwtToken(req, 'admin');
    // Validate request
    if (access) {
        if (!req.body.title) {
            res.status(400).send({ message: "Content can not be empty!" });
            return;
        }

        // Create a Tutorial
        const books = new Books({
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            status: req.body.status,
            issuedtoStudent: req.body.issuedtoStudent,
        });

        // Save Tutorial in the database
        books
            .save(books)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Tutorial."
                });
            });
    } else {
        res.status(403).send('unauthorized');
    }
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    var access = verifyJwtToken(req, '');
    if (access) {
        const title = req.query.title;
        var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

        Books.find(condition)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving tutorials."
                });
            });
    } else {
        res.status(403).send('unauthorized');
    }
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    var access = verifyJwtToken(req, 'admin');
    if (access) {
        const id = req.params.id;

        Books.findById(id)
            .then(data => {
                if (!data)
                    res.status(404).send({ message: "Not found Tutorial with id " + id });
                else res.send(data);
            })
            .catch(err => {
                res
                    .status(500)
                    .send({ message: "Error retrieving Tutorial with id=" + id });
            });
    } else {
        res.status(403).send('unauthorized');
    }
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    var access = verifyJwtToken(req, 'admin');

    if (access) {
        if (!req.body) {
            return res.status(400).send({
                message: "Data to update can not be empty!"
            });
        }

        const id = req.params.id;

        Books.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
            .then(data => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
                    });
                } else res.send({ message: "Tutorial was updated successfully." });
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating Tutorial with id=" + id
                });
            });
    } else {
        res.status(403).send('unauthorized');
    }
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Books.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
                });
            } else {
                res.send({
                    message: "Tutorial was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with id=" + id
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Books.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Tutorials were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all tutorials."
            });
        });
};