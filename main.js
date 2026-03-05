import express from 'express'
import 'dotenv/config'
import env from './config/env.js'

// all routing
import testingRouter from './router/testing.router.js'

const app=express()

app.use('/users', testingRouter)

app.listen(env.APP_PORT,()=>{
    console.log(`app running port  ${env.APP_PORT}`)
})
