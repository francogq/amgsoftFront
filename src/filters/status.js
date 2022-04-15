import Vue from "vue";

Vue.filter("statusResult", (params) => {
    switch(params){
        case 0 : 
            return 'PENDING'
        break;
        case 1 : 
            return 'APPROVED'
        break;
        case 2 : 
            return 'DENIED'
        break;
        
    }
});

Vue.filter("statusPaid", (params)=>{
    switch(params){
        case 0 : 
        return 'PENDING'
        break;
        case 1 : 
        return 'YES'
        break;
        case 2 :
        return 'NO'
        break;    
    }
})
Vue.filter("statusApplication", (params)=>{
    switch(params){
        case 0 : 
        return 'PENDING'
        break;
        case 1 : 
        return 'APPROVED'
        break;
        case 2 :
            return 'REJECTED'
        break;    
    }
})


Vue.filter("notesZeroPayment", (value) => {
    let selected
    switch(parseInt(value)){
        case 1 : 
            selected = "Approve"
        break;
        case 2 :
            selected = "Disapprove"
        break;
        case 3 :
            selected = "Send"
        break;
    }
   return  selected ? selected : 'errror'
});
