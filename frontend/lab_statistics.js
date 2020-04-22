fetch("/lab_statistics", {
	method: "POST",
})
	.then(res => res.json())
	.then(resp => {
		d3.select("h2")
			.text(function(){
				return "Department: " + resp[0]['department']
			})
		console.log(resp);
		var dataset = [];
		for(var i = 0; i < 6; i++){
			for(var j = 0; j < 4; j++){
				switch(j){
					case 0:
						dataset.push(resp[0][`A${i+1}`])
						break;
					case 1:
						dataset.push(resp[0][`B${i+1}`])
						break;
					case 2:
						dataset.push(resp[0][`C${i+1}`])
						break;
					case 3:
						dataset.push(resp[0][`D${i+1}`])
						break;
				}
			}
		}	
		d3.select("svg")
			.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
			.attr("y", function(d){
				return 400 - d*2 - 60;
			})
			.attr("height", (d) => d*2)
			.attr("x", function(d, i){
				return 55*i + i + 14*Math.floor(i/4) + 5;
			})
			.attr("width", 55)
			.style("fill", "darkorange")

		d3.select("svg")
			.selectAll("text")
			.data(['Q1','Q2','Q3','Q4','Q5','Q6'])
			.enter()
			.append("text")
			.text(function(d){
				return d;
			})
			.attr("x", function(d, i){
				return 220/2 + 220*i + 19*i - 10;
			})
			.attr("y", function(){
				return 400 - 10;
			})

		d3.select("svg")
			.selectAll("p")
			.data(['A','B','C','D','A','B','C','D','A','B','C','D','A','B','C','D','A','B','C','D','A','B','C','D'])
			.enter()
			.append("text")
			.text(function(d){return d})
			.attr("x", function(d,i){
				return 55*i + i + 14*Math.floor(i/4) + 25 ;
			})
			.attr("y", function(){
				return 400 - 40;
			})
			.style('fill', 'orange')

		d3.select("svg")
			.selectAll("p")
			.data(dataset)
			.enter()
			.append("text")
			.text(function(d){return(d)})
			.attr("x", function(d,i){
				return 55*i + i + 14*Math.floor(i/4) + 25 ;
			})
			.attr("y", function(d){
				return 400 - 65 - d*2;
			})
			.style('fill','black')

		var overall = [];
		for(var i = 0; i < 6; i++){
			var max = 4*i;
			for(var j = 0; j < 3; j++){
				if(dataset[max] < dataset[4*i + j + 1]){
					max = 4*i + j + 1;
				}
			}
			overall.push(max - 4*i + 1);
		}  
		console.log(overall);
		d3.selectAll("span")
			.data(overall)
			.text(function(d, i){
				switch(d){
					case 1: 
						return `A`;
						break;
					case 2: 
						return `B`;
						break;
					case 3: 
						return `C`;
						break;
					case 4: 
						return `D`;
						break;
					default:
						return `null`;
						break;
				}
			}) 

	})

		//var dataset = [14,15,87,23,45,65,23,87,98,43,67,37,23,75,13,73,56,86,14,97,34,65,23,67]
		
		                        
