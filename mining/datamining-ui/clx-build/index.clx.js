/*
 * App URI: index
 * Source Location: index.clx
 *
 * This file was generated by eXbuilder6 compiler, Don't edit manually.
 */
(function(){
	var app = new cpr.core.App("index", {
		onPrepare: function(loader){
		},
		onCreate: function(/* cpr.core.AppInstance */ app, exports){
			var linker = {};
			// Start - User Script
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
			};
			// End - User Script
			
			// Header
			var dataSet_1 = new cpr.data.DataSet("dsRank");
			dataSet_1.parseData({
				"columns" : [
					{"name": "movie"},
					{"name": "href"}
				]
			});
			app.register(dataSet_1);
			
			var dataSet_2 = new cpr.data.DataSet("dsJudge");
			dataSet_2.parseData({
				"columns" : [
					{"name": "good"},
					{"name": "bad"},
					{"name": "center"}
				]
			});
			app.register(dataSet_2);
			
			var dataSet_3 = new cpr.data.DataSet("dsCount");
			dataSet_3.parseData({
				"sortCondition": "value desc\r\n",
				"columns": [
					{
						"name": "value",
						"dataType": "expression",
						"displayOnly": true,
						"expression": "Number(val2)"
					},
					{"name": "name"},
					{
						"name": "val2",
						"dataType": "string",
						"displayOnly": false
					}
				]
			});
			app.register(dataSet_3);
			
			var dataSet_4 = new cpr.data.DataSet("dsTicket");
			dataSet_4.parseData({
				"columns" : [
					{"name": "rank"},
					{"name": "actor"}
				]
			});
			app.register(dataSet_4);
			
			var dataSet_5 = new cpr.data.DataSet("dsActor");
			dataSet_5.parseData({
				"columns" : [
					{"name": "rank"},
					{"name": "actor"}
				]
			});
			app.register(dataSet_5);
			var dataMap_1 = new cpr.data.DataMap("dmComment");
			dataMap_1.parseData({
				"columns" : [{"name": "code"}]
			});
			app.register(dataMap_1);
			var submission_1 = new cpr.protocols.Submission("getRank");
			submission_1.action = "../dtctl/getRank.do";
			submission_1.addRequestData(dataSet_1);
			submission_1.addRequestData(dataSet_5);
			submission_1.addRequestData(dataSet_4);
			submission_1.addResponseData(dataSet_1, true);
			submission_1.addResponseData(dataSet_5, false);
			submission_1.addResponseData(dataSet_4, false);
			app.register(submission_1);
			
			var submission_2 = new cpr.protocols.Submission("getComment");
			submission_2.action = "../dtctl/getComment.do";
			submission_2.async = true;
			submission_2.addRequestData(dataMap_1);
			submission_2.addRequestData(dataSet_3);
			submission_2.addRequestData(dataSet_2);
			submission_2.addResponseData(dataSet_3, false);
			submission_2.addResponseData(dataSet_2, false);
			if(typeof onGetCommentBeforeSubmit == "function") {
				submission_2.addEventListener("before-submit", onGetCommentBeforeSubmit);
			}
			if(typeof onGetCommentSubmitSuccess == "function") {
				submission_2.addEventListener("submit-success", onGetCommentSubmitSuccess);
			}
			if(typeof onGetCommentSubmitLoadProgress == "function") {
				submission_2.addEventListener("submit-load-progress", onGetCommentSubmitLoadProgress);
			}
			app.register(submission_2);
			
			app.supportMedia("all and (min-width: 1920px)", "new-screen");
			app.supportMedia("all and (min-width: 1024px) and (max-width: 1919px)", "default");
			app.supportMedia("all and (min-width: 500px) and (max-width: 1023px)", "tablet");
			app.supportMedia("all and (max-width: 499px)", "mobile");
			
			// Configure root container
			var container = app.getContainer();
			container.style.css({
				"background-image" : "none",
				"color" : "#231919",
				"background-color" : "white",
				"width" : "100%",
				"top" : "0px",
				"height" : "100%",
				"left" : "0px"
			});
			
			// Layout
			var formLayout_1 = new cpr.controls.layouts.FormLayout();
			formLayout_1.horizontalMargin = "20px";
			formLayout_1.verticalMargin = "10px";
			formLayout_1.horizontalSpacing = "1px";
			formLayout_1.verticalSpacing = "0px";
			formLayout_1.setColumns(["356px", "1fr", "300px"]);
			formLayout_1.setColumnAutoSizing(1, true);
			formLayout_1.setRows(["50px", "1fr"]);
			container.setLayout(formLayout_1);
			
			// UI Configuration
			var group_1 = new cpr.controls.Container();
			group_1.style.css({
				"background-color" : "white",
				"background-image" : "none"
			});
			// Layout
			var xYLayout_1 = new cpr.controls.layouts.XYLayout();
			group_1.setLayout(xYLayout_1);
			(function(container){
				var grid_1 = new cpr.controls.Grid("grd1");
				grid_1.readOnly = true;
				grid_1.init({
					"dataSet": app.lookup("dsRank"),
					"autoRowHeight": "all",
					"vScroll": "hidden",
					"autoFit": "all",
					"columns": [
						{"width": "51px"},
						{"width": "204px"}
					],
					"header": {
						"rows": [{"height": "24px"}],
						"cells": [
							{
								"constraint": {"rowIndex": 0, "colIndex": 0},
								"configurator": function(cell){
									cell.targetColumnName = "movie";
									cell.text = "순위";
									cell.style.setClasses(["header"]);
									cell.style.css({
										"background-color" : "#626262",
										"color" : "white",
										"background-image" : "none"
									});
								}
							},
							{
								"constraint": {"rowIndex": 0, "colIndex": 1},
								"configurator": function(cell){
									cell.targetColumnName = "href";
									cell.text = "영화제목";
									cell.style.setClasses(["header"]);
									cell.style.css({
										"background-color" : "#626262",
										"color" : "white",
										"background-image" : "none"
									});
								}
							}
						]
					},
					"detail": {
						"rows": [{"height": "24px"}],
						"cells": [
							{
								"constraint": {"rowIndex": 0, "colIndex": 0},
								"configurator": function(cell){
									cell.columnType = "rowindex";
								}
							},
							{
								"constraint": {"rowIndex": 0, "colIndex": 1},
								"configurator": function(cell){
									cell.columnName = "movie";
								}
							}
						]
					}
				});
				grid_1.style.css({
					"background-color" : "white",
					"color" : "black",
					"font-family" : "@HY견고딕",
					"background-image" : "none"
				});
				container.addChild(grid_1, {
					"top": "20px",
					"right": "10px",
					"bottom": "49px",
					"left": "10px"
				});
			})(group_1);
			container.addChild(group_1, {
				"colIndex": 0,
				"rowIndex": 1,
				"colSpan": 1,
				"rowSpan": 1
			});
			
			var group_2 = new cpr.controls.Container();
			group_2.style.css({
				"background-color" : "white",
				"background-image" : "none"
			});
			// Layout
			var xYLayout_2 = new cpr.controls.layouts.XYLayout();
			group_2.setLayout(xYLayout_2);
			(function(container){
				var comboBox_1 = new cpr.controls.ComboBox("cmb1");
				comboBox_1.placeholder = "우측 화살표를 눌러 원하는 영화를 선택해 주세요.";
				comboBox_1.style.css({
					"border-right-style" : "solid-2pt-",
					"border-bottom-color" : "#36d136",
					"border-left-style" : "solid-2pt-",
					"border-left-color" : "#36d136",
					"border-top-color" : "#36d136",
					"border-right-color" : "#36d136",
					"border-bottom-style" : "solid-2pt-",
					"border-top-style" : "solid-2pt-"
				});
				(function(comboBox_1){
					comboBox_1.setItemSet(app.lookup("dsRank"), {
						label: "movie",
						value: "href",
						icon: null,
						tooltip : null
					})
				})(comboBox_1);
				container.addChild(comboBox_1, {
					"top": "20px",
					"right": "111px",
					"left": "10px",
					"height": "40px"
				});
				var button_1 = new cpr.controls.Button();
				button_1.value = "검색";
				button_1.style.css({
					"background-color" : "#36d136",
					"border-radius" : "0px",
					"color" : "#efefef",
					"border-bottom-color" : "#36d136",
					"border-left-color" : "#36d136",
					"border-top-color" : "#36d136",
					"font-family" : "@DFKai-SB",
					"border-right-color" : "#36d136",
					"background-image" : "none"
				});
				if(typeof onButtonClick == "function") {
					button_1.addEventListener("click", onButtonClick);
				}
				container.addChild(button_1, {
					"top": "20px",
					"right": "10px",
					"width": "91px",
					"height": "40px"
				});
				var userDefinedControl_1 = new udc.ChartShell("shl1");
				userDefinedControl_1.style.css({
					"background-color" : "#ebebeb",
					"color" : "white",
					"background-image" : "none"
				});
				container.addChild(userDefinedControl_1, {
					"top": "70px",
					"right": "10px",
					"left": "10px",
					"height": "195px"
				});
				var userDefinedControl_2 = new udc.ChartShell("shl2");
				userDefinedControl_2.style.css({
					"background-color" : "#ebebeb",
					"color" : "white",
					"font-family" : "color",
					"background-image" : "none"
				});
				container.addChild(userDefinedControl_2, {
					"top": "264px",
					"right": "10px",
					"bottom": "49px",
					"left": "10px"
				});
				var button_2 = new cpr.controls.Button("btn_more");
				button_2.value = "자세히..";
				button_2.visible = false;
				button_2.style.css({
					"border-radius" : "5px"
				});
				if(typeof onButtonClick3 == "function") {
					button_2.addEventListener("click", onButtonClick3);
				}
				container.addChild(button_2, {
					"right": "20px",
					"bottom": "67px",
					"width": "100px",
					"height": "20px"
				});
				var output_1 = new cpr.controls.Output("opt_bum");
				output_1.value = "";
				output_1.visible = false;
				output_1.style.css({
					"background-image" : "url('image/ex2.jpg')"
				});
				container.addChild(output_1, {
					"top": "90px",
					"left": "20px",
					"width": "100px",
					"height": "20px"
				});
				var button_3 = new cpr.controls.Button("btn_exp");
				button_3.value = "예시";
				button_3.visible = false;
				button_3.style.css({
					"border-radius" : "5px"
				});
				if(typeof onBtn_expClick == "function") {
					button_3.addEventListener("click", onBtn_expClick);
				}
				container.addChild(button_3, {
					"top": "90px",
					"right": "23px",
					"width": "100px",
					"height": "20px"
				});
			})(group_2);
			container.addChild(group_2, {
				"colIndex": 1,
				"rowIndex": 1,
				"colSpan": 1,
				"rowSpan": 1
			});
			
			var group_3 = new cpr.controls.Container();
			group_3.style.css({
				"background-color" : "white",
				"background-image" : "none"
			});
			// Layout
			var xYLayout_3 = new cpr.controls.layouts.XYLayout();
			group_3.setLayout(xYLayout_3);
			(function(container){
				var grid_2 = new cpr.controls.Grid("grd2");
				grid_2.readOnly = true;
				grid_2.init({
					"dataSet": app.lookup("dsActor"),
					"vScroll": "hidden",
					"columns": [
						{"width": "67px"},
						{"width": "124px"}
					],
					"header": {
						"rows": [{"height": "24px"}],
						"cells": [
							{
								"constraint": {"rowIndex": 0, "colIndex": 0},
								"configurator": function(cell){
									cell.targetColumnName = "rank";
									cell.filterable = false;
									cell.sortable = false;
									cell.text = "순위";
									cell.style.setClasses(["header"]);
									cell.style.css({
										"background-color" : "#626262",
										"color" : "white",
										"background-image" : "none"
									});
								}
							},
							{
								"constraint": {"rowIndex": 0, "colIndex": 1},
								"configurator": function(cell){
									cell.targetColumnName = "actor";
									cell.filterable = false;
									cell.sortable = false;
									cell.text = "배우이름";
									cell.style.setClasses(["header"]);
									cell.style.css({
										"background-color" : "#626262",
										"color" : "white",
										"background-image" : "none"
									});
								}
							}
						]
					},
					"detail": {
						"rows": [{"height": "24px"}],
						"cells": [
							{
								"constraint": {"rowIndex": 0, "colIndex": 0},
								"configurator": function(cell){
									cell.columnName = "rank";
								}
							},
							{
								"constraint": {"rowIndex": 0, "colIndex": 1},
								"configurator": function(cell){
									cell.columnName = "actor";
								}
							}
						]
					}
				});
				grid_2.style.css({
					"background-color" : "white",
					"color" : "black",
					"font-family" : "@HY견고딕",
					"background-image" : "none"
				});
				container.addChild(grid_2, {
					"bottom": "245px",
					"left": "10px",
					"width": "280px",
					"height": "145px"
				});
				var grid_3 = new cpr.controls.Grid("grd3");
				grid_3.readOnly = true;
				grid_3.init({
					"dataSet": app.lookup("dsTicket"),
					"vScroll": "hidden",
					"columns": [
						{"width": "65px"},
						{"width": "113px"}
					],
					"header": {
						"rows": [{"height": "24px"}],
						"cells": [
							{
								"constraint": {"rowIndex": 0, "colIndex": 0},
								"configurator": function(cell){
									cell.targetColumnName = "rank";
									cell.filterable = false;
									cell.sortable = false;
									cell.text = "순위";
									cell.style.setClasses(["header"]);
									cell.style.css({
										"background-color" : "#626262",
										"color" : "white",
										"background-image" : "none"
									});
								}
							},
							{
								"constraint": {"rowIndex": 0, "colIndex": 1},
								"configurator": function(cell){
									cell.targetColumnName = "actor";
									cell.filterable = false;
									cell.sortable = false;
									cell.text = "영화제목";
									cell.style.setClasses(["header"]);
									cell.style.css({
										"background-color" : "#626262",
										"color" : "white",
										"background-image" : "none"
									});
								}
							}
						]
					},
					"detail": {
						"rows": [{"height": "24px"}],
						"cells": [
							{
								"constraint": {"rowIndex": 0, "colIndex": 0},
								"configurator": function(cell){
									cell.columnName = "rank";
								}
							},
							{
								"constraint": {"rowIndex": 0, "colIndex": 1},
								"configurator": function(cell){
									cell.columnName = "actor";
								}
							}
						]
					}
				});
				grid_3.style.css({
					"background-color" : "white",
					"color" : "black",
					"font-family" : "@HY견고딕",
					"background-image" : "none"
				});
				container.addChild(grid_3, {
					"bottom": "50px",
					"left": "10px",
					"width": "280px",
					"height": "145px"
				});
				var output_2 = new cpr.controls.Output();
				output_2.value = "영화 예메 순위";
				output_2.style.css({
					"background-color" : "white",
					"color" : "black",
					"font-weight" : "bolder",
					"font-family" : "@HY견고딕",
					"background-image" : "none",
					"text-align" : "center"
				});
				container.addChild(output_2, {
					"bottom": "204px",
					"left": "5px",
					"width": "280px",
					"height": "30px"
				});
				var output_3 = new cpr.controls.Output("op_date");
				output_3.value = "op";
				output_3.style.css({
					"text-align" : "right"
				});
				container.addChild(output_3, {
					"bottom": "10px",
					"left": "15px",
					"width": "270px",
					"height": "20px"
				});
				var output_4 = new cpr.controls.Output();
				output_4.value = "영화인 인기검색어";
				output_4.style.css({
					"background-color" : "white",
					"color" : "black",
					"font-weight" : "bolder",
					"font-family" : "@HY견고딕",
					"background-image" : "none",
					"text-align" : "center"
				});
				container.addChild(output_4, {
					"right": "10px",
					"bottom": "399px",
					"width": "280px",
					"height": "34px"
				});
			})(group_3);
			container.addChild(group_3, {
				"colIndex": 2,
				"rowIndex": 1
			});
			
			var group_4 = new cpr.controls.Container();
			// Layout
			var xYLayout_4 = new cpr.controls.layouts.XYLayout();
			group_4.setLayout(xYLayout_4);
			(function(container){
				var output_5 = new cpr.controls.Output();
				output_5.value = "이 영화 어때? ";
				output_5.style.css({
					"border-right-style" : "solid",
					"color" : "black",
					"border-bottom-color" : "#36d136",
					"font-weight" : "900",
					"border-left-color" : "#36d136",
					"font-size" : "25px",
					"border-right-color" : "#36d136",
					"font-style" : "normal",
					"border-top-style" : "solid",
					"background-color" : "white",
					"border-left-style" : "solid",
					"border-top-color" : "#36d136",
					"font-family" : "@HY헤드라인M",
					"border-bottom-style" : "solid",
					"background-image" : "none",
					"text-align" : "center"
				});
				container.addChild(output_5, {
					"top": "3px",
					"left": "10px",
					"width": "241px",
					"height": "46px"
				});
				var output_6 = new cpr.controls.Output();
				output_6.style.css({
					"background-image" : "url('image/magnifying-glass.png')"
				});
				container.addChild(output_6, {
					"top": "10px",
					"left": "14px",
					"width": "35px",
					"height": "35px"
				});
			})(group_4);
			container.addChild(group_4, {
				"colIndex": 1,
				"rowIndex": 0
			});
			if(typeof onBodyInit == "function"){
				app.addEventListener("init", onBodyInit);
			}
		}
	});
	app.title = "index";
	cpr.core.Platform.INSTANCE.register(app);
})();
