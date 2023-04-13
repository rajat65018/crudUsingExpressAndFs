let express=require('express');
let app=express();
app.use(express.json());
app.get('/signup',(req,res)=>{
    let data=req.body;
    console.log(data);
})
app.listen(8000,()=>{
    console.log('running');
})