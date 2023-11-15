const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const Tasks = require('./models/Tasks')
const cors = require('cors');
require('dotenv').config();


app.use(cors());
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(express.static('public'));

app.set('views', './views')

const start = async () => {
    try {
       await mongoose.connect(process.env.MONGODB_URI)
       app.listen(PORT, () => {
        console.log("Listening on port 3000")
       })
    } catch (err) {
        console.log(err)
    }
}

start();

app.get('/', (req, res) => {
    res.status(200).redirect('/tasks')
})

app.get('/tasks', async (req, res) => {
    const result = await Tasks.find().sort({_id: -1 })
    res.render('tasks.ejs',
    { title: "Tasks", createbtn: "Create New Task", pageurl: '/createtask', result })
})

app.get('/createtask', (req, res) => {
    res.render('createtask.ejs',
    { title: "Create Task", createbtn: "Task Page", pageurl: '/tasks' })
})

app.post('/createtask', (req, res) => {

    console.log(req.body)
    const task = new Tasks({
        title: req.body.title,
        body: req.body.body
    });
    try {
        task.save();
        res.status(201).redirect('/tasks');
    } catch (err) {
        console.log(err)
    }
    res.redirect('/tasks')
})

app.get('/details/:id', async (req, res) => {
    const taskId = req.params.id

    try {
        const task = await Tasks.findById(taskId)
        if (task) {
            res.render('details.ejs', {
            title: "Task Details", createbtn: "Task Page", pageurl: '/tasks', task })
        }   else {
            res.render('/404', { title: '404 Error' });
        }
    } catch (err) {
        console.log(err)
    }
})

app.put('/details/:id', async (req, res) => {
    const taskId = req.params.id
    console.log('Received PUT request for task ID:', taskId);
    console.log('Request body:', req.body);

    try {
        const updateTask = await Tasks.findByIdAndUpdate(
            taskId,
            {
                title: req.body.title,
                body: req.body.body
            },
            {
                new: true
            })
        if (updateTask) {
            res.status(200).json({ message: "Post Update Confirmed" })
            console.log('Update Confirmed')
        }   else {
            res.render('/404', { title: '404 Error' })
        }
    } catch (err) {
        console.log(err)
    }
})


app.delete('/details/:id', async (req, res) => {
    const taskId = req.params.id

    try {
        const deleteTask = await Tasks.findByIdAndDelete(taskId)
        if(deleteTask) {
            res.status(200).json({ message: "Post Deletion Confirmed" })
        } else {
            res.render('/404', { title: '404 Error' })
        }
    } catch (err) {
        console.log(err)
    }
})

app.use((req, res) => {
    setTimeout(() => {
        res.status(404).render('404.ejs', { title: '404' })
    }, 1000)
})



