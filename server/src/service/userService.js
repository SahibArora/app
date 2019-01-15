const User = require('../models/user.js');
const Page = require('../models/page.js');

export function getUserProfile(req, res) {
  User.findOne({ name: req.params.userName }, (err, user) => {
    if (err || !user) {
      res.send(err);
    } else {
      res.send({
        name: user.name,
        type: user.type,
        image: user.image,
        blurb: user.blurb,
        isOwner: !!(req.user && req.user.name && req.user.name === user.name)
      });
    }
  });
}

export function getUserDetailsById(req, res) {
  return getUserById(req.params.userObjectId, res);
}

export function getUserDetailsForPage(req, res) {
  return Page.findOne({ id: req.params.pageId }, (err, page) => {
    if (err || !page) {
      return res.status(500).send(err);
    } else {
      return getUserById(page.user, res);
    }
  });
};

export function getUserDetailsForParentPage(req, res) {
  return Page.findOne({ id: req.params.pageId }, (err, page) => {
    if (err || !page) {
      return res.status(500).send(err);
    }
    Page.findOne({id: page.parentId }, (parentPageRetrieveError, parentPage) => {
      if (parentPageRetrieveError || !parentPage) {
        return res.status(500).send(parentPageRetrieveError);
      }
      return getUserById(parentPage.user, res);
    });
  });
};

function getUserById(userId, res){
  return User.findById(userId, (err, user) => {
    if (err || !user) {
      return res.status(500).send(err);
    }
    return res.status(200).send({
      name: user.name,
      type: user.type
    });
  });
}
