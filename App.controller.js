sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast", 'sap/ui/model/json/JSONModel'
 ], function (Controller, MessageToast, JSONModel) {
    "use strict";
    return Controller.extend("HelloWorld.App", {
        onInit: function () {
            var oInputModel = new JSONModel({});
            var oListModel = new JSONModel({});
            this.getView().setModel(oInputModel, "InputModel");
            this.getView().setModel(oListModel, "ListModel");

            let bStorageAvalaible = this.storageAvailable();
            if(bStorageAvalaible){
                var oStorage = window['localStorage'].getItem("noteList");
                if(!oStorage){
                    this.getView().getModel("ListModel").setData({noteList: []});
                }else{
                    this.getView().getModel("ListModel").setData(oStorage);
                }
                
            }
        },
        onShowHello : function () {
            MessageToast.show("Hello World");
            this.onTest();
        },
        onTest : function() {
            MessageToast.show("Test");
        },
        storageAvailable : function() {
            try {
                var storage = window['localStorage'],
                    x = '__storage_test__';
                storage.setItem(x, x);
                storage.removeItem(x);
                return true;
            }
            catch(e) {
                return e instanceof DOMException && (
                    // everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededError' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                    // acknowledge QuotaExceededError only if there's something already stored
                    storage.length !== 0;
            }
        },
        saveNote : function(){
            let sInputValue = this.getView().getModel("InputModel").getData()["InputValue"];
            this.getView().getModel("InputModel").setData({InputValue: ""});
            let oNewNote = {
                "note": sInputValue,
                "date": new Date()
            };

            let oListModel = this.getView().getModel("ListModel");
            oListModel.getData().noteList.push(oNewNote);
            oListModel.refresh(true);

            let bStorageAvalaible = this.storageAvailable();
            if(!bStorageAvalaible){
                MessageToast.show("Local Storage unavailable")
            }else{

                var oStorage = window['localStorage'];
                oStorage.setItem('noteList', JSON.stringify(oListModel.getData());
            }
        },
        onDeleteNote : function(e){
            console.log(e);
        },
        onEditNote : function(e){
            console.log(e);
        }
    });
 });