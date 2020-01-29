/************************************************
 * more.js
 * Created at 2019. 12. 6. 오후 1:43:23.
 *
 * @author 성민
 ************************************************/

/**
 * UDC 컨트롤이 그리드의 뷰 모드에서 표시할 텍스트를 반환합니다.
 */
exports.getText = function(){
	// TODO: 그리드의 뷰 모드에서 표시할 텍스트를 반환하는 하는 코드를 작성해야 합니다.
	return "";
};



/*
 * Body에서 init 이벤트 발생 시 호출.
 * 앱이 최초 구성될 때 발생하는 이벤트 입니다.
 */
function onBodyInit(/* cpr.events.CEvent */ e){
	
}


/*
 * Body에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
	var hostApp = app.getHost();
	
	if(hostApp) {
		
		var hostAppProperty = app.getHostProperty("initValue");
		var voAllData = hostAppProperty["count"];
		app.lookup("dsCount").build(voAllData);
		app.lookup("grd1").redraw();
	} 
}
