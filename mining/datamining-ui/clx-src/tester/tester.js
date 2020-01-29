/************************************************
 * tester.js
 * Created at 2019. 12. 2. 오후 5:46:02.
 *
 * @author HANS
 ************************************************/
 //var util = createCommonUtil();
/*
 * "Button" 버튼(btn2)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn2Click(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn2 = e.control;
	
var showConstraint = {
			"position" : "absolute",
			"top" : "0",
			"bottom" : "0",
			"left" : "0",
			"right" : "0",
			"z-index" : "1000"
	};
	var udcs = new udc.loadmask("loadmasks");
	app.getContainer().addChild(udcs, showConstraint);
	
	app.lookup("sms1").send();
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onSms1SubmitSuccess(/* cpr.events.CSubmissionEvent */ e){
	/** 
	 * @type cpr.protocols.Submission
	 */
	var sms1 = e.control;
	
	app.getContainer().removeChild(app.lookup("loadmasks"));
}
