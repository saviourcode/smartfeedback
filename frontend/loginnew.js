$(".logbtn").click(function(e){
	//e.preventDefault();
	var input = $(".txtb input");
	$(".login-form").attr("action", "/plogin");
	fetch("/plogin", {
		method: "POST",
		body: {
			department: input.eq(0).val(),
			password: input.eq(2).val()
		}
	});
});