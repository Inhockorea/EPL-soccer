/** Routes for teams. */

const express = require("express");
const slugify = require("slugify");
const ExpressError = require("../expressError")
const db = require("../db");

let router = new express.Router();


/** GET / => list of teams.
 *
 * */

router.get("/", async function (req, res, next) {
  try {
    const result = await db.query(
          `SELECT name 
           FROM teams 
           ORDER BY name`
    );

    return res.json({"teams": result.rows});
  }

  catch (err) {
    return next(err);
  }
});



/** POST / => add new Team
 *
 * */

router.post("/", async function (req, res, next) {
  try {
    let {name,} = req.body;
    let code = slugify(name, {lower: true});

    const result = await db.query(
          `INSERT INTO teams (name) 
           VALUES ($1)
           RETURNING name`,
        [name]);

    return res.status(201).json({"company": result.rows[0]});
  }

  catch (err) {
    return next(err);
  }
});


/** PUT /[code] => update company
 *
 * */

router.put("/:code", async function (req, res, next) {
  try {
    let {name, } = req.body;
    let code = req.params.code;

    const result = await db.query(
          `UPDATE teams
           SET name=$1
           where name=$1
           RETURNING name`,
        [name,]);

    if (result.rows.length === 0) {
      throw new ExpressError(`No such team: ${name}`, 404)
    } else {
      return res.json({"company": result.rows[0]});
    }
  }

  catch (err) {
    return next(err);
  }

});


/** DELETE /[code] => delete team
 *
 * => {status: "deleted"}
 *
 */

router.delete("/:code", async function (req, res, next) {
  try {
    let code = req.params.code;

    const result = await db.query(
          `DELETE FROM teams
           WHERE name=$1
           RETURNING name`,
        [name]);

    if (result.rows.length == 0) {
      throw new ExpressError(`No such company: ${name}`, 404)
    } else {
      return res.json({"status": "deleted"});
    }
  }

  catch (err) {
    return next(err);
  }
});


module.exports = router;