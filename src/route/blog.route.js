const express = require('express');
const Blog = require('../model/blog.model');
const Comment = require('../model/comment.model'); // Import Comment model
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// create a post blogs

router.post('/create-post', verifyToken, isAdmin, async (req, res) => {

    try {
        // console.log("Blog data from api : ", req.body);



        const newPost = new Blog({ ...req.body, author: req.userId }); //todo use author: req.userId, when you have tokenVerified

        await newPost.save();

        res.status(201).send({
            message: "Post created successfully",
            post: newPost
        })

    }
    catch (error) {
        console.error("Error while creatind post", error);
        res.status(500).send({ message: 'Error While creatind post' });
    }
})

// get all blogs
router.get('/', async (req, res) => {
    try {

        const { search, category, location } = req.query;
        // console.log(search);

        let query = {}

        if (search) {

            query = {
                ...query,
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { content: { $regex: search, $options: "i" } }
                ]
            }

        }

        if (category) {

            query = {
                ...query,
                category

            }
        }

        if (location) {

            query = {
                ...query,
                location

            }
        }

        const posts = await Blog.find(query).populate('author', 'email').sort({ createdAt: -1 });
        res.status(200).send(posts);
    } catch (error) {
        console.error("Error while getting all post", error);
        res.status(500).send({ message: 'Error While getting post' });

    }
})

// Get a single post (protected route)
router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        // console.log(postId)

        const post = await Blog.findById(postId).populate('author', 'email username');
        // console.log(post)

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const comments = await Comment.find({ postId: postId }).populate('user', 'username email');

        res.status(200).send({ post, comments });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send({ message: 'Failed to fetch post' });
    } 
});




// update blog data

router.patch("/updated-post/:id", verifyToken,isAdmin, async (req, res) => {
    try {

        const PostId = req.params.id;
        const updatedPost = await Blog.findByIdAndUpdate(PostId,
            {
                ...req.body
            }, { new: true }
        );
        if (!updatedPost) {
            return res.status(404).send(
                { message: "Post not found" })

        }
        res.status(200).send(
            {
                message: "Post updated as Successfully",
                post: updatedPost
            }
        )



    } catch (error) {
        console.error("Error Updated post", error);
        res.status(500).send({ message: 'Error UPdated post' });

    }
})

//delete blog data

router.delete("/:id",verifyToken, isAdmin,  async (req, res) => {
    try {
        const postId = req.params.id; // Correct route parameter
        const post = await Blog.findByIdAndDelete(postId); // Use descriptive variable name

        if (!post) {
            return res.status(404).send({
                message: "Post not found"
            });
        }

        // delete realted blogs
        await Comment.deleteMany({ PostId: postId })

        res.status(200).send({
            message: "Post deleted successfully",
            post: post
        });
    } catch (error) {
        console.error("Error while deleting post", error); // Correct error log message
        res.status(500).send({ message: 'Error while deleting post' }); // Correct error message
    }
});

//Related blog data
router.get("/related/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).send({ message: "Post not found" })
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).send(
                {
                    message: "Post not found"
                }
            )
        }
        const titleRegex = new RegExp(blog.title.split(' ').join('|'), 'i');

        const relatedQuery = {
            _id: { $ne: id }, //not exclude
            title: { $regex: titleRegex }
        }

        const relatedPost = await Blog.find(relatedQuery)
        res.status(200).send(relatedPost)



    }

    catch (error) {
        console.error("Error while Fetching related  post", error); // Correct error log message
        res.status(500).send({ message: 'Error while Fetching related  post' }); // Correct error message
    }



})
module.exports = router;