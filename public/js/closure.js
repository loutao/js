//闭包就是阻塞垃圾回收器将方法中的变量从内存中回收的方法
var makePrison = (function(){
    var prisoner = 'josh'
    return {  //如此一来局部变量就不会被回收
        prisoner : function(){
            return prisoner;
        }
    }
})();
console.log(makePrison.prisoner());
console.log("====================================================================");
//#console : josh


//Ajax中用来保存返回的数据
var prison = {
    data1 : "",
    who  : function(){
        $.ajax({
            url:"",
            success: function(data){
                prison.data1 = data;
            }
        });
    }
};

