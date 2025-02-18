import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

router.get("/", async (req, res) => {
  let collection = await db.collection("Dinosaurs");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.get("/:id", async (req, res) => {
  let collection = await db.collection("Dinosaurs");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

router.get("/filter/:hip_clade", async (req, res) => {
  let collection = await db.collection("Dinosaurs");
  let query = { Hip_Clade: req.params.hip_clade };
  let result = await collection.find(query).toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

router.get("/year/:year", async (req, res) => {
  let collection = await db.collection("Dinosaurs");
  let query = { 'Time.Year_of_first_fossil_found': parseInt(req.params.year) };
  let result = await collection.find(query).toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

router.get("/year/:year_min/:year_max", async (req, res) => {
  let collection = await db.collection("Dinosaurs");
  let query1 = { 'Time.Year_of_first_fossil_found':{$lte:parseInt(req.params.year_max) }};
  let query2 = { 'Time.Year_of_first_fossil_found':{$gte:parseInt(req.params.year_min) }};
  let result = await collection.find({$and :[query1,query2]}).toArray();
  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});
router.get("/h_d/:habitat/:diet", async (req, res) => {
  let collection = await db.collection("Dinosaurs");
  let query1 = { Habitat:req.params.habitat};
  let query2 = { Diet:req.params.diet};
  let result = await collection.find({$and :[query1,query2]}).toArray();
  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});
router.get("/h_d_year/:year_min/:year_max/:habitat/:diet", async (req, res) => {
  let collection = await db.collection("Dinosaurs");
  let query1 = { 'Time.Year_of_first_fossil_found':{$lte:parseInt(req.params.year_max) }};
  let query2 = { 'Time.Year_of_first_fossil_found':{$gte:parseInt(req.params.year_min) }};
  let query3= { Habitat:req.params.habitat};
  let query4 = { Diet:req.params.diet};
  let result = await collection.find({$and :[query1,query2,query3,query4]}).toArray();
  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});
// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      Name: req.body.Name,
      Habitat: req.body.Habitat,
      Hip_Clade: req.body.Hip_Clade,
      Diet:req.body.Diet,
      Time:req.body.Time,
      Areas_where_fossils_were_found:req.body.Areas_where_fossils_were_found,
      Order:req.body.Order,
      Contemporary:req.body.Contemporary
    };
    let collection = await db.collection("Dinosaurs");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding dinosaur");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        Name: req.body.Name,
        Habitat: req.body.Habitat,
        Hip_Clade: req.body.Hip_Clade,
        Diet:req.body.Diet,
        Time:req.body.Time,
        Areas_where_fossils_were_found:req.body.Areas_where_fossils_were_found,
        Order:req.body.Order,
        Contemporary:req.body.Contemporary
      },
    };

    let collection = await db.collection("Dinosaurs");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating dinosaur");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("Dinosaurs");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting dinosaur");
  }
});

export default router;