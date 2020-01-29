/************************************************
 * echartShell.js
 * Created at 2019. 9. 4. 오후 7:12:45.
 *
 * @author HANS
 ************************************************/

/**
 * UDC 컨트롤이 그리드의 뷰 모드에서 표시할 텍스트를 반환합니다.
 */
exports.getText = function(){
	// TODO: 그리드의 뷰 모드에서 표시할 텍스트를 반환하는 하는 코드를 작성해야 합니다.
	return "";
};



/*
 * 쉘에서 init 이벤트 발생 시 호출.
 */
function onShl1Init(/* cpr.events.CUIEvent */ e){
	/** 
	 * @type cpr.controls.UIControlShell
	 */
	var uIControlShell = e.control;
	// chart가 새로 그려지기 전에 기존에 echart 관련 객체가 있으면 삭제한다.
	var shellDiv = e.content;
	if(shellDiv){
		var instance = echarts.getInstanceByDom(shellDiv);
		if(instance){
			instance.dispose();
		}
	}
	if(!e.content){
		window.addEventListener("resize",function(){resizeChart()});
	}
}

var myChart = null;
function resizeChart(){
	if(myChart){
		myChart.resize();
	}
}



/*
 * 쉘에서 load 이벤트 발생 시 호출.
 */
function onShl1Load(/* cpr.events.CUIEvent */ e){
	/** 
	 * @type cpr.controls.UIControlShell
	 */
	var uIControlShell = e.control;
	// div에 echart를 입히는 코드
	var shellDiv = e.content;
	if(!shellDiv){
		return;
	}
	myChart = echarts.init(shellDiv);
	myChart.resize();
	//차트에 들어가는 데이터나 x,y축에 대한 정보 등등을 작성할 수 있습니다.
	
//	var vcDataSet = app.getAppProperty("dataSetId");
//	
//	var option = {
//		title : {
//			text : 'ECharts 연동 예제'
//		},
//		tooltip : {},
//		legend : {
//			data : [ 'Sales' , 'Marketing', "R&D"]
//		},
//		xAxis : {
//			data : [ "shirt", "cardign", "chiffon shirt", "pants", "heels", "socks" ]
//		},
//		yAxis : {},
//		series : [ {
//			name : 'Sales',
//			type : 'bar',
//			data : [ 5, 20, 36, 10, 10, 20 ]
//		},
//		{
//			name : 'Marketing',
//			type : 'line',
//			data : [ 15, 25, 20, 25, 24, 40 ]
//		},
//		{
//			name : 'R&D',
//			type : 'bar',
//			data : [ 15, 20, 35, 33, 40, 35 ]
//		}]
//	};
//	myChart.setOption(option);
}


/*
 * 쉘에서 dispose 이벤트 발생 시 호출.
 * 컨트롤이 dispose될 때 호출되는 이벤트.
 */
function onShl1Dispose(/* cpr.events.CEvent */ e){
	window.removeEventListener("resize",resizeChart);
	myChart = null;
	
}


/*
 * Body에서 load 이벤트 발생 시 호출.
 * 앱이 최초 구성된후 최초 랜더링 직후에 발생하는 이벤트 입니다.
 */
function onBodyLoad(/* cpr.events.CEvent */ e){
}


/*
 * Body에서 init 이벤트 발생 시 호출.
 * 앱이 최초 구성될 때 발생하는 이벤트 입니다.
 */
function onBodyInit(/* cpr.events.CEvent */ e){
	
}


/*
 * Body에서 property-change 이벤트 발생 시 호출.
 * 앱의 속성이 변경될 때 발생하는 이벤트 입니다.
 */
function onBodyPropertyChange(/* cpr.events.CPropertyChangeEvent */ e){
	
//	console.log("property-change");

	if(e.property == "option") {
		
		myChart.setOption(app.getAppProperty("option"));
	}
}
