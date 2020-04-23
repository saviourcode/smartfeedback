
fetch("/target", {
	method: "POST",
})
	.then(res => res.json())
	.then(resp => {
		d3.select(".name")
			.text(function(){return resp.hold[0]['name']})
		d3.select(".year")
			.text(function(){
				if(resp.department == 'humanities'){
					return "branch: " + resp.hold[0].branch;
				} else {
					return "year: " + resp.hold[0].year;
				}
			})
		d3.select(".division")
			.text(function(){
				if(resp.hold[0].division == "none" || resp.hold[0].division == "no"){
					return null;
				} else {
					return "division: " + resp.hold[0].division;
				}
			})
		d3.select(".subject")
			.text(function(){
				return "subject: " + resp.hold[0].subject;
			})
		var datasetOne = [];
		var datasetTwo = [];
		for(var i = 0; i < 5; i++){
			for(var j = 0; j < 4; j++){
				switch(j){
					case 0:
						datasetOne[4*i + j] = resp.hold[0][`A${i+1}`];
						break;
					case 1:
						datasetOne[4*i + j] = resp.hold[0][`B${i+1}`];
						break;
					case 2:
						datasetOne[4*i + j] = resp.hold[0][`C${i+1}`];
						break;
					case 3:
						datasetOne[4*i + j] = resp.hold[0][`D${i+1}`];
						break;
				}
			}
		}
		for(var i = 0; i < 5; i++){
			for(var j = 0; j < 4; j++){
				switch(j){
					case 0:
						datasetTwo[4*i + j] = resp.hold[0][`A${i+6}`];
						break;
					case 1:
						datasetTwo[4*i + j] = resp.hold[0][`B${i+6}`];
						break;
					case 2:
						datasetTwo[4*i + j] = resp.hold[0][`C${i+6}`];
						break;
					case 3:
						datasetTwo[4*i + j] = resp.hold[0][`D${i+6}`];
						break;
				}
			}
		}

d3.select(".one")

//var datasetOne = [21,43,35,78,42,23,19,37,22,45,67,83,26,74,14,28,46,54,32,50];
//var datasetTwo = [37,43,35,78,54,23,23,21,62,45,32,43,32,74,14,28,46,54,26,50]; 

var svgHeight = 500;
var svgWidth = 1425;
var blockWidth = svgWidth/5 - 21;
var barWidth = blockWidth/4 - 1;

d3.select(".one")
	.selectAll("rect")
	.data(datasetOne)
	.enter()
	.append("rect")
	.attr("y", function(d){
		return svgHeight - 60 - d*5;
	})
	.attr("x", function(d, i){
		return barWidth*i + 21*Math.floor(i/4) + i;
	})
	.attr("height", (d) => (d*5))
	.attr("width", function(d){
		return barWidth;
	})
	.style("color", "white")
	.style("fill", "darkOrange")

d3.select(".two")
	.selectAll("rect")
	.data(datasetTwo)
	.enter()
	.append("rect")
	.attr("y", function(d){
		return svgHeight - 60 - d*5;
	})
	.attr("x", function(d, i){
		return barWidth*i + 21*Math.floor(i/4) + i;
	})
	.attr("height", (d) => (d*5))
	.attr("width", function(d){
		return barWidth;
	})
	.style("fill", "darkOrange")

	.selectAll("text")
	.data(['Q1','Q2','Q3','Q4','Q5'])
	.enter()
	.append("text")
	.text(function(d){return d})
	.attr("x", function(d,i){
		return blockWidth/2 + blockWidth*i + 21*i - 10 ;
	})
	.attr("y", function(){
		return svgHeight - 10;
	})
	.style('fill', 'black')

d3.select(".two")
	.selectAll("p")
	.data(['Q6','Q7','Q8','Q9','Q10'])
	.enter()
	.append("text")
	.text(function(d){return d})
	.attr("x", function(d,i){
		return blockWidth/2 + blockWidth*i + 21*i - 10 ;
	})
	.attr("y", function(){
		return svgHeight - 10;
	})
	.style('fill', 'black')

d3.select(".one")
	.selectAll("p")
	.data(['A','B','C','D','A','B','C','D','A','B','C','D','A','B','C','D','A','B','C','D'])
	.enter()
	.append("text")
	.text(function(d){return d})
	.attr("x", function(d,i){
		return barWidth*i + i + 21*Math.floor(i/4) + 30 ;
	})
	.attr("y", function(){
		return svgHeight - 40;
	})
	.style('fill', 'orange')

d3.select(".two")
	.selectAll("p")
	.data(['A','B','C','D','A','B','C','D','A','B','C','D','A','B','C','D','A','B','C','D'])
	.enter()
	.append("text")
	.text(function(d){return d})
	.attr("x", function(d,i){
		return barWidth*i + i + 21*Math.floor(i/4) + 30 ;
	})
	.attr("y", function(){
		return svgHeight - 40;
	})
	.style('fill', 'orange')

d3.select(".one")
	.selectAll("p")
	.data(datasetOne)
	.enter()
	.append("text")
	.text(function(d){return(d)})
	.attr("x", function(d,i){
		return barWidth*i + i + 21*Math.floor(i/4) + 25 ;
	})
	.attr("y", function(d){
		return svgHeight - 45 - d*5;
	})
	.style('fill','white')

d3.select(".two")
	.selectAll("p")
	.data(datasetTwo)
	.enter()
	.append("text")
	.text(function(d){return(d)})
	.attr("x", function(d,i){
		return barWidth*i + i + 21*Math.floor(i/4) + 25 ;
	})
	.attr("y", function(d){
		return svgHeight - 45 - d*5;
	})
	.style('fill','white')

var dataset = datasetOne.concat(datasetTwo);
var overall = [];

for(var i = 0; i < 10; i++){
	var max = 4*i;
	for(var j = 0; j < 3; j++){
		if(dataset[max] < dataset[4*i + j + 1]){
			max = 4*i + j + 1;
		}
	}
	overall.push(max - 4*i + 1);
} 
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