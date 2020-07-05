fetch('/department_data', {
	method: 'POST'
})
.then(res => res.json())
.then(response => {
	var sem = 0;
	$('.heading').text(`Department: ${response.department}`)
	response.result.forEach(faculty => {
		sem = sem + faculty.semester;
		var str1 = ''
		var result = 0;
		var str2 = ''
		var verdict;
		for(var i = 0; i < 10; i++){
			var avg = 0;
			var overall = 0;
			for(var j = 0; j < 4; j++){
				switch(j){
					case 0:
						var var1 = 'A' + (i+1).toString()
						avg = avg + faculty[var1]
						overall = overall + faculty[var1]
						str1 = str1.concat(`<td>${faculty[var1]}</td>`)
						break;
					case 1:
						var var2 = 'B' + (i+1).toString()
						avg = avg + faculty[var2]
						overall = overall + faculty[var2]
						str1 = str1.concat(`<td>${faculty[var2]}</td>`)
						break;
					case 2:
						var var3 = 'C' + (i+1).toString()
						overall = overall + faculty[var3]
						str1 = str1.concat(`<td>${faculty[var3]}</td>`)
						break;
					case 3:
						var var4 = 'D' + (i+1).toString()
						overall = overall + faculty[var4]
						str1 = str1.concat(`<td>${faculty[var4]}</td>`)
						break;
				}
			}
			result = result + (avg/(faculty[var1] + faculty[var2] + faculty[var3] + faculty[var4]))
			verdict = avg/(faculty[var1] + faculty[var2] + faculty[var3] + faculty[var4])
			str2 = str2.concat(`<td>${verdict*100}%</td>`)
			if(verdict*100 > 50){
				str2 = str2.concat(`<td>A</td>`)
			} else {
				str2 = str2.concat(`<td>U</td>`)
			}
		}
		result = Math.ceil(result*10)
		$('#exportTable').append(`
			<tr>
				<td>${faculty.id}</td>
				<td>${faculty.name}</td>
				<td>${faculty.subject}</td>
				<td>${faculty.semester}</td>
				<td>${faculty.year}</td>
				<td>${faculty.division}</td>
				${str1}
				<td>${result}%</td>
			</tr>
		`)
		$('#exportTable2').append(`
			<tr>
				<td>${faculty.id}</td>
				<td>${faculty.name}</td>
				<td>${faculty.subject}</td>
				<td>${faculty.semester}</td>
				<td>${faculty.year}</td>
				<td>${faculty.division}</td>
				${str2}
			</tr>
		`)
	})
	// $('.excel').unbind().click(function() {
	// 	$('#exportTable').table2excel({
	// 		name: 'department_data',
	// 		filename: 'department_data',
	// 		fileext: '.xls'
	// 	})
	// })
	if(sem % 2 == 0){
		$('#exportTable tr').eq(1).append('<th colspan="47" style="font-size: 30px;">Even Semester</th>')
		$('#exportTable2 tr').eq(1).append('<th colspan="47" style="font-size: 30px;">Even Semester</th>')
	} else {
		$('#exportTable tr').eq(1).val('<th colspan="47" style="font-size: 30px;">Odd Semester</th>')
		$('#exportTable2 tr').eq(1).val('<th colspan="47" style="font-size: 30px;">Odd Semester</th>')
	}
})