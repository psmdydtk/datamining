/*
 * App URI: test1129
 * Source Location: test1129.clx
 *
 * This file was generated by eXbuilder6 compiler, Don't edit manually.
 */
(function(){
	var app = new cpr.core.App("test1129", {
		onPrepare: function(loader){
		},
		onCreate: function(/* cpr.core.AppInstance */ app, exports){
			var linker = {};
			// Start - User Script
			/************************************************
			 * test1129.js
			 * Created at 2019. 11. 29. 오전 10:33:46.
			 *
			 * @author HANS
			 ************************************************/
			
			
			
			/*
			 * "Button" 버튼(btn1)에서 click 이벤트 발생 시 호출.
			 * 사용자가 컨트롤을 클릭할 때 발생하는 이벤트.
			 */
			function onBtn1Click(/* cpr.events.CMouseEvent */ e){
				/** 
				 * @type cpr.controls.Button
				 */
				var btn1 = e.control;
				
				
				var vcDataSet = app.lookup("ds1");
				var chartShl1 = app.lookup("chartShl1");
				var returnOption = configOption2("Title","부제","시리즈",vcDataSet);
				
				//var returnOption = configOption1("",app.lookup("ds2"));
				chartShl1.setAppProperty("option", returnOption);	
			}
			
			
			
			/**
			 * 파이차트를 그리기위한 옵션을 지정해주는 함수입니다. 프로토타입
			 * @param {String} paramStringTitle 원제
			 * @param {String} paramStringSubTitle 부제
			 * @param {String} seriesName 시리즈명
			 * @param {cpr.data.DataSet} paramDataSet 차트를 그릴 데이터를 담고있는 데이터셋
			 * @param {String} paramMainColumnName 컬럼명
			 */
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
			function configOption1(graphTitle,bindingDataSet){
				
				var vcDataSet = bindingDataSet;
				
				
				var option = {
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            
			            type : 'shadow'        
			        }
			    },
			    legend: {
			        data:['중립','반대','찬성']
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
			    	{
			            name:'중립',
			            type:'bar',
			            stack: 'instantStack',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'left'
			                }
			            },
			            data:[vcDataSet.getValue(0,"center")]
			        },
			        {
			            name:'찬성',
			            type:'bar',
			            stack: 'instantStack',
			            label: {
			                normal: {
			                    show: true,
			                    position : "right"
			                }
			            },
			            data:[vcDataSet.getValue(0, "good")]
			        },
			        {
			            name:'반대',
			            type:'bar',
			            stack: 'instantStack',
			            label: {
			                normal: {
			                    show: true,
			                    position: 'left'
			                }
			            },
			            data:[vcDataSet.getValue(0, "bad") * -1]
			        }
			    ]
			};
			
			return option;
			}
			// End - User Script
			
			// Header
			var dataSet_1 = new cpr.data.DataSet("ds1");
			dataSet_1.parseData({
				"sortCondition": "value asc",
				"stateRestore": true,
				"columns": [
					{
						"name": "value",
						"dataType": "number"
					},
					{"name": "name"}
				],
				"rows": [
					{"value": "1", "name": "name1"},
					{"value": "2", "name": "name2"},
					{"value": "3", "name": "name3"},
					{"value": "4", "name": "name4"},
					{"value": "5", "name": "name5"},
					{"value": "6", "name": "name6"},
					{"value": "7", "name": "name7"},
					{"value": "8", "name": "name8"},
					{"value": "9", "name": "name9"},
					{"value": "10", "name": "name10"},
					{"value": "11", "name": "name11"},
					{"value": "12", "name": "name12"},
					{"value": "13", "name": "name13"},
					{"value": "14", "name": "name14"},
					{"value": "15", "name": "name15"}
				]
			});
			app.register(dataSet_1);
			
			var dataSet_2 = new cpr.data.DataSet("ds2");
			dataSet_2.parseData({
				"columns": [
					{"name": "good"},
					{"name": "bad"},
					{"name": "center"}
				],
				"rows": [{"good": "13", "bad": "22", "center": "13"}]
			});
			app.register(dataSet_2);
			
			app.supportMedia("all and (min-width: 1024px)", "default");
			app.supportMedia("all and (min-width: 500px) and (max-width: 1023px)", "tablet");
			app.supportMedia("all and (max-width: 499px)", "mobile");
			
			// Configure root container
			var container = app.getContainer();
			container.style.css({
				"width" : "100%",
				"top" : "0px",
				"height" : "100%",
				"left" : "0px"
			});
			
			// Layout
			var xYLayout_1 = new cpr.controls.layouts.XYLayout();
			container.setLayout(xYLayout_1);
			
			// UI Configuration
			var button_1 = new cpr.controls.Button("btn1");
			button_1.value = "Button";
			if(typeof onBtn1Click == "function") {
				button_1.addEventListener("click", onBtn1Click);
			}
			container.addChild(button_1, {
				"top": "20px",
				"left": "20px",
				"width": "100px",
				"height": "20px"
			});
			
			var userDefinedControl_1 = new udc.ChartShell("chartShl1");
			container.addChild(userDefinedControl_1, {
				"top": "50px",
				"right": "20px",
				"bottom": "20px",
				"left": "20px"
			});
		}
	});
	app.title = "test1129";
	cpr.core.Platform.INSTANCE.register(app);
})();
