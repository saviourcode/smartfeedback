var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var jwt = require("jsonwebtoken");
var session = require("express-session");
var mongoStore = require('connect-mongo')(session);

dotenv.config();

app.use(express.static(__dirname + '/frontend'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
	store: new mongoStore({
		url: 'mongodb+srv://Dhruv:Godambe%4066@cluster0-uj6dx.mongodb.net/test?retryWrites=true&w=majority',
		ttl: 60 * 60 * 2,
	}),
	secret: "the key to the universe",
	resave: false,
	saveUninitialized: false,
}));

//'mysql://b43280fc5efd34:bfd35706@us-cdbr-iron-east-01.cleardb.net/heroku_511483192373aa1?reconnect=true'
//mongodb+srv://Dhruv:Godambe@66@cluster0-uj6dx.mongodb.net/test?retryWrites=true&w=majority
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
				if(req.body.department == 'dmce office'){
					res.redirect('/office')
				} else {
					res.redirect(`/addteacher`);
				}
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
		sql = `INSERT ${department}(name,subject,branch,division,semester) VALUES ('${data.name}','${data.subject}','${data.branch}','${data.division}', '${data.semester}')`
	} else {
		sql = `INSERT ${department}(name,subject,year,division,semester) VALUES ('${data.name}','${data.subject}','${data.year}','${data.division}', '${data.semester}') `;		
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
		sql = `SELECT id,name,subject,branch,division,semester FROM ${department}`;
	} else {
		sql = `SELECT id,name,subject,year,division,semester FROM ${department}`;
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
	console.log('req.body: ', req.body.tid);
	req.session.department = department;
	req.session.tid = req.body.tid;
	req.session.save();
	res.redirect('/statistics');
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

app.post('/clearlab', isLoggedIn, function(req, res){
	jwt.verify(req.session.token, process.env.token_key, function(err, result){
		if(err){
			console.log(err);
		} else {
			const sql = `DELETE from lab_feedback where department='${result.department}'`
			conn.query(sql, function(errr, response){
				if(!errr){
					console.log('deleted ', result.department, ' row');
					conn.query(`INSERT into lab_feedback(department) VALUES ('${result.department}')`, function(error, done){
						if(!error){
							console.log('cleared lab statistics from ', result.department)
						}
					})
				} else {
					console.log('err: ', err);
				}
			})
		}
	})
})

app.get("/dmce", isLoggedIn, function(req, res){
	conn.query(`SELECT * from college_feedback WHERE name='everyone'`, function(err, result){
		// let obj = {};
		// let q = [];
		// for(var i = 0; i < 6; i++){
		// 	for(var j = 0; j < 4; j++){
		// 		switch(j){
		// 			case 0:
		// 				q[i] = q[i] + result[0][`A${i+1}`]
		// 				break;
		// 			case 1:
		// 				b = b + result[0][`B${i+1}`]
		// 				break;
		// 			case 2:
		// 				c = c + result[0][`C${i+1}`]
		// 				break;
		// 			case 3:
		// 				d = d + result[0][`D${i+1}`]
		// 				break;
		// 		}
		// 	}
		// }
		// console.log('a: ', a)
		// console.log('b: ', b)
		// console.log('c: ', c)
		// console.log('d: ', d)
		if(err){
			res.send(err.message);
			console.log(err);
		} else {
			res.json({feedback: result})
		}
	})
})

//------------------------------------------------------------

//                     OFFICE ROUTES

//------------------------------------------------------------

app.get('/office', isOffice, function(req, res) {
	res.sendFile(__dirname + "/frontend/retrieve1.html")
})

app.post('/office', function(req, res) {
	req.session.officeDepartment = req.body.department
	req.session.save()
	res.redirect('/department_data')
})

app.get('/department_data', function(req, res) {
	if(req.session.officeDepartment){
		res.sendFile(__dirname + '/frontend/department_data.html')
	} else {
		res.redirect('/office')
	}
})

app.post('/department_data', function(req, res) {
	var sql = `SELECT * FROM ${req.session.officeDepartment} ORDER BY semester, division ASC`
	conn.query(sql, function(err, result){
		if(err){
			res.send(err.message)
		} else {
			res.send({result: result, department: req.session.officeDepartment})
		}
	})
})
//------------------------------------------------------------

//                     STUDENTS ROUTES

//------------------------------------------------------------

app.get("/register", function(req, res){
	console.log('session from registter route: ', req.session);	
	res.sendFile(__dirname + "/frontend/studentregister.html");
});

app.post("/register", function(req, res) {
	var data = req.body;
	var sql = ``;
	var dept = data['department'];
	if(data.year == "FE"){
		sendData = Object.assign(data, {department: 'humanities', branch: dept})
		if(sendData.division == "none"){
			sql = `SELECT id, name, branch, subject, division FROM ${sendData.department} WHERE branch='${data.branch}' AND division='none'`;
		} else {
			sql = `SELECT id, name, branch, subject, division FROM ${sendData.department} WHERE branch='${data.branch}' AND division='${data.division}'`;
		}
		req.session.user = sendData;
	} else {
		sql = `SELECT id, name, year , subject, division FROM ${data.department} WHERE year='${data.year}' AND division='${data.division}'`;
		req.session.user = data;

	}
	conn.query(sql, function(err, result){
		if(err){
			console.log(err);
		}
		console.log("sql: ", sql);
		req.session.data = result;
		req.session.save(function(err){
			if(err){
				console.log(err);
			} else {
				res.redirect('/home');
			}
		});
	});
});

app.get('/home', isRegistered, function (req, res) {
	console.log('session from home route: ', req.session);	
	res.sendFile(__dirname + '/frontend/intro.html');
	console.log('completed: ', req.session.completed);
})

app.get("/department_questions", isRegistered, function(req, res){
	res.sendFile(__dirname + "/frontend/questions.html");
});

app.post("/getteachers", function(req, res){
	var data = req.session;
	res.send(data);
});

app.post("/department_questions", isRegistered, function(req, res){
	var response = req.body;
	var teachers = [];
	var resp = req.session.data;
	for(var i = 0; i < 6; i++){
		if(resp[i]){
			teachers[i] = Object.assign({}, {info: resp[i]});
		}
	}
	for(var i = 1; i < 7; i ++){
		var obj = {};
		if(teachers[i-1]){
			for(var j = 1; j <11; j ++){
				if(response[`q${j}${i}`]){
					obj[`q${j}`] = response[`q${j}${i}`];
				}
			}
		teachers[i-1] = Object.assign(teachers[i-1],{reviews: obj});
		}
	}
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
					sql = sql.concat(` WHERE name='${teacher.info.name}' AND branch='${teacher.info.branch}' AND division='none'`);
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
					console.log("teachers reviews added");

				}
			});
		}
	}
	if(req.session.completed){
		req.session.completed = [...req.session.completed, 'faculty']
	} else {
		req.session.completed = ['faculty']
	}
	res.redirect('/home');
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

// app.get("/test", function(req, res){
// 	for(var i = 8; i < 10; i++){
// 		for(var j = 0; j < 4; j++){
// 			var sql = `ALTER TABLE computer ADD`;
// 			switch(j){
// 				case 0:
// 					sql = sql.concat(` A${i+1} INT(3) NOT NULL`);
// 					break;
// 				case 1:
// 					sql = sql.concat(` B${i+1} INT(3) NOT NULL`);
// 					break;
// 				case 2:
// 					sql = sql.concat(` C${i+1} INT(3) NOT NULL`);
// 					break;
// 				case 3:
// 					sql = sql.concat(` D${i+1} INT(3) NOT NULL`);
// 					break;
// 			}
// 			console.log(sql);
// 			conn.query(sql, function(err, result){
// 				if(err){
// 					console.log(err);
// 					res.send(err);
// 				} else {
// 					console.log('altered table successfully');
// 				}
// 			})
// 		}
// 	}
// })

// app.get('/test', function(req, res){
// 	conn.query(`ALTER TABLE it ADD C1 INT(3)`)
// })

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
	if(req.session.completed){
		req.session.completed = [...req.session.completed, 'college']
	} else {
		req.session.completed = ['college']
	}
	res.redirect("/home")
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
	if(req.session.completed){
		req.session.completed = [...req.session.completed, 'lab']
	} else {
		req.session.completed = ['lab']
	}
	res.redirect("/home");
});

app.get("/thankyou", isCompleted, function(req, res){
	res.sendFile(__dirname + "/frontend/thankyou.html");
});

function isCompleted (req, res, next) {
	if(req.session.completed.length >= 3){
		next();
	} else {
		res.redirect('/register');
	}
}

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

function isRegistered(req, res, next){
	setTimeout(() => {
		if(req.session.user){
			next();
		} else {
			console.log("not registered");
			console.log('session: ', req.session);
			res.redirect("/register");
		}
	}, 500)
}

function isOffice(req, res, next){
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
			if(user.department == 'dmce office' && user.password == 'office@123'){
				loggedIn = true;
			}
		}
		if(loggedIn){
			next();
		} else {
			res.redirect("/plogin");
		}
	});
}

app.get('*', function(req, res){
	res.send('<h1>404: page not found</h1>')
})

app.listen(process.env.PORT || 3030, process.env.IP, function(){
	console.log("server running...", process.env.PORT, process.env.IP);
});