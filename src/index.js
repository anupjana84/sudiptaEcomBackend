import dotenv from 'dotenv'
import {app} from './app.js'
import {dbconnect} from './db/database.js'



dotenv.config(
    {path: "/.env"}  
)



dbconnect()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`app liten ${process.env.PORT} port`)   
       })
})
.catch((err)=>{console.log(err)})

