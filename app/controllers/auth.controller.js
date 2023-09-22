const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    spiritualName: req.body.spiritualName,
    dateOfBirth: req.body.dateOfBirth,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    country: req.body.country,
    zone: req.body.zone,
    location: req.body.location,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v").exec()
    .then((user) => {
      console.log("🚀 ~ file: auth.controller.js:78 ~ .then ~ user:", user)
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      // Handle the result

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        spiritualName: user.spiritualName,
        dateOfBirth: user.dateOfBirth,
        email: user.email,
        country: user.country,
        zone: user.zone,
        location: user.location,
        id: user._id,
        username: user.username,
        roles: authorities,
        accessToken: token,
      });
    })
    .catch((err) => {
      console.log("🚀 ~ file: auth.controller.js:115 ~ err:", err)
      // Handle the error
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    })
};
