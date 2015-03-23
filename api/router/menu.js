var express = require('express');
var router  = express.Router();

function getEntries(req, res){

    res.json(
            {title: "Accueil", hasChild: false, link: "/#home", icon: "fa-home fa-fw"},
            {title: "Cours",   hasChild: true, icon: "fa-graduation-cap",
                childs: [{title: "cours 1", title: "cours 2", title: "cours 3", title: "cours 4", title: "cours 5"}]},
            {title: "Resources",  hasChild: false, link: "/#resources",  icon: "fa-cubes"},
            {title: "Références", hasChild: false, link: "/#references", icon: "fa-book"});
}

router.get("/entries", getEntries);

module.exports.router = router;
