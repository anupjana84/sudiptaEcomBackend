 const asyncHandeler=(requestHandeler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandeler(req,res,next)).catch(next);
    }

}

 const asyncHandeler2=(fn)=> async(req,res,next)=>{
    try {
        fn(req,res,next).catch(next);
    } catch (error) {
        res.status(error.code|| 500).json({
            message:error.message,
            success:false
        
        })
    }
   

}
export {asyncHandeler}