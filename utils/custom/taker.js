
var taker = {};
taker.homeButton = function(){
    $("#takerInput").click();
}

taker.home = function(){
    taker.upload();
    setTimeout(function(){
        taker.drawTest();
    },2000)
    
}

taker.drawTest = function(){
    var html = "here we go"
    $("#content").html(html)
}


taker.upload = function() {
    var files = document.getElementById('takerInput').files;
    if (files.length <= 0) {
        return false;
    }

    var fr = new FileReader();

    fr.onload = function(e) { 
    
        var result = JSON.parse(e.target.result);
        taker.form = result;
    }

    fr.readAsText(files.item(0));
};

taker.saveAndDownload = function(){
    taker.saveAnswers();
    var exportObj = taker.form


    var exportName = "completedFeedback" + uuidv4()
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
}

taker.saveAnswers = function(){
    var inputs = $("input")
    var textAreas = $("textarea")
    var selects = $("select")
    taker.form.free = {};
    console.log(inputs)
    console.log(textAreas)
    console.log(selects)
    for(var i=0;i<selects.length;i++){
        var id = $(selects[i]).attr('id')
        var val = $(selects[i]).val();

        var identity = id.split("-")
        var type = identity[0];//briefs, events, exams, free
        var questionId = identity[1];
        if(type == "free"){
            taker.form.free[questionId] = val;
        }
        else{
            var index = identity[2];
            taker.form[type][index].responses[questionId] = val;
        }

    }
    for(var i=0;i<textAreas.length;i++){
        var id = $(textAreas[i]).attr('id')
        var val = $(textAreas[i]).val();

        var identity = id.split("-")
        var type = identity[0];//briefs, events, exams, free
        var questionId = identity[1];
        if(type == "free"){
            taker.form.free[questionId] = val;
        }
        else{
            var index = identity[2];
            taker.form[type][index].responses[questionId] = val;
        }

    }
}


taker.addDemographics = function(){
    var html = `<h3 class="m-5 mb-0 w-50">Demographics</h3>
        <div class="form-group m-5 mt-1 w-50 free">
            <label>What is your primary designation?</label>
            <select class="form-control" id="free-role" >
                <option value="nfo">NFO</option>
                <option value="awo">AWO</option>
                <option value="ewo">EWO</option>
                <option value="pilot">Pilot</option>
            </select>
        </div>`
    return html;
}

taker.drawTest = function(){
    var html = `<div>`
        html += taker.addDemographics("What is your designation?","free-role")
        for(var i=0;i<taker.form.briefs.length;i++){
            html += taker.createBriefQuestions(i);
        }
        if(taker.form.briefs.length > 1){
            html += taker.createFreeResponseQuestion("What was the most beneficial brief, why?","free-mostBeneficialBrief")
            html += taker.createFreeResponseQuestion("What was the least beneficial brief, why?","free-leastBeneficialBrief")
            html += taker.createFreeResponseQuestion("What changes can be implemented to make these briefs better for the next class?","free-changeBriefs")
        }
        for(var i=0;i<taker.form.events.length;i++){
            html += taker.createEventQuestions(i);
        }
        if(taker.form.events.length > 1){
            html += taker.createFreeResponseQuestion("What was the most beneficial event, why?","free-mostBeneficialEvent")
            html += taker.createFreeResponseQuestion("What was the least beneficial event, why?","free-leastBeneficialEvent")
            html += taker.createFreeResponseQuestion("What changes can be implemented to make these events better for the next class?","free-changeEvents")
        }

        html += taker.createExamQuestions();
        if(taker.form.exams.length > 0){
            html += taker.createFreeResponseQuestion("Do you feel the material covered this week prepared you effectively for the exams?","free-preparedExams")
            html += taker.createFreeResponseQuestion("What can we do to increase your performance?","free-improvePerf")
        }
        html += "<button class='btn btn-primary m-3' onclick='taker.saveAndDownload()'>Save and Download</button>"

    html += "</div>"

    $("#content").html(html);

    taker.fillInPreviousData();
}


taker.fillInPreviousData = function(){
    taker.fillInType("events")
    taker.fillInType("briefs")
    taker.fillInType("exams")
    taker.fillInFree()
}

taker.fillInFree = function(){
    var data = taker.form.free;
    for(var label in data){
        var id = "#free-" + label;
        $(id).val(data[label])
    }
}

taker.fillInType = function(prop){
    var data = taker.form[prop];
    for(var i=0;i<data.length;i++){
        var responses = data[i].responses;
        for(var ii=0;ii<responses.length;ii++){
            $("#" + prop + "-" + ii + "-" + i).val(responses[ii]);
        }
    }
}

taker.addQualityOptions = function(){
    var html = `
        <option value=5>Excellent</option>
        <option value=4>Good</option>
        <option value=3>Neutral</option>
        <option value=2>Poor</option>
        <option value=1>Very Poor</option>
        <option value=0>N/A</option>
    `

    return html;
}

taker.addAgreeOptions = function(){
    var html = `
        <option value=5>Strongly Agree</option>
        <option value=4>Agree</option>
        <option value=3>Neither Agree nor Disagree</option>
        <option value=2>Disagree</option>
        <option value=1>Strongly Disagree</option>
        <option value=0>N/A</option>
    `

    return html;
}


taker.addPreparedOptions = function(){
    var html = `
        <option value=5>Prepared</option>
        <option value=4>Moderately Prepared</option>
        <option value=3>Neutral</option>
        <option value=2>Slightly Unprepared</option>
        <option value=1>Unprepared</option>
        <option value=0>N/A</option>
    `

    return html;
}


taker.createBriefQuestions = function(index){
    var q = taker.form.briefs[index]
    var html = `
    <div class='m-5 w-50 brief'>
        <h3>Please rate the quality of the ${q.name} brief</h3>
        <div class="form-group">
            <label>Quality of Instruction</label>
            <select class="form-control" id="briefs-0-${index}" >
                ${taker.addQualityOptions()}
            </select>
        </div>
        <div class="form-group">
            <label>Relevance of Material</label>
            <select class="form-control" id="briefs-1-${index}" >
                ${taker.addQualityOptions()}
            </select>
        </div>
        <div class="form-group">
            <label>Organization of Course</label>
            <select class="form-control" id="briefs-2-${index}" >
                ${taker.addQualityOptions()}
            </select>
        </div>
        <div class="form-group">
            <label>Overall Evaluation</label>
            <select class="form-control" id="briefs-3-${index}" >
                ${taker.addQualityOptions()}
            </select>
        </div>
        <div class="form-group">
            <label>Did this material conflict with anything you've been taught previously?</label>
            <select class="form-control" id="briefs-4-${index}" >
                <option value=1>Yes</option>
                <option value=0>No</option>
            </select>
        </div>
        <div class="form-group">
            <label>Any additional comments concerning the ${q.name} brief?</label>
            <textarea class="form-control" id="briefs-5-${index}" ></textarea>
        </div>
    </div>
    <hr>
    `
    return html;
}


taker.createExamQuestions = function(){
    var html = `
    <div class='m-5 w-50 exam'>
        <h3>Please rate your preparedness for the following exams</h3>`
        for(var i=0;i<taker.form.exams.length;i++){
        html += `
            <div class="form-group">
                <label>${taker.form.exams[i].name}</label>
                <select class="form-control" id="exams-0-${i}" >
                    ${taker.addPreparedOptions()}
                </select>
            </div>`
        }
    html += `</div>
    <hr>
    `
    return html;
}

taker.createEventQuestions = function(index){
    var q = taker.form.events[index]
    var html = `
    <div class='m-5 w-50 event'>
        <h3>Please rate the quality of the ${q.name} event</h3>
        <div class="form-group">
            <label>I was prepared for the event</label>
            <select class="form-control" id="events-0-${index}" >
                ${taker.addAgreeOptions()}
            </select>
        </div>
        <div class="form-group">
            <label>My grade is an accurate reflection of my performance</label>
            <select class="form-control" id="events-1-${index}" >
                ${taker.addAgreeOptions()}
            </select>
        </div>
        <div class="form-group">
            <label>The objectives were clearly indicated</label>
            <select class="form-control" id="events-2-${index}" >
                ${taker.addAgreeOptions()}
            </select>
        </div>
        <div class="form-group">
            <label>This scenario successfully enhanced my tactical skills and knowledge</label>
            <select class="form-control" id="events-3-${index}" >
                ${taker.addAgreeOptions()}
            </select>
        </div>
        <div class="form-group">
            <label>Any additional comments concerning the ${q.name} event?</label>
            <textarea class="form-control" id="events-4-${index}" ></textarea>
        </div>
    </div>
    <hr>
    `
    return html;
}



taker.createFreeResponseQuestion = function(content,id){
    var html = `
    <div class='m-5 w-50 free'>
        <div class="form-group">
            <label>${content}</label>
            <textarea class="form-control" id="${id}" ></textarea>
        </div>
    </div>
    <hr>
    `
    return html;
}