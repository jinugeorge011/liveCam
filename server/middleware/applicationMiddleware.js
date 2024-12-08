const applicationMiddleware = (req,res,next)=>{
  console.log('Application middleware');
  next();
}
module.exports = applicationMiddleware;
  