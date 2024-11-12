import jwt from 'jsonwebtoken'

export const authenticate = async (req,res,next)=>{
    const testToken = req.headers.authorization;    
    
    //Check if token exists
    let token;
    if (!testToken) return res.status(401).json({"error": "Unauthorized", "message": "Authentication is required to access this resource."});;

    if(testToken){
        token = testToken.split(' ')[1];
        jwt.verify(token, process.env.JWT_KEY, (err) => {
            if(err){
                res.status(403).json({error: "Access Token is not valid to access this resourse"});
            }else{  
                next();
            }
        });
    }else{
        res.status(400).json({error: "User is not logged in"});
    }
}

export const adminAllowed = async (req,res,next)=>{
    const testToken = req.headers.authorization;    
    
    //Check if token exists
    let token;
    if (!testToken) return res.status(401).json({"error": "Unauthorized", "message": "Authentication is required to access this resource."});;
    if(testToken){
        token = testToken.split(' ')[1];
        if(jwt.decode(token).userRole !='admin'){
            res.status(405).json({error: "Role is not valid to access this resourse"});
        }else{  
            next();
        }
    }else{
        res.status(400).json({error: "User is not logged in"});
    }
}
