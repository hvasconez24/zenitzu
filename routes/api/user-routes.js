var express = require('express');
var router = express.Router();

var User = require('../../models/User');
var Thought = require('../../models/Thought');

// Get all users
router.get('/', (req, res) => {
    User.find({})
      .then(userDb => res.json(userDb))
      .catch(error => {
        console.log(error);
        res.status(500).json(error);
      });
});

// Get user by id
router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate('thoughts')
    .populate('friends')
    .then(userDb => {
      if(!userDb){
        res.status(404).json({message: 'No user found with this id'});
        return;
      }      
      res.json(userDb)
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//create user
router.post('/', (req, res) => {
  User.create(req.body)
    .then(userDb =>  res.json(userDb))
    .catch(error => {
      res.status(500).json(error);
    });
});

//update user
router.put('/:id', (req,res) =>{
  User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
      .then(userDb => {
          if (!userDb) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(userDb);
        })
      .catch(error => res.status(500).json(error));
})

//delete user
router.delete('/:id', (req,res) => {
  User.findOneAndDelete({_id: req.params.id})
  .then(userDb => {
      if (!userDb) {
          return res.status(404).json({ message: 'No user found with this id!' });
      }

      return Thought.deleteMany({ _id: { $in: userDb.thoughts } })
  })
  .then(() => {
      res.json({ message: 'user has been deleted.' });
  })
  .catch(error => res.status(500).json(error));
})

//add friend 
router.post('/:id/friends/:friendId', (req,res) =>{
  User.findOneAndUpdate(
    { _id: req.params.id }, 
    { $addToSet: { friends: req.params.friendId } }, 
    { new: true, runValidators: true }
  )
    .then(userDb => {
      if (!userDb) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json({ userDb, message: "Friend was added"});
    })
    .catch(error => res.json(error));
})

//remove friend
router.delete('/:id/friends/:friendId', (req,res) =>{
  User.findOneAndUpdate({ _id: req.params.id }, 
    { $pull: { friends: req.params.friendId } }, 
    { runValidators: true }
  )
  .then(userDb => {
      if (!userDb) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
      }
      res.json({userDb, message:"friend was deleted from friend's list"});
  })
  .catch(error => res.json(error));
})

module.exports = router;