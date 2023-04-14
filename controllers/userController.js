const env = require("dotenv");
env.config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const queries = require("../queries/userQuery");
const ImageKit = require("imagekit");

// exports.signup = async (req, res) => {
//   try {
//     const salt = bcrypt.genSaltSync(6);

//     const { name, email, phone_number, user_name, profile_picture, password } =
//       req.body;

//     if (!name || !email || !phone_number || !user_name || !profile_picture) {
//       throw "plz filled all detail";
//     }

//     const hashPassword = bcrypt.hashSync(password, salt);
//     console.log(hashPassword);

//     pool.query(queries.checkEmailExists, [email], (error, results) => {
//       if (results.rows.length) {
//         console.log(results);
//         res.send("Email already exists.");
//       } else {
//         //add student to db
//         pool.query(
//           queries.addUser,
//           [name, email, phone_number, user_name, profile_picture, hashPassword],
//           (error, results) => {
//             if (error) throw error;
//             res.status(201).send("User added successfully.");
//           }
//         );
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err);
//   }
// };

exports.signup = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(6);

    // const { name, email, phone_number, user_name, password } = req.body;

    const name = req.body.name
    const email = req.body.email
    const phone_number = req.body.phone_number
    const user_name = req.body.user_name
    const password = req.body.password
    const file = req.file;

    console.log(req.file)
    console.log(req.body)

    if (!name || !email || !phone_number || !user_name) {
      throw "Please fill in all details";
    }

    const hashPassword = bcrypt.hashSync(password, salt);
    console.log(hashPassword);

    pool.query(queries.checkEmailExists, [email], (error, results) => {
      if (results.rows.length) {
        console.log(results)
        res.send("Email already exists.");
      } else {
        // Upload profile picture to ImageKit
        var imagekit = new ImageKit({
            publicKey : "public_GqNgaY7Ru72G0CwKvHn1Abqvm4A=",
            privateKey : "private_wNOgJxR182vmRr8APNy+W5h2nFE=",
            urlEndpoint : "https://ik.imagekit.io/bbcgxob35"
        });

        var newFile = Buffer.from(file.buffer).toString('base64')
        imagekit.upload({
          file: newFile,
          fileName: file.originalname
        }, (err, result) => {
          if (err) throw err;

          // Add user to db with profile picture link
          const profilePictureLink = result.url;
          pool.query(
            queries.addUser,
            [name, email, phone_number, user_name, profilePictureLink, hashPassword],
            (error, results) => {
              if (error) throw error;
              res.status(201).send("User added successfully.");
            }
          );
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(422).send({ error: "plz filled all detail" });
    }

    var salt = bcrypt.genSaltSync(6);
    const hash = bcrypt.hashSync(password, salt);
    console.log(hash);
    var user;
    var userPassword;

    pool.query(queries.checkEmailExists, [email], (error, results) => {
      if (results.rows.length) {
        console.log(results);
        user = results.rows.length;
        console.log("1", user);
        var user_id = results.rows[0].id;
        userPassword = results.rows[0].password;
        console.log("2", user_id);
        //   res.send("Email already exists.");
        pool.query(queries.updateLogin,[email], (error, results) => {
        })

        const match = bcrypt.compare(password, userPassword);
        if (match === false) {
          return res.json({ message: "Invalid password" });
        } else {
          console.log("Logged In");

          console.log(process.env.JWT_SECRET_KEY);
          const token = jwt.sign(
            { email, user_id },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: process.env.EXPIRE_TILL,
            }
          );
          res
            .status(200)
            .send({ user: `${email} logged in successfully`, token });
        }
      }
      if (!results.rows.length)
        res.status(403).json({ error: "user not found" });
    });
  } catch (err) {
    console.log(err);
  }
};
exports.valid = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    let token = auth;
    if (auth.includes("Bearer")) {
      token = token.split(" ")[1];
      console.log(token);
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
    res.status(403).send("invalid token" + err);
  }
};

exports.logout = async (req, res) => {
    try {
      // Remove the JWT token from the client-side cookie
      res.clearCookie("token");
  
      // Send a success response
      res.status(200).send("Logged out successfully");
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  };
  
