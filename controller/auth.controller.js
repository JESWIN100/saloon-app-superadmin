


const check_login=async(req,res)=>{
  const { username, password } = req.body;

 const myusername="admin"
 const mypassword="password"

 if(myusername===username && mypassword === password){
res.redirect('/home')

 }

}

module.exports={
    check_login
}