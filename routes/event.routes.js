const router = require('express').Router();
const Event = require('../models/Event.model');

//Create event
router.post('/event', async (req, res, next) => {
  try {
    const { title, description, eventCode } = req.body;

    const newEvent = await Event.create({
      title,
      description,
      eventCode,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

//Get all events
router.get('/events', async (req, res, next) => {
  try {
    const allEvents = await Event.find().populate('playlists');
    res.status(200).json(allEvents);
  } catch (error) {
    next(error);
  }
});

//Get single event
router.get('/event/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleEvent = await Event.findById(id).populate('playlists');
    res.status(200).json(singleEvent);
  } catch (error) {
    next(error);
  }
});

//Update event info
router.put('/event/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, eventCode, collaborators } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(id, {
      title,
      description,
      eventCode,
      collaborators,
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
});

//Update event by add playlist
router.put('/event/:eventId/add/:playlistId', async (req, res, next) => {
  try {
    //id from params refers to the playlist
    const { playlistId, eventId } = req.params;
    const updatedByEvent = await Event.findByIdAndUpdate(
      eventId,
      { $push: { playlists: playlistId } },
      { new: true }
    );

    res.status(200).json(updatedByEvent);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

//Update event by deleting playlist
router.put('/event/:eventId/delete/:playlistId', async (req, res, next) => {
  try {
    //id from params refers to the playlist
    const { playlistId, eventId } = req.params;
    const updatedByDel = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { playlists: playlistId } },
      { new: true }
    );

    res.status(200).json(updatedByDel);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

//Delete event
router.delete('/event/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await Event.findByIdAndRemove(id);

    res.status(200).json(`The event with id: ${id} was sucessfully deleted`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
