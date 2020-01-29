/************************************************
 * index.js
 * Created at 2019. 11. 21. 오후 2:52:08.
 *
 * @author 성민
 ************************************************/
var title;
/*
 * Body에서 init 이벤트 발생 시 호출.
 * 앱이 최초 구성될 때 발생하는 이벤트 입니다.
 * 탑10데이터 불러오기 
 * */
function onBodyInit( /* cpr.events.CEvent */ e) {
	var getRank = app.lookup("getRank");
	getRank.send();
	var grd = app.lookup("grd1");
	grd.redraw();
	var date = new Date();
	var dd = date.getDate();
	var mm = date.getMonth()+1; //January is 0!
	var yyyy = date.getFullYear();
	var day = yyyy + "년 " + mm + "월 " + dd + "일" + " 데이터";
	app.lookup("op_date").value = day;
	//alert(date);
}
/*
 * "검색" 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	var code = app.lookup("cmb1").value;
	title = app.lookup("cmb1").text;
	var dmComment = app.lookup("dmComment");
	var button = e.control;
	var getComment = app.lookup("getComment");
	if(code == null){
		alert("영화를 선택해 주세요");
	}
	else{
		dmComment.setValue("code", code);
	var showConstraint = {
			"position" : "absolute",
			"top" : "0",
			"bottom" : "0",
			"left" : "0",
			"right" : "0",
			"z-index" : "1000"
	};
	var udcs = new udc.loadmask("loadmasks");
	app.getContainer().floatControl(udcs, showConstraint);
	getComment.send();
	}
}


/*
 * 서브미션에서 submit-success 이벤트 발생 시 호출.
 * 통신이 성공하면 발생합니다.
 */
function onGetCommentSubmitSuccess( /* cpr.events.CSubmissionEvent */ e) {
	/** 
	 * @type cpr.protocols.Submission
	 */
	var getComment = e.control;
	var shl1 = app.lookup("shl1");
	var graphChart = configOption1("",app.lookup("dsJudge"),title);
	shl1.setAppProperty("option", graphChart);
	
	var vcDataSet = app.lookup("dsCount");
	var shl2 = app.lookup("shl2");
	var titlePlus = title + "에 관한 키워드";
	var piChart = configOption2(title,titlePlus,"",vcDataSet);
	shl2.setAppProperty("option", piChart);	
	app.lookup("loadmasks").visible = false;
	app.lookup("btn_exp").visible =true;
	app.lookup("opt_bum").visible=true;
	app.lookup("btn_more").visible=true;
}

/**
 * 파이차트를 그리기위한 옵션을 지정해주는 함수입니다. 프로토타입
 * @param {String} paramStringTitle 원제
 * @param {String} paramStringSubTitle 부제
 * @param {String} seriesName 시리즈명
 * @param {cpr.data.DataSet} paramDataSet 차트를 그릴 데이터를 담고있는 데이터셋
 * @param {String} paramMainColumnName 컬럼명
 */
//파이차트
function configOption2(paramStringTitle,paramStringSubTitle,seriesName, paramDataSet) {
			
	var voSeries = [];
	var vcDataSet = paramDataSet;
		
	var voColumnNames = vcDataSet.getColumnNames();
	
      var lastData = vcDataSet.getRowDataRanged(0,9);

	
		var options = {
			title : {
				text : paramStringTitle,
				subtext : paramStringSubTitle,
				x : 'center'
			},
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c}({d}%)"
			},
			 legend: {
				        type: 'scroll',
				        orient: 'vertical',
				        right: 10,
				        top: 20,
				        bottom: 20,
				        data: lastData.legendData,
				
				        selected: lastData.selected
				    },
			series : [
				{
					name : seriesName,
					type : 'pie',
					radius : "70%",
					center : ['50%', '60%'],
					data: lastData,
					itemStyle : {
						emphasis : {
							shadowBlur : 10,
							shadowOffsetX :0,
							shadowColor : 'rgba(0,0,0,0.5)'
						}
					}
					
				}
			]
			
		}
		return options;
}

/**
 * 쌍 막대그래프를 그리는 함수입니다. 프로토타입
 * @param {String} graphTitle
 * @param {cpr.data.DataSet} bindingDataSet
 */
function configOption1(graphTitle,bindingDataSet,paramStringTitle){ //막대
	
	var vcDataSet = bindingDataSet;
	
	var option = {
		title : {
				text : paramStringTitle,
				subtext : paramStringTitle+"  긍정 부정 판단",
				x : 'center'
			},
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            
	            type : 'shadow'        
	        }
	    },
	    legend: {
	        data:['반대','찬성']//'중립',
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    yAxis : [
	        {
	            type : 'category',
	            axisTick : {show: false},
	            data : [graphTitle]
	        }
	    ],
	    series : [
	//    	{
	//            name:'중립',
	//            type:'bar',
	//            stack: 'instantStack',
	//            label: {
	//                normal: {
	//                    show: true,
	//                    position: 'left'
	//                }
	//            },
	//            data:[vcDataSet.getValue(0,"center")]
	//        },
	       
	        {
	            name:'부정',
	            type:'bar',
	            stack: 'instantStack',
	            itemStyle : {
						emphasis : {
							shadowBlur : 10,
							shadowOffsetX :0,
							shadowColor : 'rgba(0,0,0,0.5)'
						}
					},
	            label: {
	                normal: {
	                    show: true,
	                    position: 'left'
	                }
	            },
	            data:[vcDataSet.getValue(0, "bad") * -1]
	        },
	         {
	            name:'긍정',
	            type:'bar',
	            stack: 'instantStack',
	            itemStyle : {
						emphasis : {
							shadowBlur : 10,
							shadowOffsetX :0,
							shadowColor : 'rgba(0,0,0,0.5)'
						}
					},
	            label: {
	                normal: {
	                    show: true,
	                    position : "right"
	                }
	            },
	            data:[vcDataSet.getValue(0, "good")]
	        }
    ]
};

return option;
}


/*
 * "자세히.." 버튼에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onButtonClick3(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var button = e.control;
	var properties = {width : 400, height : 300};
	
	app.openDialog("udc/more", properties, function(dialog){
		dialog.htmlAttr("print","true");
		dialog.headerTitle = "자세히..";
		
		var voAllData = app.lookup("dsCount").getRowDataRanged();
		dialog.ready(function(dialogApp){
			// 필요한 경우, 다이얼로그의 앱이 초기화 된 후, 앱 속성을 전달하십시오.
			dialogApp.initValue = {
				"count" : voAllData
			}
		});
	}).then(function(returnValue){
		
	});
}


/*
 * "예시" 버튼(btn_exp)에서 click 이벤트 발생 시 호출.
 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
 */
function onBtn_expClick(/* cpr.events.CMouseEvent */ e){
	/** 
	 * @type cpr.controls.Button
	 */
	var btn_exp = e.control;
	var properties = {width : 400, height : 300};
	
	app.openDialog("udc/judgeExample", properties, function(dialog){
		dialog.htmlAttr("print","true");
		dialog.headerTitle = "긍 부정 판단 예시";
		dialog.ready(function(dialogApp){
			// 필요한 경우, 다이얼로그의 앱이 초기화 된 후, 앱 속성을 전달하십시오.
			dialogApp.initValue = properties;
		});
	}).then(function(returnValue){
		
	});
}
