var creator = {};

creator.events = [];
creator.briefs = [];



creator.home = function(){
    var html = `
    <button class="m-5 btn btn-primary col-3" onclick="creator.askForEvents()">Add Events</button>
    <button class="m-5 btn btn-primary col-3" onclick="creator.askForBriefs()">Add Briefs</button>
    <button class="m-5 btn btn-primary col-3" onclick="creator.askForExams()">Add Exams</button>
    <button class="m-5 btn btn-secondary col-3" onclick="creator.download()">Download</button>
    <button class="m-5 btn btn-secondary col-3" onclick="controller.home()">Go Back</button>
    `
    $("#content").html(html)
}

creator.askForEvents = function(){
    var html = `

        <div id="eventArea">
            

        </div>
        <button class='btn btn-primary' onclick='creator.addEvent()'>Add Event</button><button class='btn btn-primary' onclick='creator.saveEvents()'>Confirm</button>
    `
    $("#content").html(html)
    creator.fillInPreviousEvents()
}

creator.fillInPreviousEvents = function(){
    for(var i=0;i<creator.events.length;i++){
        creator.addEvent(creator.events[i]);
    }
}

creator.saveEvents = function(){
    creator.events = []
    var events = $(".eventInputs");
    for(let i=0;i<events.length;i++){
        creator.events.push($(events[i]).val())
    }
    creator.home();

}

creator.addEvent = function(content){
    var currentEvents = $("#eventArea").children().length;
    html = `
    <div class="row eventRow m-3 p-3" id="row${currentEvents}">
        <div class="mb-3 col-6">
            <label class="form-label">Event Name</label>
            <input type="text" class="form-control eventInputs" id="event${currentEvents}">
        </div>
        <button class="btn btn-danger col-3" onclick="creator.deleteRow('${currentEvents}')">Delete</button>
    </div>`
    $("#eventArea").append(html);
    if(content)
        $(`#event${currentEvents}`).val(content)
    
}

creator.deleteRow = function(num){
    $("#row" + num).remove();
}



creator.briefs = []
creator.askForBriefs = function(){
    var html = `
        <div id="briefArea">
            

        </div>
        <button class='btn btn-primary' onclick='creator.addBrief()'>Add Brief</button><button class='btn btn-primary' onclick='creator.saveBriefs()'>Confirm</button>
    `
    $("#content").html(html)
    creator.fillInPreviousBriefs();
}


creator.fillInPreviousBriefs = function(){
    for(var i=0;i<creator.briefs.length;i++){
        creator.addBrief(creator.briefs[i]);
    }
}

creator.saveBriefs = function(){
    creator.briefs = []
    var briefs = $(".briefInputs");
    for(let i=0;i<briefs.length;i++){
        creator.briefs.push($(briefs[i]).val())
    }
    creator.home();
}

creator.addBrief = function(content){
    var currentBriefs = $("#briefArea").children().length;
    html = `
    <div class="row briefRow m-3 p-3" id="row${currentBriefs}">
        <div class="mb-3 col-6">
            <label class="form-label">Brief Name</label>
            <input type="text" class="form-control briefInputs" id="brief${currentBriefs}">
        </div>
        <button class="btn btn-danger col-3" onclick="creator.deleteRow('${currentBriefs}')">Delete</button>
    </div>`
    $("#briefArea").append(html);
    if(content)
        $(`#brief${currentBriefs}`).val(content)
    
}

creator.exams = []
creator.askForExams = function(){
    var html = `
        <div id="examArea">
            

        </div>
        <button class='btn btn-primary' onclick='creator.addExam()'>Add Exam</button><button class='btn btn-primary' onclick='creator.saveExams()'>Confirm</button>
    `
    $("#content").html(html)
    creator.fillInPreviousExams()
}

creator.fillInPreviousExams = function(){
    for(var i=0;i<creator.exams.length;i++){
        creator.addExam(creator.exams[i]);
    }
}

creator.saveExams = function(){
    creator.exams = []
    var exams = $(".examInputs");
    for(let i=0;i<exams.length;i++){
        creator.exams.push($(exams[i]).val())
    }
    creator.home();
}

creator.addExam = function(content){
    var currentExams = $("#examArea").children().length;
    html = `
    <div class="row examRow m-3 p-3" id="row${currentExams}">
        <div class="mb-3 col-6">
            <label class="form-label">Exam Name</label>
            <input type="text" class="form-control examInputs" id="exam${currentExams}">
        </div>
        <button class="btn btn-danger col-3" onclick="creator.deleteRow('${currentExams}')">Delete</button>
    </div>`
    $("#examArea").append(html);
    if(content)
        $(`#exam${currentExams}`).val(content)
    
}


creator.download = function(){
    var exportObj = {events:[],briefs:[],exams:[]};
    for(var i=0;i<creator.events.length;i++){
        var event = {name:creator.events[i],responses:[]};
        exportObj.events.push(event)
    }
    for(var i=0;i<creator.briefs.length;i++){
        var brief = {name:creator.briefs[i],responses:[]};
        exportObj.briefs.push(brief)
    }
    for(var i=0;i<creator.exams.length;i++){
        var exam = {name:creator.exams[i],responses:[]};
        exportObj.exams.push(exam)
    }

    var exportName = "feedbackTemplate"
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
