const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app=express()
const port=process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

//mysql code

const pool=mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'',
    database:'studentdb'
});



// Get all student
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from student', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
})

// Get student by id
app.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id' + connection.threadId)
        connection.query('SELECT * from student WHERE id= ?',[req.params.id], (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

        })
    })
})

// delete student records
app.delete('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id' + connection.threadId)
        connection.query('DELETE from student WHERE id= ?',[req.params.id], (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(`student with there id:${req.params.id} has been deleted`)
            } else {
                console.log(err)
            }

        })
    })
})

// add new student record
app.post('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id' + connection.threadId)

        const params=req.body

        connection.query('INSERT INTO student SET  ?',params, (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(`student with there id:${params.id} has been added`)
            } else {
                console.log(err)
            }

        })
        console.log(req.body)
    })
})

// update student record
app.put('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id' + connection.threadId)

        const {id,firstname,lastname,marks}=req.body

        connection.query('UPDATE student SET firstname=?,lastname=?,marks=? WHERE id=?',[firstname,lastname,marks,id], (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(`student with there id: ${id} ${firstname} ${lastname}${marks}has been added`)
            } else {
                console.log(err)
            }

        })
        console.log(req.body)
    })
})

app.listen(port,()=>console.log(`running on port no ${port}`))