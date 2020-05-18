$(document).ready(function() {
	var teachers = [];
	var ques = {};
	// setTimeout(() => {
		fetch("/getteachers", {
			method: "POST",
		})
			.then(res => res.json())
			.then(response => {
				var resp = response.data;
				console.log(response);

				for(var i = 0; i < 6; i++){
					if(resp[i]){
						$(`label[name="teacher${i+1}"]`).text(`${resp[i]['subject']} (${resp[i]['name']})`);
						teachers[i] = Object.assign({}, {info: resp[i]});
					} else if($(`tr[name="teacher${i+1}"]`)){
						$(`tr[name="teacher${i+1}"]`).remove();
					}
				}
				if(response.user.department == "humanities"){
					$("h1").text(`Branch: ${response.user.branch} Year: ${response.user.year} Division: ${response.user.division}`);
				} else {
					$("h1").text(`Department: ${response.user.department} Year: ${response.user.year} Division: ${response.user.division}`);
				}
			});
	//}, 500)
	$(".button3").click(function(e){
		for(var i = 1; i < 7; i ++){
			var obj = {};
			if(teachers[i-1]){
				for(var j = 1; j <11; j ++){
				
					if($(`input[name="q${j}${i}"]:checked`).val()){
						obj[`q${j}`] = $(`input[name="q${j}${i}"]:checked`).val();
					}
				}
			teachers[i-1] = Object.assign(teachers[i-1],{reviews: obj});
			}
		}
		console.log(teachers);
		// fetch("/department_questions", {
		// 	method: "POST",
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({
		// 		teachers: teachers
		// 	})
		// })
		// 	.catch(err => {console.log(err); e.preventDefault();})
	})
});