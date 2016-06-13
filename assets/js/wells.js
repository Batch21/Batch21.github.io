
function countWellTypes(data, year){

	var entries = new Set()
	var types = [];

	for (var i = 0; i < data.length; i++) {
		entries.add(data[i].type)			      
	}

	for (let item of entries){
		entry = {}
		count = 0
		for (var i = 0; i < data.length; i++) {
			if(data[i].year <= year){
				if(data[i].type == item){
				    count += 1;
				}
		    }	 			      
		}
		entry.key = item;
		entry.value = count;
		types.push(entry)
	}
	return types;
}



var entries = new Set()
					var types = [];
					for (var i = 0; i < data.length; i++) {
						entries.add(data[i].type)			      
				    }
				    for (let item of entries){
				    	entry = {}
				    	count = 0
				    	for (var i = 0; i < data.length; i++) {
				    		if(data[i].year <= 1970){
				    			if(data[i].type == item){
				    				count += 1;
				    			}
				    		}	 			      
				        }
				        entry.key = item;
				    	entry.value = count;
				    	types.push(entry)
				    }
				    console.log(types)