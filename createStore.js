import http from 'k6/http';
import{check, sleep} from 'k6'


const BASE_URL ="your_base_url"
const token = "your_token"

function generateRandomShopPhoneData(){
    const uniqueId = __VU * 1000 + __ITER; //This will create unique shop and phonenumber
    return{
    "name": `shop ${uniqueId}`,
    "address": "ikeja",
    "phone": `+234808 ${uniqueId}`,
    "categories": [ "anything", "something"]
}
}
export const options ={
    // vus : 100,
    // duration : "30s"

    stages:[
        {duration: "10s" , target: 100},//simulate ramp off of traffic from 1-100 users over 40 secs
        {duration: "1m" , target: 150},//stays on 100 users for a minute
        {duration: "40s" , target: 0}//Ramp down to 0 users
    ],
    thresholds:{
        http_req_duration: [{
            threshold: 'p(99) < 3000',//99% of requests must complete within 3s
            abortOnFail: false
        }],
        http_req_failed: ['rate < 0.01'],// http errors should be less than 1%

},
};
export default()=> {
   
   const url=  `${BASE_URL}/api/shop`;
   
   const payload = JSON.stringify(generateRandomShopPhoneData()); //put the data in a valid json object
   

   
   let params = {
       headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,

    },
   
};

    let createStore_res = http.post(
        url, payload, params
    );
    console.log("createStore_res", JSON.stringify(createStore_res.body))

    check(createStore_res, {
        'is status 200': (r) => r.status === 200,
        'is isSuccess in body': (r) => r.body.includes ('true')

    });
    sleep(1); // 
  
}
