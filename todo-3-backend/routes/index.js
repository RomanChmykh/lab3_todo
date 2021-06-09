var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoScheme = new Schema({text: String, done: Boolean, created: String}, {versionKey: false});
const ToDo = mongoose.model("toDo", todoScheme);

/**
 * @swagger
 * components:
 *   schemas:
 *     ToDo:
 *      type: object
 *      properties:
 *        data:
 *          type: object
 *          properties:
 *            text:
 *              type: string
 *              description: The todo text
 *            done:
 *              type: boolean
 *              description: ToDo done or not
 *            created:
 *              type: string
 *              description: The todo created data
 */

/**
 * @swagger
 *  /:
 *   get:
 *     summary: Returns all todos
 *     responses:
 *       200:
 *         description: Returns all todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ToDo'
 */
router.get('/', function (req, res) {
    ToDo.find(function (err, doc) {
        res.send(doc)
    });
});

/**
 * @swagger
 * /?text={text}:
 *   post:
 *     summary: Creates a todo
 *     parameters:
 *       - in: path
 *         name: text
 *         schema:
 *           type: string
 *         required: true
 *         description: The todos text
 *     responses:
 *       200:
 *         description: Returns a created todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ToDo'
 */
router.post('/', (req, res) => {
    ToDo.create({
        text: req.query.text,
        done: false,
        created: new Date(Date.now()).toLocaleString()
    }, function (err, doc) {
        res.send(doc)
    });
});

/**
 * @swagger
 * /?_id={_id}:
 *   delete:
 *     summary: Deletes a todo
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todos id
 *     responses:
 *       200:
 *         description: Returns if operation is successful
 *         content:
 *           application/json:
 *             schema:
 *              type: boolean
 */
router.delete('/', (req, res) => {
    ToDo.deleteOne({_id: req.query._id}, function (err, doc) {
        if (err) {
            res.send(false);
        } else {
            res.send(doc.deletedCount === 1)
        }
    });
});

/**
 * @swagger
 * /mark?_id={_id}&done={done}:
 *   post:
 *     summary: Marks todo to given {done} value
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The todos id
 *       - in: path
 *         name: done
 *         schema:
 *           type: boolean
 *         required: true
 *         description: Mark todo to this param value [whether done or not]
 *     responses:
 *       200:
 *         description: Returns updated todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ToDo'
 */
router.post('/mark', (req, res) => {
    ToDo.findOneAndUpdate({_id: req.query._id}, {done: req.query.done}, {new: true}, function (err, doc) {
        res.send(doc)
    });
});

module.exports = router;
