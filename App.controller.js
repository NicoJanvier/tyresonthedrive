sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast", 'sap/ui/model/json/JSONModel'
 ], function (Controller, MessageToast, JSONModel) {
    "use strict";
    return Controller.extend("HelloWorld.App", {
        onInit: function () {
			var oModel = new JSONModel({data: {}});
			this.getView().setModel(oModel);
        },
        onShowHello : function () {
            MessageToast.show("Hello World");
            this.onTest();
        },
        onTest : function() {
            MessageToast.show("Test");
        }
    });
 });