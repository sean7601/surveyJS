var controller = {}

controller.home = function(){
    var html = `
    <nav><h1 style="margin-left:40px">MPRWS Survey App</h1></nav>
    <button class="m-5 btn btn-primary col-3" onclick="taker.homeButton()">Take</button>
    <input type=file id="takerInput" onchange="taker.home()" hidden></input>
    <button class="m-5 btn btn-secondary col-3" onclick="creator.home()">Create</button>
    <button class="m-5 btn btn-secondary col-3" onclick="compiler.homeButton()">Compile</button>
    <input  style='visibility:hidden;width:0px;height:0px' type='file'  id='compilerUpload' webkitdirectory mozdirectory></input>
    `
    $("#content").html(html)
}


            


controller.examQuestions = ["how prepared were you"]
controller.briefQuestions = ["Quality Of Instructions","Relevance of Material","Organization of Course","Overall Evaluation","Did this material conflict with anything you have been taught previously","additional comments"]
controller.eventQuestions = ["I was prepared for the event", "My grade is an accurate reflection of my performance", "The objectives were clearly indicated", "This scenario successfully enhanced my tactical skills and knowledge", "additional comments"]
controller.freeQuestions = {}
controller.freeQuestions["mostBeneficialBrief"] = "What was the most beneficial brief, why?";
controller.freeQuestions["leastBeneficialBrief"] = "What was the least beneficial brief, why?";
controller.freeQuestions["changeBriefs"] = "What changes can be implemented to make these briefs better for the next class?";
controller.freeQuestions["mostBeneficialEvent"] = "What was the most beneficial event, why?";
controller.freeQuestions["leastBeneficialEvent"] = "What was the least beneficial event, why?";
controller.freeQuestions["changeEvents"] = "What changes can be implemented to make these events better for the next class?";

controller.freeQuestions["preparedExams"] = "Do you feel the material covered this week prepared you effectively for the exams?"
controller.freeQuestions["improvePerf"] = "What can we do to increase your performance?"
controller.freeQuestions["role"] = "What is your primary designation?"


controller.preparedOptions = ["N/A","Uprepared","Slightly Unprepared", "Neutral", "Moderately Prepared", "Prepared"]
controller.agreeOptions = ["N/A","Strongly Disagree", "Disagree", "Neither Agree nor Disagree", "Agree", "Strong Agree"]
controller.qualityOptions = ["N/A", "Very Poor", "Poor", "Neutral", "Good", "Excellent"]
controller.yesNoOptions = ["No", "Yes"]
controller.freeOptions = ["free"]

controller.answers = {}
controller.answers.exams = [controller.preparedOptions]
controller.answers.briefs = [controller.qualityOptions,controller.qualityOptions,controller.qualityOptions,controller.qualityOptions,controller.yesNoOptions,controller.freeOptions]
controller.answers.events = [controller.agreeOptions,controller.agreeOptions,controller.agreeOptions,controller.agreeOptions,controller.freeOptions]


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }