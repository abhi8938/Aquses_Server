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
         paramarray["CALLBACK_URL"] = "http://192.168.1.5:3002/api/paytm/response";
         checksum.genchecksum(paramarray, PAYTM_MERCHANT_KEY, (err, result) =>{
             if(err) console.log(err);
             res.render("paytm/request", {result});
         });
        },
       response: (req, res) =>{
         console.log(`req.body`,req.body)
          const verified= checksum.verifychecksum(req.body,"ZHdiFizLeS2T1i%j");
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
  var check = {
             "MID":req.body.MID,
             "ORDERID":req.body.ORDERID
  }
  var checkString = JSON.stringify(check);
  return checksum.genchecksumbystring(checkString, "ZHdiFizLeS2T1i%j", function (err, result) 
          {
            if(err){
                console.log(`error:${err}`);
            }else{
                return request({
                   url:' https://securegw.paytm.in/order/status',
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
                     const resp1 = JSON.parse(response.body);
                     console.log(`responseTransactionAPI`,resp1);
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
  