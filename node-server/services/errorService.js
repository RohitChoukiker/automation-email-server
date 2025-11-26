
const errorService = (err,req,res,next)=>{
  
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
  
    res.status(err.statusCode).json({
      status: err.status,
      message : err.message,
      stack: err.stack,
      error: err,
      timestamp: req.requestTime
    });
  }
export default errorService;