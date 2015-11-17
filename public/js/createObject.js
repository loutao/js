//使用Object.create()方法创建对象
var me = {
    name : "loutao",
    age  : 23,
    sex  : "male"
};
var m1 = Object.create(me);
m1.hair   = "short";
m1.height = 1.8;
console.log( m1.hair );  //#console :short
console.log("====================================================================");



//使用new 操作符来创建对象
var proto = {
    name : "loutao",
    age  : 23,
    sex  : "male"
};
var Person = function(hair, height){
    this.hair   = hair;
    this.height = height;
};
var p1 = new Person("long", 1.7);
p1.prototype = proto;
console.log(p1);
//#console :
//{ hair: 'long',
//    height: 1.7,
//    prototype: { name: 'loutao', age: 23, sex: 'male' } }
console.log("====================================================================");



//使用工厂函数创建object
var proto = {
    name : "loutao",
    age  : 23,
    sex  : "male"
};
var makePerson = function(hair, height){
    var person = Object.create(proto);
    person.hair = hair;
    person.height = height;
    return person;
};
var p2 = makePerson("short", 1,8);
p2.prototype = proto;
console.log(p2.__proto__.name);
//#console :
//{ hair: 'short',
//    height: 1,
//    prototype: { name: 'loutao', age: 23, sex: 'male' } }
console.log("====================================================================");
