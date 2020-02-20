 //引入express
const express=require("express");
//引入连接池
const pool=require("../pool.js");
//创建router对象
let router=express.Router();
//1.登录路由
router.get("/login",(req,res)=>{
	var $uname=req.query.uname;
	var $upwd=req.query.upwd;
	console.log($uname,$upwd)
	var sql="select * from ly_user where uname=? and upwd=?";
	pool.query(sql,[$uname,$upwd],(err,result)=>{
		if(err) throw err;
		console.log(result[0])

		if(result.length>0){
			var lid=result[0].id;
			req.session.lid=lid;
			console.log(req.session);
			res.send("1");
		}else{
			res.send("0");
		}
	});
});
//2.注册路由
router.post("/reg",(req,res)=>{
	var obj=req.body;
	console.log(obj);
	var sql="insert into ly_user set ?";
	pool.query(sql,[obj],function(err,result){
		if(err) throw err;
			res.send("1");
	})
});

//3.根据用户名查询
router.get("/getName",(req,res)=>{
	var $uname=req.query.uname;
	console.log($uname);
	var sql="select * from ly_user where uname=?";
	pool.query(sql,[$uname],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});
router.get("/find",(req,res)=>{
  //1:获取用户登录凭证uid
  var lid = req.session.lid;
  console.log(lid)
  //2:没有uid 请登录
  if(!lid){
    res.send({code:-2,msg:"请登录"});
    return;
  }
	else{
	res.send({code:1,msg:"查询成功"})
	}
})
//4.商品列表生成
router.get("/findweek",(req,res)=>{
	var sql="select * from ly_findweek";
	pool.query(sql,(err,result)=>{
		if(err) throw err;
		res.send(result);
		console.log(result)
	});
});
//4.商品列表生成
router.get("/getall",(req,res)=>{
	var title=req.query.title
	if(title==undefined){
		title="";
	}
	var sql=`select * from xz_index_product where title like "%${title}%"`;
	pool.query(sql,(err,result)=>{
		if(err) throw err;
		res.send(result);
		console.log(result)
	});
});
//详情页生成
router.get("/getindex",(req,res)=>{
	var lid=req.query.lid;
	// console.log(lid)
  var sql="select * from xz_index_product where lid=?"
  pool.query(sql,[lid],(err,result)=>{
		if(err) throw err;
    res.send(result)
    console.log(result)
  })
})
//添加购物车
router.get("/addcart",(req,res)=>{
  var lid=req.query.lid;
  var price=req.query.price;
  var count=req.query.count;
  var title=req.query.title;
  var pic=req.query.pic;
  var uid = req.session.uid;
  //2:如果当前用户没有登录 请登录
  if(!uid){
   res.send({code:-2,msg:"请登录"});
   return;
  }
  var sql = "select * from ly_cart where lid = ?";
  pool.query(sql,[lid],(err,result)=>{
    console.log(result)
    if(err)throw err
    if(result.length==0){
      var sql = `insert into xz_cart values(null,${lid},'${title}','${pic}','${count}',${price})`;
    }else{
      var sql = `update xz_cart set count=count+${count} where lid=${lid}`;
    }
    pool.query(sql,(err,result)=>{
      if(err)throw err;
      res.send("1")
      console.log(result)
    })
    })
})
// 查询数据库
router.get("/searchcart",(req,res)=>{
  var lid = req.query.lid
  var sql = "select * from xz_cart"
  pool.query(sql,(err,result)=>{
    if(err)throw err
    res.send(result)
    console.log(result)
  })
})
// 删除
router.get("/del",(req,res)=>{
	var lid=req.query.lid
	console.log(lid)
	var sql=`delete from xz_cart where lid in (${lid})`
	pool.query(sql,[lid],(err,result)=>{
		if(err) throw err;		
		res.send({a:1})
		//console.log(result)
	
	})
})
//导出路由
module.exports=router;
