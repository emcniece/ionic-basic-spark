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


