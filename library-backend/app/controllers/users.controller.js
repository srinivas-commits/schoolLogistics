const db = require("../models");
const Users = db.users;

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body.username) {
        console.log(req.body.block);
        res.status(400).send({ message: "Content cannot be empty! " });
        return;
    }

    // Create a Tutorial
    const users = new Users({
        username: req.body.username,
        email: req.body.email,
        useraccess: req.body.useraccess,
        password: req.body.password,
    });

    // Save Tutorial in the database
    users.save(users)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : {};

    Users.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Users.findById(id)
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
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Users.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Users.findByIdAndRemove(id, { useFindAndModify: false })
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
    Users.deleteMany({})
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

const jwt = require('jsonwebtoken');
const TOKEN_SECRET = '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611';

function generateAccessToken(payload) {
    return jwt.sign(payload, TOKEN_SECRET, { expiresIn: '1800s' });
}

exports.authorize = (req, res) => {

    Users.findOne({ username: req.body.username })
        .then(data => {
            console.log(data);
            console.log(data.password === req.body.password);
            if (data.password === req.body.password) {
                const token = generateAccessToken({ username: req.body.username, role: data.useraccess });
                var result = {
                    'token': token,
                    'isauthorized': true
                };
                res.json(result);
            } else {
                var result = {
                    'token': '',
                    'isauthorized': false,
                    'msg': 'incorrect password'
                };
                res.status(401).json(result);
            }
        })
        .catch(err => {
            var result = {
                'token': '',
                'isauthorized': false,
                'msg': 'user not found'
            };
            res.status(401).json(result);
        });
}

exports.verifyJwtToken = function verifyJwtToken(req, access) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        return jwt.verify(token, TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(401);
            if (access != '') {
                if (user.role === access) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        });
    } else {
        res.sendStatus(401);
    }
}