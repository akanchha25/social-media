const checkEmailExists = "SELECT * FROM users  WHERE users.email = $1";

const addUser =
  "INSERT INTO users (name, email, phone_number, user_name, profile_picture,created_at, password) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $6)";

const createPost = "INSERT INTO posts (post, user_id) VALUES ($1, $2)";

const checkPostExists = "SELECT * FROM posts WHERE id = $1";

const checkExistingLikeByUser = "SELECT * FROM likes WHERE post_id = $1 AND liked_by_user = $2";

const likePost = "INSERT INTO likes (post_id, liked_by_user) VALUES ($1, $2)"

const fetchUserDetailsByUsername = "SELECT * FROM users WHERE user_name = $1"

const getTotalNumberOfUsers = "SELECT COUNT(*) as total_users FROM users"

const updateLogin = "UPDATE users SET last_login = NOW() WHERE email = $1"

const numberOfUsersSignUpLastWeek = "SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '7 days'"

const numberOfUsersNotLoggedInAfterSignup = "SELECT COUNT(*) FROM users WHERE last_login IS NULL"

const mostActiveUser = "SELECT user_id, COUNT(*) as count FROM posts GROUP BY user_id ORDER BY count DESC LIMIT 1"

const mostActiveUserOnDate = "SELECT user_id, COUNT(*) as count FROM posts WHERE DATE(created_at) = $1 GROUP BY user_id ORDER BY count DESC LIMIT 1"

const mostActiveUserBetweenTime = "SELECT user_id, COUNT(*) as count FROM posts WHERE created_at BETWEEN $1 AND $2 GROUP BY user_id ORDER BY count DESC LIMIT 1";

const userWhoLikedMostPosts = "SELECT liked_by_user, COUNT(*) AS count FROM likes GROUP BY liked_by_user ORDER BY count DESC LIMIT 1"

const getUserById = "SELECT * FROM users WHERE id = $1"

const userPostWithMostLikes = "SELECT posts.*, users.*, COUNT(*) as count FROM posts JOIN likes ON posts.id = likes.post_id JOIN users ON posts.user_id = users.id GROUP BY posts.id, users.id ORDER BY count DESC LIMIT 1";

const mostLikedPost = "SELECT posts.*, COUNT(*) as like_count FROM posts JOIN likes ON posts.id = likes.post_id GROUP BY posts.id ORDER BY like_count DESC LIMIT 1"

  module.exports = {
    checkEmailExists,
    addUser,
    createPost,
    checkPostExists,
    checkExistingLikeByUser,
    likePost,
    fetchUserDetailsByUsername,
    getTotalNumberOfUsers,
    updateLogin,
    numberOfUsersSignUpLastWeek,
    numberOfUsersNotLoggedInAfterSignup,
    mostActiveUser,
    mostActiveUserOnDate,
    mostActiveUserBetweenTime,
    userWhoLikedMostPosts,
    userPostWithMostLikes,
    mostLikedPost,
    getUserById
  } 