const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 3000


app.use(express.urlencoded({ extended: true }))
app.use(express.json())


mongoose.connect('mongodb+srv://obiboy2007_db_user:3edMbphJgtarqe1b@cluster0.jnugd9h.mongodb.net/catDB?retryWrites=true&w=majority')
.then(() => {
  console.log("MongoDB connected 🟢")

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
.catch(err => console.log("MongoDB error:", err))


const kittySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

const Kitten = mongoose.models.Kitten || mongoose.model('Kitten', kittySchema)

app.get("/api/server/status", (req, res) => {
  res.json({ msg: "Server is up and ready 🚀" })
})


app.post("/api/submit-cat", async (req, res) => {
  try {
   const newCat = new Kitten({ name: req.body.catName })
    await newCat.save()

    res.status(201).json(newCat)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


app.get("/api/cats", async (req, res) => {
  try {
    const cats = await Kitten.find()
    res.json(cats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


app.get("/api/cats/:id", async (req, res) => {
  try {
    const cat = await Kitten.findById(req.params.id)

    if (!cat) {
      return res.status(404).json({ msg: "Cat not found 😿" })
    }

    res.json(cat)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


app.put("/api/cats/:id", async (req, res) => {
  try {
    const updatedCat = await Kitten.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    )

    if (!updatedCat) {
      return res.status(404).json({ msg: "Cat not found 😿" })
    }

    res.json(updatedCat)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete("/api/cats/:id", async (req, res) => {
  try {
    const deletedCat = await Kitten.findByIdAndDelete(req.params.id)

    if (!deletedCat) {
      return res.status(404).json({ msg: "Cat not found 😿" })
    }

    res.json({ msg: "Cat deleted successfully 🗑️" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})