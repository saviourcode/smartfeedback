fetch('/department_data', {
	method: 'POST'
})
.then(res => res.json())
.then(response => {
	console.log(response)
	response.forEach(faculty => {
		var str1 = ''
		var result = 0;
		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 4; j++){
				var avg;
				switch(j){
					case 0:
						var var1 = 'A' + (i+1).toString()
						avg = faculty[var1]
						str1 = str1.concat(`<td>${faculty[var1]}</td>`)
						break;
					case 1:
						var var2 = 'B' + (i+1).toString()
						avg = avg + faculty[var2]
						str1 = str1.concat(`<td>${faculty[var2]}</td>`)
						break;
					case 2:
						var var3 = 'C' + (i+1).toString()
						str1 = str1.concat(`<td>${faculty[var3]}</td>`)
						break;
					case 3:
						var var4 = 'D' + (i+1).toString()
						str1 = str1.concat(`<td>${faculty[var4]}</td>`)
						break;
				}
				result = result + avg
			}
		}
		result = result/10
		$('table').append(`
			<tr>
				<td>${faculty.id}</td>
				<td>${faculty.name}</td>
				<td>${faculty.subject}</td>
				<td>${faculty.year}</td>
				<td>${faculty.division}</td>
				${str1}
			</tr>
		`)
		$('.excel').unbind().click(function() {
			$('#exportTable').table2excel({
				name: 'department_data',
				filename: 'department_data',
				fileext: '.xls'
			})
		})
	})
})