$(".logbtn").click(function(e){
	//e.preventDefault();
	var input = $(".txtb input");
	$(".login-form").attr("action", "http://192.168.1.63:3030/plogin");
	fetch("http://192.168.1.63:3030/plogin", {
		method: "POST",
		body: {
			department: input.eq(0).val(),
			password: input.eq(2).val()
		}
	});
});