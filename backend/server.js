import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import User from './models/Users.js';
import Post from './models/Post.js';

const app=express()
app.use(express.json());
app.use(cors())
dotenv.config({path: './config.env'})
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const jwtSecret = process.env.JWT_SECRET;

const MongoConnect = async ()=> {
    try {
        mongoose.connect(process.env.MONGOURI)
        console.log("MongoDB Connected")
    } catch (error) {
        console.log(error)
    }
}

MongoConnect();

app.post('/register',async (req,res) => {
    
    try {
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10)
        
        const newUser= new User({
            username,
            password: hashedPassword,
        })

        await newUser.save();
        res.send('Sign Up Sucessful!')
    } catch (error) {
        res.status(500).send('Something went wrong!')
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    const user = await User.findOne({ username });
    if (!user) { 
      return res.status(400).send('User not found');
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }
  
    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '30d' });
    res.json({ token });
  });

app.get('/protected', async (req,res) => {
    const authHeader = req.header('Authorization');
    const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, jwtSecret);
    req.user = verified;
    const currentUser= await User.findById(req.user.id)
    res.json(currentUser)
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(400).send('Invalid token');
  }
})

app.post('/post', async (req,res) => {
    try {
        const {id, body} = req.body;
        const newPost = new Post({
            body,
            author:id
        })
        await newPost.save();
        res.send('Post Uploaded');
    } catch (error) {
        res.status(500).send('Post Upload Failed');
    }
})

app.post('/comment/:id', async (req,res) => {
    try {
        const {id}=req.params;
        const {text, author} = req.body;
        console.log(text,author);
        await Post.findByIdAndUpdate(
           id,
        {$push: { comments: { text, author } }},
        {new: true} 
        )
        res.send('Comment Added Sucessful!')
    } catch (error) {
        console.log(error)
        res.status(500).send('Comment Add Failed!')
    }
})

app.post('/like/:id', async (req,res) => {
    try {
        const {id}=req.params;
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $inc: { likes: 1 } }, 
            { new: true }            
          );
          if (!updatedPost) {
            return res.status(404).send('Post not found');
          }
          res.json({ message: 'Like added successfully', likes: updatedPost.likes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to add like');
    }
})

app.get('/blog', async (req,res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username image')
            .populate('comments.author', 'username image')
            .sort({ createdAt: -1 });
    
            const postsWithImages = posts.map(post => ({
                ...post.toObject(),
                authorImage: post.author.image ? `data:${post.author.image.contentType};base64,${post.author.image.data.toString('base64')}` : null
            }));
            res.json(postsWithImages);
    } catch (error) {
        console.log(error)
        res.status(500).send('Failed to fetch Posts');
    }
})

app.get('/mypost/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const posts = await Post.find({author:id})
        res.json(posts);
    } catch (error) {
        res.status(500).send('Failed to fetch Posts');
    }
})

app.delete('/delete/:id', async (req,res) => {
    try {
        const {id} = req.params;
        await Post.findByIdAndDelete(id);
        res.send('Deleted Sucessfully!')
    } catch (error) {
        res.status(500).send('Could not Delete! Error!')
    }
})

app.get('/profile/:id', async (req,res) => {
    try {
        const {id}=req.params;
        const profile=await User.findById(id)
        res.json(profile)
    } catch (error) {
        res.status(500).send('Could get the profile info!')
    }
})

app.post('/image/:id', upload.single('file'), async (req,res) => {
    try {
        const {id} = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).send('No file uploaded');
          }

        if (file) {
            const image ={
                filename: file.originalname,
                data: file.buffer,
                contentType: file.mimetype,
            }
    
            await User.findByIdAndUpdate(
                id,
                {image},
                {new: true}
            )
            res.json({msg: 'file uploaded'}) 
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Error uploading image');
    }
})

app.put('/updateuser/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const {username, password, newpassword} = req.body;
        const user= await User.findById(id);
        if (user) {
            const isMatch=await bcrypt.compare(password,user.password)
            if (isMatch) {
                const updatedUser = {
                    username: username ? username : user.username,
                    password: newpassword ? await bcrypt.hash(newpassword,10) : user.password,
                    image: user.image,
                }
                try {
                    await User.findByIdAndUpdate(id, updatedUser, {new: true})
                } catch (error) {
                    res.send('Cannot Update user')
                    console.log(error)
                }
            }
            else{
                res.send('Wrong Password')
            }
        }
        else res.send('User not Found')
    } catch (error) {
        res.status(500).send('Save Failed!s')
        console.log(error);
    }
})

app.listen(5001, () => console.log('Server running on port 5001'));

