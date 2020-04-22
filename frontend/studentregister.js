$(".logbtn").click(function(e){
	var obj = {};
	obj = Object.assign({}, {
		department: $("select").eq(0).val(),
		year: $("select").eq(1).val(),
		division: $("select").eq(2).val()
	});
	if(obj.year == "FE"){
		obj = Object.assign(obj, {department: "humanities", branch: $("select").eq(0).val()})
	}
	fetch("/register", {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(obj)
	});
});