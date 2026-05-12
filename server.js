import mongoose from 'mongoose';
import express from 'express';

const app=express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb+srv://11410120201112_db_user:5vjmmFOFTJUP1pNV@cluster0.jqhtx7h.mongodb.net/?appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Replica Set'))
  .catch(err => console.error('Connection Error:', err));

const Post = mongoose.model('Post', { title: String, content: String });

app.get('/', (req, res) => res.send('Welcome to my distributed backend system'));
app.get('/health', (req, res) => res.status(200).send('Healthy'));

app.get('/posts', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

app.post('/posts', async (req, res) => {
    const post = new Post(req.body);
    await post.save();
    res.status(201).send(post);
});

app.put('/posts/:id', async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).send('Post not found');
    res.send(post);
});

app.delete('/posts/:id', async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    res.send({ message: 'Post deleted successfully' });
});
app.get('/posts/:id', async (req, res) => {
    const post=await Post.findById(req.params.id);
    if (!post) return res.status(404).send('Post not found');
    res.send(post);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));