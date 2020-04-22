var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var jwt = require("jsonwebtoken");
var session = require("express-session");

dotenv.config();

app.use(express.static(__dirname + '/frontend'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
	secret: "the key to the universe",
	resave: false,
	saveUninitialized: false,
}));

//'mysql://b43280fc5efd34:bfd35706@us-cdbr-iron-east-01.cleardb.net/heroku_511483192373aa1?reconnect=true'

var conn = mysql.createPool({
	connectionLimit: 30,
	host: 'us-cdbr-iron-east-01.cleardb.net',
	user: 'b43280fc5efd34',
	password: 'bfd35706',
	database: 'heroku_511483192373aa1'
});
// conn.connect(function(error){
// 	if(error){
// 		console.log(error.message);
// 	} else {
// 		console.log("database connected!");
// 	}
// })

app.get("/", function(req, res){
	res.sendFile('index.html');
	//res.send("hi");
});

//------------------------------------------------------------

//                     HOD ROUTES

//------------------------------------------------------------

app.get("/plogin", function(req, res){
	res.sendFile(__dirname + '/frontend/loginnew.html');
});

app.post("/plogin", function(req, res){
	//verify login
	var isAuthenticated = false;
	var sql = "SELECT department,password FROM `privilege login`";
	conn.query(sql, function(err, row){
		if(err){
			console.log(err);
		} 
		for(var i = 0; i < row.length; i++){
			if(req.body.department == row[i].department){
				if(req.body.password == row[i].password){
					isAuthenticated = true;
				} 
			} 
		}
	//GET request - depending on failure or success of authentication
		if(isAuthenticated){
			//success
			var token = jwt.sign({
				department: req.body.department,
				password: req.body.password
			}, process.env.token_key);
			req.session.token = token;
			if(req.body.department == "DMCE"){
				res.redirect("/DMCE");
			} else {
				res.redirect(`/addteacher`);
			}
		} else {
			//failure
			res.redirect("/plogin");
		}
	});
})

app.get("/addteacher", isLoggedIn, function(req, res){
	res.sendFile(__dirname + '/frontend/register.html');
});

app.post("/getdepartment", function(req, res){
	var token = req.session.token;
	jwt.verify(token, process.env.token_key, function(err, result){
		if(err){
			console.log(err);
		} else {
			res.send(result);
		}
	})
})

app.post("/addteacher", isLoggedIn, function(req, res){
	var data = req.body;
	var department;
	var token = jwt.verify(req.session.token, process.env.token_key, function(err, result){
		if(err){
			console.log(err);
		}
		department = result.department;
	});
	var sql = ``;
	if(department === "humanities"){
		sql = `INSERT ${department}(name,subject,branch,division) VALUES ('${data.name}','${data.subject}','${data.branch}','${data.division}')`
	} else {
		sql = `INSERT ${department}(name,subject,year,division) VALUES ('${data.name}','${data.subject}','${data.year}','${data.division}')`;		
	}
	conn.query(sql, function(err ,result){
		if(err){
			console.log(err);
		} else {
			console.log("created new row", result);
		}
	});
});

app.get("/showteachers", isLoggedIn, function(req, res){
	res.sendFile(__dirname + "/frontend/facultydetail.html");
});

app.post("/showteachers", function(req, res){
	var token = req.session.token;
	var department;
	jwt.verify(token, process.env.token_key, function(err, decoded){
		if(err){
			console.log(err);
		} else {
			department = decoded.department;
		}
	});
	var sql = ``;
	if(department == "humanities"){
		sql = `SELECT id,name,subject,branch,division FROM ${department}`;
	} else {
		sql = `SELECT id,name,subject,year,division FROM ${department}`;
	}
	conn.query(sql, function(err, result){
		res.send(result);
	});
});

app.post("/removeteachers", function(req, res){
	var token = req.session.token;
	var department;
	jwt.verify(token, process.env.token_key, function(err, decoded){
		if(err){
			console.log(err);
		} else {
			department = decoded.department;
		}
	});
	var sql = `DELETE FROM ${department} WHERE id='${req.body.id}'`;
	conn.query(sql, function(err, result){
		if(err){
			console.log(err);
		} else {
			console.log("DELETED A ROW!!");
		}
	})
})

app.get("/statistics", isLoggedIn, function(req, res){
	res.sendFile(__dirname + '/frontend/begin/statistics.html')
})

app.post("/target", isLoggedIn, function(req, res){
	var sql = `SELECT * from ${req.session['department']} WHERE id=${req.session['tid']}`;
	conn.query(sql, function(err, hold){
		if(err){
			console.log(err);
		} else {
			res.send({
				hold: hold,
				department: req.session.department
			});
		}
	})
})

app.post("/statistics", isLoggedIn, function(req, res){
	var token = req.session.token;
	var department;
	jwt.verify(token, process.env.token_key, function(err, decoded){
		if(err){
			console.log(err);
		} else {
			department = decoded.department;
		}
	})
	
	req.session.department = department;
	req.session.tid = req.body.id;
	req.session.save();
})

app.get("/lab_statistics", isLoggedIn,
 function(req, res){
	res.sendFile(__dirname + "/frontend/lab_statistics.html")
});

app.post("/lab_statistics", function(req, res){
	var token = req.session.token;
	jwt.verify(token, process.env.token_key, function(err, result){
		if(err){
			console.log(err);
		} else {
			console.log(result);
			var sql = `SELECT * FROM lab_feedback WHERE department='${result.department}'`;
			conn.query(sql, function(err, done){
				if(err){
					console.log(err);
					res.send("something went wrong");
				} else {
					res.send(done);
				}
			})
		}
	})
})

app.post("/cleardb", function(req, res){
	var token = req.session.token;
	jwt.verify(token, process.env.token_key, function(err, result){
		if(err){
			console.log(err);
		} else {
			console.log(result);
			var sql = `TRUNCATE TABLE ${result.department}`;
			conn.query(sql, function(err, done){
				if(err){
					console.log(err);
					res.send("something went wrong");
				} else {
					console.log(`${result.department} table cleared`)
				}
			})
		}
	})	
})

app.get("/DMCE", function(req, res){
	res.send("<h1>DMCE page</h1>")
})

//------------------------------------------------------------

//                     STUDENTS ROUTES

//------------------------------------------------------------

app.get("/register", function(req, res){		
	res.sendFile(__dirname + "/frontend/studentregister.html");
});

app.post("/register", function(req, res) {
	// var token = jwt.sign({
	// 	user: req.body
	// }, process.env.token_key);
	// req.session.token = token;
	var data = req.body;
	//console.log('1', req.session);
	var sql = ``;
	if(data.year == "FE"){
		if(data.division == "none"){
			sql = `SELECT id, name, branch, subject, division FROM ${data.department} WHERE branch='${data.branch}' AND division='no'`;
		} else {
			sql = `SELECT id, name, branch, subject, division FROM ${data.department} WHERE branch='${data.branch}' AND division='${data.division}'`;
		}
	} else {
		sql = `SELECT id, name, year , subject, division FROM ${data.department} WHERE year='${data.year}' AND division='${data.division}'`;
	}
	conn.query(sql, function(err, result){
		if(err){
			console.log(err);
		}
		console.log("sql: ", sql);
		req.session.user = data;
		req.session.data = result;
		req.session.save(function(err){
			if(err){
				console.log(err);
			} else {
				//console.log('2', req.session)
			}
		});
	});
});

app.get("/department_questions", function(req, res){
	res.sendFile(__dirname + "/frontend/questions.html");
});

app.post("/getteachers", function(req, res){
	var data = req.session;
	res.send(data);
});

app.post("/department_questions", isRegistered, function(req, res){
	var teachers = req.body.teachers;
	department = req.session.user.department;
	for(var t = 0; t < teachers.length; t++){
		var teacher = teachers[t];
		if(Object.keys(teacher.reviews).length > 0){
			var sql = `UPDATE ${department} SET `;
			for(var i = 0; i < Object.keys(teacher.reviews).length; i++){
				sql = sql.concat(`${teacher.reviews[Object.keys(teacher.reviews)[i]]}=${teacher.reviews[Object.keys(teacher.reviews)[i]]}+1, `)
			}
			sql = sql.substring(0, sql.length - 2);
			if(teacher.info.division == "none"){
				if(department == "humanities"){
					sql = sql.concat(` WHERE name='${teacher.info.name}' AND branch='${teacher.info.branch}' AND division='no'`);
				} else {
					sql = sql.concat(` WHERE name='${teacher.info.name}' AND year='${teacher.info.year}' AND division='${req.session.user.division}'`);
				}
			} else {
				if(department == "humanities"){
					sql = sql.concat(` WHERE name='${teacher.info.name}' AND branch='${teacher.info.branch}' AND division='${teacher.info.division}'`);
				} else {
					sql = sql.concat(` WHERE name='${teacher.info.name}' AND year='${teacher.info.year}' AND division='${teacher.info.division}'`);
				}
			}
			conn.query(sql, function(err, result){
				if(err){
					console.log(err);
				} else {
					console.log("teachers reviews added")
				}
			});
		}
	}
});

// app.get("/test", function(req, res){
// 	res.send("processing");
// 	var sql = `UPDATE electronics SET `
// 		for(var i = 0; i < 5; i++){
// 			for(var j = 0; j < 4; j++){
// 				switch(j){
// 					case 0:
// 						sql = sql.concat(`A${i+6}=${Math.floor(Math.random()*80)},`);
// 						break;
// 					case 1:
// 						sql = sql.concat(`B${i+6}=${Math.floor(Math.random()*80)},`);
// 						break;
// 					case 2:
// 						sql = sql.concat(`C${i+6}=${Math.floor(Math.random()*80)},`);
// 						break;
// 					case 3:
// 						sql = sql.concat(`D${i+6}=${Math.floor(Math.random()*80)},`);
// 						break;
// 				}
// 			}
// 		}
// 		sql = sql.substring(0, sql.length - 1);
// 		sql = sql.concat(" WHERE id=1")
// 		conn.query(sql, function(err, result){
// 			if(err){console.log(err)}else{console.log("done")}
// 		});
// 	// var sql =`ALTER TABLE electronics ADD A1 INT(150) NOT NULL AFTER division`;
// 	// conn.query(sql, function(err, result){
// 	// 	if(err){
// 	// 		console.log(err);
// 	// 	} else {
// 	// 		console.log(result);
// 	// 	}
// 	// })
// });

app.get("/college_questions", isRegistered, function(req, res){
	res.sendFile(__dirname + "/frontend/colquestions.html");
});

app.post("/college_questions", function(req, res){
	var sql = `UPDATE college_feedback SET `;
	for(var i = 0; i < Object.keys(req.body).length; i++){
		sql = sql.concat(`${req.body[Object.keys(req.body)[i]]}=${req.body[Object.keys(req.body)[i]]}+1, `);
	}
	sql = sql.substring(0, sql.length - 2);
	sql = sql.concat(" WHERE name='everyone'");
	conn.query(sql, function(err, rows){
		if(err){
			console.log(err);
		} else {
			console.log("college review added");
		}
	});
	res.redirect("/lab_questions")
});

app.get("/lab_questions", isRegistered, function(req, res){
	res.sendFile(__dirname + "/frontend/labquestions.html");
});

app.post("/lab_questions", isRegistered, function(req, res){
	var department = req.session.user.department;
	var sql = `UPDATE lab_feedback SET `;
	for(var i = 0; i < Object.keys(req.body).length; i++){
		sql = sql.concat(`${req.body[Object.keys(req.body)[i]]}=${req.body[Object.keys(req.body)[i]]}+1, `);
	}
	sql = sql.substring(0, sql.length - 2);
	sql = sql.concat(` WHERE department='${department}'`);
	conn.query(sql, function(err, rows){
		if(err){
			console.log(err);
		} else {
			console.log("lab review added");
		}
	})
	res.redirect("/thankyou");
});

app.get("/thankyou", function(req, res){
	res.send("thankyou");
});

function isLoggedIn (req, res, next){
	var sql = "SELECT department,password FROM `privilege login`";
	var token = req.session.token;
	var user = {};
		jwt.verify(token, process.env.token_key, function(err, decoded){
			if(err){
				console.log(err);
				// res.redirect("/plogin");
			}
			user = decoded;
		});
		conn.query(sql, function(err, row){
			var loggedIn = false;
			if(err){
				console.log(err);
			}
			if(user !== undefined){
				for(var i = 0; i < row.length; i++){
					if(user.department == row[i].department){
						if(user.password == row[i].password){
							loggedIn = true;
						}
					} 
				}
			}
			if(loggedIn){
				next();
			} else {
				res.redirect("/plogin");
			}
		});
}

async function isRegistered(req, res, next){
	if(req.session.user){
		next();
	} else {
		console.log("not registered");
		res.redirect("/register");
	}
}

app.listen(process.env.PORT || 3030, process.env.IP, function(){
	console.log("server running...", process.env.PORT, process.env.IP);
});