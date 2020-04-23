$(document).ready(function(){
	fetch("/showteachers", {
		method: "POST",
	})
		.then(res => res.json())
		.then(response => {
			console.log(response);
			if(response[0].year !== undefined){
				for(var i = 0; i < response.length; i++){
					$("table").append(`
						<tr>
							<td>${response[i].id}</td>
							<td>${response[i].name}</td>
							<td>${response[i].subject}</td>
							<td>${response[i].year}</td>
							<td>${response[i].division}</td>
							<td><form action="/statistics" method="POST"><button id='${response[i].id}' name='tid' value='${response[i].id}' class='show'>get statistics</button></form></td>
							<td><button id='${response[i].id}' class='remove'>X</button></td>
						</tr>
					`)
				}
			} else {
				$("th").eq(3).text("BRANCH");
				for(var i = 0; i < response.length; i++){
					$("table").append(`
						<tr>
							<td>${response[i].id}</td>
							<td>${response[i].name}</td>
							<td>${response[i].subject}</td>
							<td>${response[i].branch}</td>
							<td>${response[i].division}</td>
							<td><form action="/statistics" method="POST"><button id='${response[i].id}' name='tid' value='${response[i].id}' class='show'>get statistics</button></form></td>
							<td><button id='${response[i].id}' class='remove'>X</button></td>
						</tr>
					`)
				}
			}
			$(".remove").click(function(){
				fetch("/removeteachers", {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						id: $(this).attr("id")
					})
				})
				$(this).parents("tr").remove();
			})
			// $(".show").click(function(e){

			// 	fetch("/statistics", {
			// 		method: "POST",
			// 		headers: {
			// 			'Content-Type': 'application/json'
			// 		},	
			// 		body: JSON.stringify({
			// 			id: $(this).attr("id")
			// 		})
			// 	})
			// })
		})
	$(".delete").click(function(){
		fetch("/cleardb", {
			method: "POST",
		})
		$("tr").remove()
	});
})