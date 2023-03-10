const express = require('express');
const router = express.Router();
const fs = require('fs');


const pizzas = JSON.parse(fs.readFileSync('./pizzas.json', 'utf8')).pizzas;
const allergens = JSON.parse(fs.readFileSync('./pizzas.json', 'utf8')).allergens;

router
    .route('/pizza')
    .get((req, res) => {
        res.send(pizzas)
    })

router
    .route('/allergen')
    .get((req, res) => {
        res.send(allergens)
    })

module.exports = router