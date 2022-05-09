var express = require('express');
var router = express.Router();

var Thought = require('../../models/Thought');
var User = require('../../models/User');

//get all thoughts
router.get('/', (req, res) => {
    Thought.find({})
      .then(thoughtDb => res.json(thoughtDb))
      .catch(error => {
        res.status(500).json(error);
      });
});

//get thought by id
router.get('/:thoughtId', (req,res) => {
    Thought.findOne({ _id: req.params.thoughtId })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(error => {
                console.log(error);
                res.status(500).json(error);
            });
})

//add thought
router.post('/:userId', (req,res) => {
    console.log(req.body);
    User.findOne({ _id: req.params.userId })
    .then(userDb => {
      if(!userDb){
        res.status(404).json({message: 'No user found with this id. Can not add thought'});
        return;
      }
      req.body.username = userDb.username; 
      Thought.create(req.body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(thoughtDb => {
                if (!thoughtDb) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(thoughtDb);
            })
            .catch(error => {
                console.log(error);
                res.status(500).json(error);
            });
    })
    .catch(error => {
      res.status(500).json(error);
    });  
});   

//update thought
router.put('/:thoughtId', (req,res) => {
    Thought.findOneAndUpdate(
            { _id: req.params.thoughtId }, 
            req.body, 
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(error => res.status(500).json(error));
})

//delete thought
router.delete('/:userId/:thoughtId', (req,res) => { 
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then(deletedThought => {
            if (!deletedThought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
            return User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
})

//add reaction
router.post('/:thoughtId/reactions', (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true, runValidators: true }
    )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            }
            res.json(dbThoughtData);
        })
        .catch(error => res.json(error));
})

//delete reaction
router.delete('/:thoughtId/reactions/:reactionId', (req, res) => {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then(dbUserData => res.json({dbUserData, message: "reaction deleted"}))
            .catch(error => res.json(error));
})

module.exports = router;