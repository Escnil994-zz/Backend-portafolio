'use strict'

var validator = require('validator');
var Project = require('../models/projects');
var User = require('../models/users');
var Comment = require('../models/comment');
var Posts = require('../models/blog');
var Info = require('../models/info');


//Send Email
const _private = require('../private/private.json')
const nodemailer = require('nodemailer');
const myEmail = _private.my_email;
const fb = _private.fb;
const whats = _private.whats;
const myName = _private.my_name;
const client_id = _private.client_id;
const private_key = _private.private_key;


const cloudinary = require('../utils/cloudinary');


var fs = require('fs');
var path = require('path');
const {exists, update} = require('../models/projects');
const {user_exists, user_update} = require('../models/users');
const {restart} = require('nodemon');
const {request, response} = require('express');

var controller = {
    createNewProject: function (request, response) {

        //get post's params
        var params = request.body;

        //data validate
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_description = !validator.isEmpty(params.description);
            var validate_video = !validator.isEmpty(params.video);
            var validate_type = !validator.isEmpty(params.type);
            var validate_url = !validator.isEmpty(params.url);
            var validate_comments = params.comments;
        } catch (error) {
            return response.status(200).send({
                status: 'Error',
                message: 'Missing Data To Send!!!'
            });
        }
        if (validate_title && validate_description && validate_video && validate_type && validate_url) {

            var project = new Project();

            project.title = params.title;
            project.description = params.description;
            project.video = params.video;
            project.type = params.type;
            project.url = params.url;
            project.comments = params.comments;
            if (params.image) {
                project.image = params.image;
            } else if (project.image == null) {
                project.image = params.image;
            } else {
                project.image = params.image;
            }


            project.save((err, projectSaved) => {

                if (err || !projectSaved) {
                    return response.status(404).send({
                        status: 'Error',
                        message: 'Project has not been saved!!!'
                    })
                }

                ///Devolviendo el Json con los datos

                return response.status(200).send({
                    status: 'success',
                    project: projectSaved
                })

            });

        }

    },
    getUser: (request, response) => {
        var userId = request.params.id;

        if (!userId || userId === null) {
            return response.status(404).send({
                status: "Error",
                message: "User doesn't exist"
            })
        }

        //Look
        User.findById(userId, (err, user) => {
            if (err || !user) {
                return response.status(404).send({
                    status: "Error",
                    message: "The user doesn't exist"
                })
            }

            return response.status(200).send({
                status: "success",
                user
            })
        })
    },
    getUsers: function (request, response) {
        var query = User.find({});
        query.exec((err, users) => {

            if (!err) {
                return response.status(200).send({
                    status: 'success',
                    users
                })

            } else {
                return response.status(404).send({
                    status: "Error",
                    message: "Couldn't show projects"
                });
            }


        });


    },
    getProjects: function (request, response) {
        var query = Project.find({}).sort('-date');

        var last = request.params.last;
        if (last || last != undefined) {
            query.limit(2);
        }
        query.exec((err, projects) => {

            if (!err) {
                return response.status(200).send({
                    status: 'success',
                    projects
                })

            } else {
                return response.status(404).send({
                    status: "Error",
                    message: "Couldn't show projects"
                });
            }


        });


    },

    getProject: (request, response) => {
        var projectId = request.params.id;

        if (!projectId || projectId == null) {
            return response.status(404).send({
                status: "Error!!!",
                message: "The id empty is not valid!"
            });
        }

        //Buscar projectos
        Project.findById(projectId, (err, project) => {
            if (err || !project) {
                return response.status(500).send({
                    status: "Error!!!",
                    message: "The article whit id: '" + projectId + "', doesn't exist in database"
                });
            } else {
                return response.status(200).send({
                    status: "success",
                    project
                })
            }
        }).sort('-date');
    },
    deleteProject: function (request, response) {
        var projectId = request.params.id;
        Project.findByIdAndDelete({_id: projectId}, function (err, projectDeleted) {
            if (err) {
                return response.status(500).send({
                    status: "Error!!!",
                    message: "Couldn't delete"
                });
            }
            if (!projectDeleted) {
                return response.status(404).send({
                    status: "Error",
                    message: "The project with id : '" + projectId + "', doesn't exist"
                })
            }

            cloudinary.uploader.destroy(projectDeleted.cloudinary_id);

            return response.status(200).send({
                status: "success",
                message: "Project: '" + projectId + "', has been removed",
                see: "bellow you can see it...",
                project: projectDeleted

            })
        })
    },

    updateProject: (request, response) => {
        var projectId = request.params.id;

        var params = request.body;

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_description = !validator.isEmpty(params.description);
            var validate_video = !validator.isEmpty(params.video);
            var validate_type = !validator.isEmpty(params.type);
            var validate_url = !validator.isEmpty(params.url);
            var validate_comments = params.comments;
        } catch (error) {
            return response.status(200).send({
                status: 'Error',
                message: 'Missing Data To Send!!!'
            });
        }
        if (validate_title && validate_description && validate_video && validate_type && validate_url) {

            //Find and update
            Project.findByIdAndUpdate({_id: projectId}, params, {new: true}, function (err, projectUpdated) {

                if (err) {
                    return response.status(200).send({
                        status: "Error!!!",
                        message: "Couldn't update the project with id: '" + projectId + "' !!!"
                    })
                }
                if (!projectUpdated) {
                    return response.status(404).send({
                        status: 'Error',
                        message: 'Project has not been updated!!!'
                    })
                }

                ///Devolviendo el Json con los datos

                return response.status(200).send({
                    status: 'success',
                    project: projectUpdated
                })

            });
        }
    },
    searchProject: (request, response) => {
        var search = request.params.search;

        Project.find({
            "$or": [
                {"title": {"$regex": search, "$options": "i"}},
                {"content": {"$regex": search, "$options": "i"}}
            ]
        }).sort([['date', 'descending']]).exec((err, projects) => {
            if (err) {
                return response.status(500).send({
                    status: "Error!!!",
                    message: "Couldn't make the search"
                })
            }
            if (!projects || projects.length <= 0) {
                return response.status(404).send({
                    status: "Error!!!",
                    message: "There are not projects that match your search "
                })
            }
            return response.status(200).send({
                status: "success",
                projects
            })
        });
    },
    newComment: function (request, response) {
        var params = request.body;

        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_email = !validator.isEmpty(params.email);
            var validate_comment = !validator.isEmpty(params.comment);
        } catch (error) {
            return response.status(200).send({
                status: 'Error',
                message: 'Misssing data to send!!!'
            })
        }
        if (validate_name && validate_email && validate_comment) {
            var comment = new Comment();

            comment.name = params.name;
            comment.email = params.email;
            comment.comment = params.comment;

            comment.save(function (err, commentSave) {
                if (err || !commentSave) {
                    return response.status(404).send({
                        status: 'Error',
                        message: 'Commetn has not been save'
                    });
                }


                var contentHTML = `
                <div style="width: auto; color: black; margin: 20px; text-align: center; font-family: Arial, Helvetica, sans-serif; font-weight: bold; background-color: rgb(196, 244, 250);">
                    <h1>${comment.name}</h1>
                    <h4>Gracias por tu comentario</h4>
            
                    <span style="color:green;">"${comment.comment}"</span>
            
            
                    <br>
                    <br>
                    <span>Si tienes dudas, sugerencias, o necesitas contactarme, aqui te dejo algunos
                        medios.</span>
            
                    <br><br>
                    <a href="${whats}" style="color: green;"><strong>Whatsapp</strong></a>
                    <br><br>
                    <a href="${fb}" style="color: blue;"><strong>facebook</strong></a>
            
                    <p> puedes encontrar mas en mi web en la pestaña
                        <strong>
                            <a href="https://escnil994.com/contacts">contactame</a>
                        </strong></p>
            
                    <span> Tambien puedes responder directamente a este correo</span>
            
                    <br>
                    <br><br>
            
                    <span style="color:#002a4a; font-size: 25px;"> Att. ${myName}</span>
                </div>
                `;
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        type: 'OAuth2',
                        user: myEmail,
                        serviceClient: client_id,
                        privateKey: private_key
                    },
                });
                try {
                    transporter.verify();
                    transporter.sendMail({
                        from: myEmail,
                        to: comment.email,
                        subject: 'Gracias por tu commentario!!!',
                        html: contentHTML
                    });
                } catch (err) {
                    console.log(err);
                }

                return response.status(200).send({
                    status: 'success',
                    comment: commentSave
                });
            });
        }
    },
    getComments: function (request, response) {


        var query = Comment.find({}).sort('-date')
        var last = request.params.last;

        if (last || last != undefined) {
            query.limit(4);
        }
        query.exec((err, comments) => {
            if (!err) {
                return response.status(200).send({
                    status: 'success',
                    comments
                });
            } else {
                return response.status(404).send({
                    status: 'Error',
                    message: 'could not show comments',
                })
            }
        })
    },
    deleteComent: (request, response) => {
        var commentId = request.params.id;
        Comment.findByIdAndDelete({_id: commentId}, function (err, CommentDeleted) {
            if (err) {
                return response.status(500).send({
                    status: "Error!!!",
                    message: "Couldn't delete"
                });
            }
            if (!CommentDeleted) {
                return response.status(404).send({
                    status: "Error",
                    message: "The project with id : '" + commentId + "', doesn't exist"
                })
            }
            return response.status(200).send({
                status: "success",
                message: "Project: '" + commentId + "', has been removed",
                see: "bellow you can see it...",
                comment: CommentDeleted

            })
        })

    },
    createnewPost: function (request, response) {
        //get post's params
        var params = request.body;

        //data validate
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_intro = !validator.isEmpty(params.intro);
            var validate_author = !validator.isEmpty(params.author);
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return response.status(200).send({
                status: 'Error',
                message: 'Missing Data To Send!!!'
            });
        }
        if (validate_title && validate_intro && validate_content && validate_author) {

            var post = new Posts();

            post.title = params.title;
            post.intro = params.intro;
            post.content = params.content;
            post.more = params.more;
            post.author = params.author;
            if (params.image) {
                post.image = params.image;
            } else {
                post.image = null;
            }
            post.save((err, postSaved) => {

                if (err || !postSaved) {
                    return response.status(404).send({
                        status: 'Error',
                        message: 'Project has not been saved!!!'
                    })
                }

                ///Devolviendo el Json con los datos

                return response.status(200).send({
                    status: 'success',
                    post: postSaved
                })

            });

        }

    },
    getPosts: function (request, response) {
        var query = Posts.find({}).sort('-date');

        var last = request.params.last;
        if (last || last != undefined) {
            query.limit(2);
        }
        query.exec((err, posts) => {

            if (!err) {
                return response.status(200).send({
                    status: 'success',
                    posts
                })

            } else {
                return response.status(404).send({
                    status: "Error",
                    message: "Couldn't show projects"
                });
            }


        });


    },
    getPost: (request, response) => {
        var postId = request.params.id;

        if (!postId || postId == null) {
            return response.status(404).send({
                status: "Error!!!",
                message: "The id empty is not valid!"
            });
        }

        //Buscar projectos
        Posts.findById(postId, (err, post) => {
            if (err || !post) {
                return response.status(500).send({
                    status: "Error!!!",
                    message: "The article whit id: '" + postId + "', doesn't exist in database"
                });
            } else {
                return response.status(200).send({
                    status: "success",
                    post
                })
            }
        });
    },
    deletePost: function (request, response) {
        var postId = request.params.id;
        Posts.findByIdAndDelete({_id: postId}, function (err, postDeleted) {
            if (err) {
                return response.status(500).send({
                    status: "Error!!!",
                    message: "Couldn't delete"
                });
            }
            if (!postDeleted) {
                return response.status(404).send({
                    status: "Error",
                    message: "The post with id : '" + postId + "', doesn't exist"
                })
            }

            cloudinary.uploader.destroy(postDeleted.cloudinary_id);

            return response.status(200).send({
                status: "success",
                message: "Post: '" + postId + "', has been removed",
                see: "bellow you can see it...",
                post: postDeleted

            });

        })
    },


    //My info

    getInfo: (request, response) => {

        User.findById(_private._id, (err, user) => {
            if (err || !user) {
                return response.status(404).send({
                    status: "Error",
                    message: "The user doesn't exist"
                })
            }
            return response.status(200).send({
                status: "success",
                user
            });
        });

    }
}


module.exports = controller;


