import express from "express"
import mysql from "mysql2/promise"
import { configDB } from "./configDB.js"
import cors from "cors"

const PORT=8000

let connection

try {
    connection=await mysql.createConnection(configDB)
} catch (error) {
    console.log(error);
}

const app=express()
app.use(express.json())
app.use(cors())

app.get("/todos",async (req,resp)=>{
    try {
        const sql="SELECT * FROM todos order by timestamp desc"
        const [rows,fields]=await connection.execute(sql)

        console.log(rows,fields);
        resp.send(rows)
        
    } catch (error) {
        console.log(error);
    }
})

app.post("/todos",async (req,resp)=>{

    const {task}=req.body
    if(!task) return resp.status(400).json({msg:"Hiányos adatok!"})

    try{
        const sql="INSERT INTO todos (task) VALUES (?)"
        const values=[task]
        const [rows,fields]=await connection.execute(sql,values)
        resp.status(200).json({msg:"Sikeres hozzáadás!"})
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg:"server error! \n\nfor more info, look console!"})
    }
})

app.delete("/todos/:id",async (req,resp)=>{

    const {id}=req.params

    try{
        const sql="DELETE FROM todos WHERE id=?"
        const values=[id]
        const [rows,fields]=await connection.execute(sql,values)
        resp.status(200).json({msg:"Sikeres hozzáadás!"})
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg:"server error! \n\nfor more info, look console!"})
    }
})

app.patch("/todos/completed/:id",async (req,resp)=>{

    const {id}=req.params

    try{
        const sql="UPDATE todos SET completed=NOT completed WHERE id=?"
        const values=[id]
        const [rows,fields]=await connection.execute(sql,values)
        resp.status(200).json({msg:"Sikeres módosítás!"})
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg:"server error! \n\nfor more info, look console!"})
    }
})

app.patch("/todos/task/:id",async (req,resp)=>{

    const {id}=req.params
    const {task}=req.body

    try{
        const sql="UPDATE todos SET task=? WHERE id=?"
        const values=[task,id]
        const [rows,fields]=await connection.execute(sql,values)
        resp.status(200).json({msg:"Sikeres módosítás!"})
        
    } catch (error) {
        console.log(error);
        resp.status(500).json({msg:"server error! \n\nfor more info, look console!"})
    }
})

app.listen(PORT,()=>console.log("server listening on port: "+PORT+"..."))