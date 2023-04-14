const { Router } = require('express');
const Usercontroller = require('../controllers/userController');
const PlatformController = require('../controllers/platformController');
const { platform } = require('process');
const {multerUpload} = require('../middleware/multer')

const router = Router();


router.post('/signup',multerUpload.single("file"), Usercontroller.signup);
router.post('/',multerUpload.single('file'),PlatformController.imageUpload)
router.post('/login',Usercontroller.login)
router.post('/logout', Usercontroller.logout)
router.post('/create-post',Usercontroller.valid,PlatformController.createPost)
router.post('/like',Usercontroller.valid,PlatformController.likePost)
router.get('/',PlatformController.fetchUserDetailByUsername)
router.get('/total-user',PlatformController.fetchTotalNumberOfUsers)
router.get('/last-week-signup', PlatformController.getNumberOfUsersSignedUpLastWeek)
router.get('/not-login', PlatformController.getNumberOfUsersNotLoggedInAfterSignup)
router.get('/active-user',PlatformController.getMostActiveUser)
router.get('/active-user-on',PlatformController.getMostActiveUserOnDate)
router.get('/active-user-at',PlatformController.getMostActiveUserBetweenTimes)
router.get('/most-likes', PlatformController.getUserWhoLikedMostPosts)
router.get('/user-most-like',PlatformController.getUserPostWithMostLikes)
router.get('/most-liked-post', PlatformController.getMostLikedPost)





module.exports = router; 