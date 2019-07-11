var checksum = require('./checksum');
var request = require('request');

module.exports = {
    getRequest: (req, res) => {
         res.render("paytm/index");
    },
    request: (req, res) =>{
     
         var paramlist = req.body;
         var paramarray = new Array();
           console.log(`paramlist:${paramlist.TXN_AMOUNT}`);
         for(name in paramlist) {
             if( name === "PAYTM_MERCHANT_KEY"){
                 var PAYTM_MERCHANT_KEY = paramlist[name];
             }else {
                 paramarray[name] = paramlist[name]
             }
         }
         paramarray["CALLBACK_URL"] = "http://192.168.1.4:3002/api/paytm/response";
         checksum.genchecksum(paramarray, PAYTM_MERCHANT_KEY, (err, result) =>{
             if(err) console.log(err);
             res.render("paytm/request", {result});
         });
        },
       response: (req, res) =>{
          const verified= checksum.verifychecksum(req.body,"qzyWd3oIS3PA@kA@");
          if(verified == true){
            if(req.body.RESPCODE == '402'){
                setTimeout(function(){
                    return checkTXN(req,res);
                    }, 5000);
              } else if(req.body.RESPCODE === '01'){
                res.render("paytm/response",{
                    status: true,
                    result: req.body
                }); 
              }else {
                  res.render("paytm/response",{
                      status:false,
                      result:req.body
                  })
              }
           
          }
       } 
}

function checkTXN(req, res){
    // console.log(resp.orderId);
  var check = {
             "MID":req.body.MID,
             "ORDERID":req.body.ORDERID
  }
  var checkString = JSON.stringify(check);
   
  return checksum.genchecksumbystring(checkString, "qzyWd3oIS3PA@kA@", function (err, result) 
          {
            console.log(req.body);
            if(err){
                console.log(`error:${err}`);
            }else{
                console.log(`Result:${result}`);
                return request({
                   url:'https://securegw.paytm.in/merchant-status/getTxnStatus',
                   headers: {
                    'Content-Type': 'application/json',
                    'JsonData':{
                    'ORDERID': req.body.ORDERID,
                    'MID': req.body.MID,
                    'CHECKSUMHASH': result
                   }
                  },  
                   method:'POST',   
                 }, function(error, response, body){
                   if(error){
                       console.log(`error:${error}`);
                     return error;
                   }else{
                     // const resp1 = JSON.parse(response.body);
                     console.log(`response:${response.body}`);
                     if(response.body.RESPCODE === '01'){
                     return( res.render("paytm/response",{
                          status: true,
                          result: req.body
                      })
                     )
                    }else {
                      return(res.render("paytm/response",{
                            status:false,
                            result:req.body
                        })
                      )
                    }
                   }
                 });
            }
             
          });
  
  }
  