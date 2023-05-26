const {Router}=require('express');
const { userAuth } = require('../middleware/auth-middleware');
const { suggestionAutocomplete, nearbyLocalities } = require('../controllers/Googleapiscontrolller');
const router = Router();

//router.use(userAuth);

router.get('/autocomplete',suggestionAutocomplete);
router.get('/nearbyLocalities',nearbyLocalities);

module.exports=router;

