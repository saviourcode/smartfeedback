$(document).ready(function() {
	fetch('/getteachers', {
		method: 'POST'
	})
	.then(res => res.json())
	.then(response => {
		if(response.completed){
			if(response.completed.length >= 3) {
				for(var i = 0; i < response.completed.length; i++){
					$(`#${response.completed[i]}`).css('background', 'green')
				}
				$('.endbtn').css('display', 'block')	
			}
			for(var i = 0; i < response.completed.length; i++){
				$(`#${response.completed[i]}`).css('background', 'green')
				$(`#${response.completed[i]} img`).css('display', 'flex')
			}
		}
	})
})