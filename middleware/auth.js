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