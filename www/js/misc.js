/*====================================
=            Object Size             =
====================================*/
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


/*=================================================
=            Append to object with IDs            =
=================================================*/
appendToObj = function(obj){

    // maybe we should make this
}

/*=========================================
=            Get Object By Key            =
=========================================*/
getObjByKey = function(key, value, object){
    var out = false;
    angular.forEach(object, function(objValue, objKey){
        if( objValue[key] == value){
            out = objValue;
        }
    })

    return out;
}


/*=====================================
=            Merge Objects            =
=====================================*/
function merge(obj1,obj2){      // Our merge function
    var result = {};            // return result
    for(var i in obj1){         // for every property in obj1
        if((i in obj2) && (typeof obj1[i] === "object") && (i !== null)){
            result[i] = merge(obj1[i],obj2[i]); // if it's an object, merge
        }else{
           result[i] = obj1[i]; // add it to result
        }
    }
    for(i in obj2){             // add the remaining properties from object 2
        if(i in result){        //conflict
            continue;
        }
        result[i] = obj2[i];
    }
    return result;
}


