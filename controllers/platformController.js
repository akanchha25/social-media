const env = require("dotenv");
env.config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const queries = require("../queries/userQuery");

exports.createPost = async (req, res) => {
  try {
    const { post_text } = req.body;
    if (!post_text) {
      res.status(400).send("Post is blank.");
    }
    const user = req.user;
    console.log(user);
    if (user) {
      console.log(user.user_id);
      pool.query(
        queries.createPost,
        [post_text, user.user_id],
        (error, results) => {
          if (error) throw error;
          res.status(201).send("Post created successfully.");
        }
      );
    } else {
      res.status(404).send("Please login to create post.");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
} 

  exports.likePost = async (req, res) => {
    try {
      const { post_id } = req.body;
      var user = req.user;

      if (!user) {
        return res.status(401).send("User not authenticated");
      }

      // Check if the post exists
      pool.query(queries.checkPostExists,[post_id],  (error, results) => {
        if (error) throw error;
        if(results.rows.length === 0){
            res.status(201).send("Post not found.");
        }
      })

      await pool.query(queries.checkExistingLikeByUser,[post_id, user.user_id], (error, results) => {
        console.log(post_id, user.user_id)
        console.log(results)
        if(results.rows.length>0){
            console.log("-------->",results)
          res.send("You have already liked this post"); 
        }
    })

      pool.query(queries.likePost,[post_id,user.user_id], (error, result) => {
        if(error) throw error
        res.status(200).send("Post liked successfully");
      })

     

      // Insert the like into the post_likes table
      
    } catch (err) {
      console.error(err);
      res.status(500).send("Error liking post");
    }
  };

  exports.fetchUserDetailByUsername = async(req, res) => {
    try{
        const { user_name }= req.body
        pool.query(queries.fetchUserDetailsByUsername,[user_name], (error, results) => {
            if(results.rows.length === 0){
                res.status(404).send("User not found.")
            }
            res.status(200).send(results.rows)
        })
    } catch(err){
        throw err
    }
  }

  exports.imageUpload = async(req, res) => {
        const file = req.file
        console.log(file)
        res.send("ok")
  }

  exports.fetchTotalNumberOfUsers = async(req, res) => {
    try{
        pool.query(queries.getTotalNumberOfUsers, (error, results) => {
            if(results.rows.length === 0){
                res.status(404).send("User not found.")
            }
            res.status(200).send(results.rows)
        })

    } catch(err){
        throw err
    }
  }

  exports.getNumberOfUsersSignedUpLastWeek = async(req, res) => {
    try{

        pool.query(queries.numberOfUsersSignUpLastWeek, (error, results) => {
            if(results.rows.length === 0){
                res.status(404).send("No user logged in last week.")
            }
            res.status(200).send(results.rows)
            if(error) throw error
        })

    } catch(err){
        throw err
    }
  }

  exports.getNumberOfUsersNotLoggedInAfterSignup = async(req, res) => {
    try{
        pool.query(queries.numberOfUsersNotLoggedInAfterSignup, (error, results) => {
            console.log(results)
            if(results.rows.length === 0){
                res.status(404).send("No user logged in after sign-up.")
            }
            res.status(200).send(results.rows)
            if(error) throw error
        })

    } catch(err){
        throw err
    }
  }


  exports.getMostActiveUser = async(req, res) => {
    try{
        pool.query(queries.mostActiveUser, (error, results) => {
            console.log(results)
            if(results.rows.length === 0){
                res.status(404).send("No active user found.")
            }
            res.status(200).send(results.rows)
            if(error) throw error
        })

    } catch(err){
        throw err
    }
  }

  exports.getMostActiveUserOnDate = async (req,res) => {
    try{
          const date = req.body
          console.log(date.date)
          if(!date){
            res.status(400).send("please enter date.")
          }

          pool.query(queries.mostActiveUserOnDate, [date.date], (error, results) => {
            console.log(results)
            if(results.rows.length === 0){
                res.status(404).send("No active user found.")
            }
            res.status(200).send(results.rows)
            if(error) throw error

          })
    } catch(err){
        throw err
    }
  }

  exports.getMostActiveUserBetweenTimes = async(req, res) => {
    try{

        const { start, end } = req.body
        if(!start || ! end) {
            res.status(400).send("please enter time.")
        }
        console.log(start, end)
        pool.query(queries.mostActiveUserBetweenTime, [start, end], (error, results) => {
            if(results.rows.length === 0){
                res.status(404).send("No active user found.")
            }
            res.status(200).send(results.rows)
            if(error) throw error

        })

    } catch(err){
        throw err
    }
  }
  



exports.getUserWhoLikedMostPosts = async(req, res)=>{
  try{ 
    pool.query(queries.userWhoLikedMostPosts, (error, results) => {
      if(results.rows.length === 0){
        res.status(404).send("No likes found.")
      }
      console.log(results.rows[0].liked_by_user)
      var user = results.rows[0].liked_by_user
      var data
      var likedData = results.rows
      pool.query(queries.getUserById,[user], (error, results) => {
        data = results.rows
        console.log(data)
        res.status(200).json({likedData, data})
      })
      console.log(likedData,data)
      
      if(error) throw error
    })
  }catch (err){
    throw err
  }
}


exports.getUserPostWithMostLikes = async(req, res) => {
  try{
    pool.query(queries.userPostWithMostLikes, (error, results)=>{
      if(results.rows.length === 0){
        res.status(404).send("No user's post found with the most likes.")
      }
      res.status(200).send(results.rows)
      if(error) throw error
    })
  }catch(err){
    throw err
  }
}


exports.getMostLikedPost = async(req, res) => {
  try{
    pool.query(queries.mostLikedPost, (error, results) => {
      if(results.rows.length === 0){
        res.status(404).send("No post found with the most likes")
      }
      res.status(200).send(results.rows)
      if(error) throw error
    })
  }catch(err){
    throw err
  }
}