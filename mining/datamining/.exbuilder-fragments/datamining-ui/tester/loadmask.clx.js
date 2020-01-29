/*
 * App URI: tester/loadmask
 * Source Location: tester/loadmask.clx
 *
 * This file was generated by eXbuilder6 compiler, Don't edit manually.
 */
(function(){
	var app = new cpr.core.App("tester/loadmask", {
		onPrepare: function(loader){
		},
		onCreate: function(/* cpr.core.AppInstance */ app, exports){
			var linker = {};
			
			// Header
			app.declareAppProperty("text", "처리 중입니다...");
			
			app.supportMedia("all and (min-width: 1024px)", "default");
			app.supportMedia("all and (min-width: 500px) and (max-width: 1023px)", "tablet");
			app.supportMedia("all and (max-width: 499px)", "mobile");
			
			// Configure root container
			var container = app.getContainer();
			container.style.setClasses(["cl-overlay"]);
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
			var group_1 = new cpr.controls.Container();
			group_1.style.setClasses(["cl-loadmask"]);
			group_1.style.css({
				"background-color" : "lightgray"
			});
			// Layout
			var xYLayout_2 = new cpr.controls.layouts.XYLayout();
			group_1.setLayout(xYLayout_2);
			(function(container){
				var output_1 = new cpr.controls.Output();
				output_1.value = "";
				output_1.style.setClasses(["loading"]);
				output_1.bind("value").toAppProperty("text");
				container.addChild(output_1, {
					"width": "148px",
					"height": "32px",
					"left": "calc(50% - 74px)",
					"top": "calc(50% - 16px)"
				});
			})(group_1);
			container.addChild(group_1, {
				"width": "200px",
				"height": "50px",
				"left": "calc(50% - 100px)",
				"top": "calc(50% - 25px)"
			});
		}
	});
	app.title = "loadmask";
	cpr.core.Platform.INSTANCE.register(app);
})();
