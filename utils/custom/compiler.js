var compiler = {};
compiler.data = [];
compiler.stats = {};
compiler.homeButton = function(){
    $("#compilerUpload").on("change",function(e){
        compiler.upload(e)
    })
    $("#compilerUpload").click();
}

compiler.wordDoc = {};
compiler.wordDoc.properties = {};
compiler.wordDoc.children = [];
compiler.addTitleToWordDoc = function(content){
    compiler.wordDoc.children.push(new docx.Paragraph({
        pageBreakBefore: true,
        children: [
        new docx.TextRun({
            text: content,
            bold: true,
            size: 48,
            pageBreakBefore: true,
        })
        ],
    }))
}

compiler.addSubTitleToWordDoc = function(content){
    compiler.wordDoc.children.push(new docx.Paragraph({
        children: [
        new docx.TextRun({
            text: content,
            bold: true,
            size: 36
        })
        ],
        spacing: {
            after: 120,
            before: 120
        },
    }))
}

compiler.addTextToWordDoc = function(content){
    compiler.wordDoc.children.push(new docx.Paragraph({
        children: [
        new docx.TextRun({
            text: "- " + content,
            bold: true,
            size: 24
        })
        ],
    }))
}



compiler.addImageToWordDoc = function(image){
    compiler.wordDoc.children.push(new docx.Paragraph({
        children: [
            new docx.ImageRun({
                data: image.toBase64Image(),
                transformation: {
                    width: 500,
                    height: 300,
                },

            }),
        ]
    }))
}



compiler.downloadWordDoc = function(){
    for(var i=0;i<compiler.wordDocElements.length;i++){
        var el = compiler.wordDocElements[i];
        if(el.type == "chart"){
            compiler.addImageToWordDoc(el.content);
        }
        else if(el.type == "title"){
            compiler.addTitleToWordDoc(el.content)
        }
        else if(el.type == "subTitle"){
            compiler.addSubTitleToWordDoc(el.content)
        }
        else if(el.type == "text" && el.content != ""){
            compiler.addTextToWordDoc(el.content)
        }
        else if(el.type == "break"){
            compiler.addTextToWordDoc("")
        }
    }
    var doc = new docx.Document({
        sections: [compiler.wordDoc]
      });
    
      docx.Packer.toBlob(doc).then((blob) => {
        console.log(blob);
        saveAs(blob, "_feedback.docx");
        console.log("Document created successfully");
      });
}
compiler.home = function(){
    compiler.wordDocElements = []
    compiler.compile();
    compiler.summarize();
    compiler.writeSummary();
    setTimeout(function(){
        compiler.downloadWordDoc();
    },1500);
}

compiler.writeSummary = function(){
    $("#content").html("")
        compiler.writeIndividualSummary("briefs");
        compiler.writeIndividualSummary("events");
        compiler.writeIndividualSummary("exams");
        $("#content").append("<hr>")
        $("#content").append("<h2 style='text-align:center;margin-top:10px'>Free Response Questions</h2>")
        compiler.writeFreeResponseSummary()
}

compiler.writeFreeResponseSummary = function(){
    compiler.wordDocElements.push({type:"title",content:"Free Response"})
    var free = compiler.stats.free;
    for(var i=0;i<free.length;i++){
        var question = free[i];
        $("#content").append("<hr>")
        $("#content").append("<h3 style='text-align:center;margin-top:10px'>"+ controller.freeQuestions[question.name] + "</h3>")
        compiler.wordDocElements.push({type:"subTitle",content: controller.freeQuestions[question.name]})
        $("#content").append("<div id='summaryRow"+i+"free' class='row'></div>");
        $("#summaryRow"+i+ "free").append("<ul id='listLeft" + i + "free' style='margin-left:10px;margin-right:10px'>")
        for(var ii=0;ii<question.responses.length;ii++){
            $("#listLeft" + i + "free").append("<li>" +question.responses[ii]+ "</li>")
            compiler.wordDocElements.push({type:"text",content: question.responses[ii]})
        }
    }
}


compiler.writeIndividualSummary = function(prop){
    var data = compiler.stats[prop];
    var html = "";


    for(var i=0;i<data.length;i++){
        $("#content").append("<hr>")
        var type = prop.charAt(0).toUpperCase() + prop.slice(1, -1)
        $("#content").append("<h3 style='text-align:center;margin-left:30px;margin-right:30px;margin-top:10px'>"+type+": " + data[i].name + "</h3>")
        compiler.wordDocElements.push({type:"title",content:type+": " + data[i].name})
        $("#content").append("<div id='summaryRow"+i+""+prop+"' class='row' style='margin-left:30px;margin-right:30px;'></div>");

        
        var questions = data[i].responses
        for(var ii=0;ii<questions.length;ii++){
            var possibleAnswerText = controller.answers[prop][ii];
            if(possibleAnswerText[0] == "free"){
                $("#summaryRow"+i+ "" + prop).append("<p style='text-align:center'>"+questions[ii].question+"</p>")
                compiler.wordDocElements.push({type:"subTitle","content":questions[ii].question})
                $("#summaryRow"+i+ "" + prop).append("<ul id='list" + i + ""+prop+"' style='margin-left:10px;margin-right:10px'>")
                for(var answer in questions[ii].responses){
                    compiler.wordDocElements.push({type:"text","content":questions[ii].responses[answer]})
                    $("#list" + i + ""+prop).append("<li>" +questions[ii].responses[answer]+ "</li>")
                }
                
            }
            else{
                var labels = [];
                var datapoints = [];
                for(var iii=0;iii<possibleAnswerText.length;iii++){
                    labels.push(possibleAnswerText[iii])
                    datapoints.push(questions[ii].bins[iii] || 0);
                }    
                var chart = compiler.writeBarGraph(questions[ii].question, labels, datapoints, i, prop)
                compiler.wordDocElements.push({type:"chart", content:chart});
            }    
        }
    }

    compiler.wordDocElements.push({type:"break", content:""});
    return html;

}

compiler.writeBarGraph = function(title, labels, datapoints, i, prop){
    var data = {
    labels: labels,
    datasets: [{
        axis: 'y',
        data: datapoints,
        fill: false,
        backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
        ],
        borderWidth: 1,

    }]
    };
    var id = uuidv4();

    $("#summaryRow"+i+ "" + prop).append("<div class='noOverflow'><canvas id='"+id+"'></canvas></div>");

    var config = {
        type: 'bar',
        data,
        options: {
            indexAxis: 'y',    
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                legend: {
                    display: false,
                }
            },
            scales: {
                xAxes: [{
                  ticks: {
                    beginAtZero: true,
                    callback: function(value) {if (value % 1 === 0) {return value;}}
                  }
                }]
              }
    
        }
      };
      var ctx = document.getElementById(id);
      console.log(id)
      ctx.height = 200;
    var myChart = new Chart(
        document.getElementById(id),
        config
      );

    compiler.charts.push(myChart);
    return myChart

}



compiler.writeFreeResponseSummaryTwoColumn = function(){
    compiler.wordDocElements.push({type:"title",content:"Free Response"})
    var free = compiler.stats.free;
    for(var i=0;i<free.length;i++){
        var question = free[i];
        $("#content").append("<hr>")
        $("#content").append("<h3 style='text-align:center;margin-top:10px'>"+ controller.freeQuestions[question.name] + "</h3>")
        compiler.wordDocElements.push({type:"subTitle",content: controller.freeQuestions[question.name]})
        $("#content").append("<div id='summaryRow"+i+"free' class='row'></div>");
        $("#summaryRow"+i+"free").append("<div id='summaryLeft"+i+"free' class='col-6'></div>")
        $("#summaryRow"+i+"free").append("<div id='summaryRight"+i+"free'  class='col-6'></div>")
        $("#summaryLeft"+i+ "free").append("<ul id='listLeft" + i + "free' style='margin-left:10px;margin-right:10px'>")
        $("#summaryRight"+i+ "free").append("<ul id='listRight" + i + "free' style='margin-left:10px;margin-right:10px'>")
        for(var ii=0;ii<question.responses.length;ii++){
            if(ii%2 == 0){
                $("#listLeft" + i + "free").append("<li>" +question.responses[ii]+ "</li>")
                compiler.wordDocElements.push({type:"text",content: question.responses[ii]})
            }
            else{
                $("#listRight" + i + "free").append("<li>" +question.responses[ii]+ "</li>")
                compiler.wordDocElements.push({type:"text",content: question.responses[ii]})
            }
        }

    }
    compiler.wordDocElements.push({type:"break",content: ""})
}


compiler.writeIndividualSummaryTwoColumn = function(prop){
    var data = compiler.stats[prop];
    var html = "";


    for(var i=0;i<data.length;i++){
        $("#content").append("<hr>")
        var type = prop.charAt(0).toUpperCase() + prop.slice(1, -1)
        $("#content").append("<h3 style='text-align:center;margin-top:10px'>"+type+": " + data[i].name + "</h3>")
        $("#content").append("<div id='summaryRow"+i+""+prop+"' class='row'></div>");
        $("#summaryRow"+i+""+prop).append("<div id='summaryLeft"+i+""+prop+"' class='col-6'></div>")
        $("#summaryRow"+i+""+prop).append("<div id='summaryRight"+i+""+prop+"'  class='col-6'></div>")

        
        var questions = data[i].responses
        for(var ii=0;ii<questions.length;ii++){
            var possibleAnswerText = controller.answers[prop][ii];
            if(possibleAnswerText[0] == "free"){
                $("#summaryRight"+i+ "" + prop).append("<p style='text-align:center'>"+questions[ii].question+"</p>")
                $("#summaryRight"+i+ "" + prop).append("<ul id='list" + i + ""+prop+"' style='margin-left:10px;margin-right:10px'>")
                compiler.addTextToWordDoc(questions[ii].question, false)
                for(var answer in questions[ii].responses){
                    $("#list" + i + ""+prop).append("<li>" +questions[ii].responses[answer]+ "</li>")
                    compiler.addTextToWordDoc(questions[ii].responses[answer], false)
                }

                
                
                
            }
            else{
                var labels = [];
                var datapoints = [];
                for(var iii=0;iii<possibleAnswerText.length;iii++){
                    labels.push(possibleAnswerText[iii])
                    datapoints.push(questions[ii].bins[iii] || 0);
                }    
                compiler.writeBarGraphTwoColumn(questions[ii].question, labels, datapoints, i, prop)
            }    
        }
    }

    compiler.addTextToWordDoc("", true)

    return html;

}


compiler.charts = [];

compiler.writeBarGraphTwoColumn = function(title, labels, datapoints, i, prop){
    var data = {
    labels: labels,
    datasets: [{
        axis: 'y',
        data: datapoints,
        fill: false,
        backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
        ],
        borderWidth: 1,

    }]
    };
    var id = uuidv4();

    $("#summaryLeft"+i+ "" + prop).append("<canvas id='"+id+"'></canvas>");

    var config = {
        type: 'bar',
        data,
        options: {
            indexAxis: 'y',    
            plugins: {
                title: {
                    display: true,
                    text: title
                },
                legend: {
                    display: false,
                }
            },
            scales: {
                xAxes: [{
                  ticks: {
                    beginAtZero: true,
                    callback: function(value) {if (value % 1 === 0) {return value;}}
                  }
                }]
              }
    
        }
      };
      var ctx = document.getElementById(id);
      console.log(id)
      ctx.height = 90;
    var myChart = new Chart(
        document.getElementById(id),
        config
      );

    compiler.charts.push(myChart);


}

compiler.compile = function(){
    compiler.stats = {free:[],events:[],briefs:[],exams:[]};
    var sample = compiler.data[0]

    //free response
    for(var q in sample.free){
        compiler.stats.free.push({name:q,responses:[]})
        for(var i=0;i<compiler.data.length;i++){
            compiler.stats.free[compiler.stats.free.length-1].responses.push(compiler.data[i].free[q])
        }
    }
    //events
    for(var i=0;i<sample.events.length;i++){
        var q = sample.events[i];
        compiler.stats.events.push({name:q.name,responses:[]});
        for(var ii=0;ii<q.responses.length;ii++){
            compiler.stats.events[i].responses.push({question:controller.eventQuestions[ii],responses:[],average:0});
            for(var iii=0;iii<compiler.data.length;iii++){
                compiler.stats.events[i].responses[ii].responses.push(compiler.data[iii].events[i].responses[ii]);
            }

        }
    }
    //briefs
    for(var i=0;i<sample.briefs.length;i++){
        var q = sample.briefs[i];
        compiler.stats.briefs.push({name:q.name,responses:[]});
        for(var ii=0;ii<q.responses.length;ii++){
            compiler.stats.briefs[i].responses.push({question:controller.briefQuestions[ii],responses:[],average:0});
            for(var iii=0;iii<compiler.data.length;iii++){
                compiler.stats.briefs[i].responses[ii].responses.push(compiler.data[iii].briefs[i].responses[ii]);
            }

        }
    }

    //exams
    for(var i=0;i<sample.exams.length;i++){
        var q = sample.exams[i];
        compiler.stats.exams.push({name:q.name,responses:[]});
        for(var ii=0;ii<q.responses.length;ii++){
            compiler.stats.exams[i].responses.push({question:controller.examQuestions[ii],responses:[],average:0});
            for(var iii=0;iii<compiler.data.length;iii++){
                compiler.stats.exams[i].responses[ii].responses.push(compiler.data[iii].exams[i].responses[ii]);
            }

        }
    }





    
}


compiler.summarize = function(){
    compiler.summarizeSingleType("events")
    compiler.summarizeSingleType("briefs")
    compiler.summarizeSingleType("exams")
}

compiler.summarizeSingleType = function(prop){
    var data = compiler.stats[prop];
    for(var i=0;i<data.length;i++){
        
        var questions = data[i].responses
        for(var ii=0;ii<questions.length;ii++){
            var bins = {};
            for(var iii=0;iii<questions[ii].responses.length;iii++){
                var response = questions[ii].responses[iii];
                if(bins.hasOwnProperty(response)){
                    bins[response] += 1;
                }
                else{
                    bins[response] = 1;
                }
            }
            data[i].responses[ii].bins = bins;            
        }
    }
}

compiler.upload = function (event) {
    compiler.data = [];
    if (event.target.files && event.target.files.length) {
        compiler.uploadedFiles = event.target.files
    }

    console.log(compiler.uploadedFiles)
    compiler.readFiles()

};

compiler.readFiles = function(){
    for(var i=0;i<compiler.uploadedFiles.length;i++){
        compiler.readFile(compiler.uploadedFiles[i])
    }

    compiler.checkForCompletion()
}

compiler.checkForCompletion = function(){
    setTimeout(function(){
        if(compiler.uploadedFiles.length == compiler.data.length){
            
            compiler.home();
        }
        else{
            compiler.checkForCompletion()
        }
    },1000)
}


compiler.readFile = function (file) {

    var fileReader = new FileReader()

    fileReader.readAsText(file);
    fileReader.onload = () => {
        var obj = fileReader.result
        try{
            compiler.data.push(JSON.parse(obj))
        }
        catch{
            console.log("this was not a valid file")
            console.log(file)
        }
        
    };
};

