$(document).ready(function(){
	data = {};
	fetch("/getdepartment", {
		method: "POST",
	})
		.then(res => res.json())
		.then(response => {
			data = response;
			if(response.department == "humanities"){
				$(".temp option").remove();
				$("select").eq(0).append(`<option value="civil">Civil</option>`)
				$("select").eq(0).append(`<option value="electronics">Electronics</option>`)
				$("select").eq(0).append(`<option value="mechanical">Mechanical</option>`)
				$("select").eq(0).append(`<option value="computer">Computer</option>`)
				$("select").eq(0).append(`<option value="it">IT</option>`)
				$("select").eq(0).append(`<option value="chemical">Chemical</option>`)
			}
		})

	$(".show").click(function(e){
		$(".form").attr("action", "/showteachers");
		//$(".form").attr("action", "http://localhost:3030/addteacher");
	})

	$(".add").click(function(e){
		var input = $(".input_field .input");
		var body = {};
		if(data.department == "humanities"){
			body = Object.assign({}, {
				name: input.eq(0).val(),
				subject: input.eq(1).val(),
				branch: input.eq(2).val(),
				division: input.eq(3).val(),
				button: 'add'	
			})
		} else {
			body = Object.assign({},{
				name: input.eq(0).val(),
				subject: input.eq(1).val(),
				year: input.eq(2).val(),
				division: input.eq(3).val(),
				semester: input.eq(4).val(),
				button: 'add'
			})	
		}
		$(".form").attr("action", "/addteacher");
		fetch("/addteacher", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})
			.then(() => {
				for(var i = 0; i < input.length; i++){
					input.eq(i).val('');
				}
			})
	})
})