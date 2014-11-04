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