'use strict'

var express = require('express');

var router =express.Router();

var Project = require('../models/projects');
var Post = require('../models/blog')

var project_controller = require('../controllers/projects');

var multiparty = require('connect-multiparty');

var projects_images = multiparty({uploadDir: './files/projects-images'});
var posts_images = multiparty({uploadDir: './files/posts_images'});

const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');

router.post('/new-project', project_controller.createNewProject);
router.get('/get-projects/:last?', project_controller.getProjects);
router.get('/get-project/:id', project_controller.getProject);
router.delete('/delete-project/:id', project_controller.deleteProject);
router.put('/update-project/:id', project_controller.updateProject);
router.get('/search/:search', project_controller.searchProject);
router.get('/get-user', project_controller.getUsers)
router.get('/user/:id', project_controller.getUser);
router.post('/signin', project_controller.singIng);
router.post('/signup', project_controller.singUp);
router.post('/new-comment', project_controller.newComment);
router.get('/comments/:last?', project_controller.getComments);
router.post('/new-post', project_controller.createnewPost);
router.get('/get-posts/:last?', project_controller.getPosts);
router.get('/get-post/:id', project_controller.getPost);
router.delete('/delete-post/:id', project_controller.deletePost);


//Subiendo imagenes
router.post('/upload-image/:id?', upload.single('image'), async (req, res) => {

    var projectId = req.params.id;

    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        //Save user
        if (projectId) {
            Project.findOneAndUpdate({ _id: projectId }, { image: result.secure_url, cloudinary_id: result.public_id }, { new: true }, (err, projectUpdated) => {
                if (err || !projectUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error while saved the file image'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    project: projectUpdated
                });
            });
    
        } else {
            return res.status(200).send({
                status: 'success',
                image: file_name
            })
        }

     } catch (error) {
         console.log(error);
     }
    


});

router.post('/upload-image-post/:id?', upload.single('image'), async (req, res) => {
    var postId = req.params.id;

    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        //Save user
        if (postId) {
            Post.findOneAndUpdate({ _id: postId }, { image: result.secure_url, cloudinary_id: result.public_id }, { new: true }, (err, postUpdated) => {
                if (err || !postUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error while saved the file image'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    post: postUpdated
                });
            });
    
        } else {
            return res.status(200).send({
                status: 'success',
                image: file_name
            })
        }

     } catch (error) {
         console.log(error);
     }
    


});






module.exports = router;
