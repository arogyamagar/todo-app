const Express = require("express");
require("dotenv").config();
const Mongoclient = require("mongodb").MongoClient;
const cors = require("cors");

const app = Express();
app.use(cors());
app.use(Express.json());

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const DATABASENAME = process.env.DATABASENAME;
const PORT = process.env.PORT;

let database;

app.listen(PORT, () => {
  console.log("Server Starting.....");
  Mongoclient.connect(CONNECTION_STRING, (error, client) => {
    if (error) {
      throw new Error("Failed to connect to MongoDB");
    }
    database = client.db(DATABASENAME);
    console.log("Mongo DB Connected Successfully");
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

app.get("/api/todoapp/GetNotes", async (request, response, next) => {
  try {
    console.log("Fetching notes from the database");
    const result = await database
      .collection("todoappcollection")
      .find({})
      .toArray();
    console.log(`Sending ${result.length} notes`);
    response.send(result);
  } catch (error) {
    next(error);
  }
});

app.post("/api/todoapp/AddNotes", async (request, response, next) => {
  try {
    await database.collection("todoappcollection").insertOne({
      id: Math.random().toString(36).substr(2, 9),
      description: request.body.newNotes,
      isCompleted: false,
    });
    response.json("Added Successfully");
  } catch (error) {
    next(error);
  }
});

app.put("/api/todoapp/EditNote/:id", async (request, response, next) => {
  try {
    const noteId = request.params.id;
    const newDescription = request.body.newDescription;
    const result = await database
      .collection("todoappcollection")
      .updateOne({ id: noteId }, { $set: { description: newDescription } });
    if (result.matchedCount === 0) {
      return response.status(404).send({ error: "Note not found" });
    }
    console.log(`Edited note with id ${noteId}`);
    response.json("Edited Successfully");
  } catch (error) {
    next(error);
  }
});

app.put(
  "/api/todoapp/UpdateNoteStatus/:id",
  async (request, response, next) => {
    try {
      const noteId = request.params.id;
      const newStatus = request.body.isCompleted;
      const result = await database
        .collection("todoappcollection")
        .updateOne({ id: noteId }, { $set: { isCompleted: newStatus } });
      if (result.matchedCount === 0) {
        return response.status(404).send({ error: "Note not found" });
      }
      console.log(`Updated note status with id ${noteId}`);
      response.json("Updated Successfully");
    } catch (error) {
      next(error);
    }
  }
);

app.delete("/api/todoapp/DeleteNote/:id", async (request, response, next) => {
  try {
    const noteId = request.params.id;
    const result = await database
      .collection("todoappcollection")
      .deleteOne({ id: noteId });
    if (result.deletedCount === 0) {
      return response.status(404).send({ error: "Note not found" });
    }
    console.log(`Deleted note with id ${noteId}`);
    response.json("Deleted Successfully");
  } catch (error) {
    next(error);
  }
});
