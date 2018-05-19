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
                    this.getView().getModel("ListModel").setData(JSON.parse(oStorage));
                }
                
            }
        },
        onOpenDialog : function () {
            var oCtrl = this;
			var oView = this.getView();
			var oDialog = oView.byId("noteDialog");
			// create dialog lazily
			if (!oDialog) {
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "HelloWorld.App", oCtrl);
				// connect dialog to view (models, lifecycle)
				oView.addDependent(oDialog);
            }
            var sTitle = this.getView().getModel("InputModel").getData().editedPath ? "New note" : "Edit note";
            
            oDialog.setTitle(sTitle);
            oDialog.open();
        },
        onCloseDialog : function(){
            var oView = this.getView();
            var oDialog = oView.byId("noteDialog");
            oDialog.close();
        },
        onNewNote : function() {
            this.getView().getModel("InputModel").setData({
                InputValue: '',
                editedPath: undefined
            });
            this.onOpenDialog();
        },
        // onShowHello : function () {
        //     MessageToast.show("Hello World");
        //     this.onTest();
        // },
        // onTest : function() {
        //     MessageToast.show("Test");
        // },
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
            let sInputValue = this.getView().getModel("InputModel").getData().InputValue;
            let oNewNote = {
                "note": sInputValue,
                "date": new Date()
            };

            let oListModel = this.getView().getModel("ListModel");
            let sEditedPath = this.getView().getModel("InputModel").getData().editedPath;

            if(sEditedPath){
                oListModel.setProperty(sEditedPath, oNewNote);
            }else{
                oListModel.getData().noteList.push(oNewNote);
                oListModel.refresh(true);
            }            
            this.updateLocalStorage();
            this.onCloseDialog();         
        },
        updateLocalStorage: function(){
            let oListModel = this.getView().getModel("ListModel");
            let bStorageAvalaible = this.storageAvailable();
            if(!bStorageAvalaible){
                MessageToast.show("Local Storage unavailable")
            }else{
                var oStorage = window['localStorage'];
                oStorage.setItem('noteList', JSON.stringify(oListModel.getData()));
            }
        },
        onDeleteNote : function(e){
            var oItem = e.getSource().getParent().getParent().getParent();
            var sPath = oItem.getBindingContextPath();
            var sIndex = sPath.slice(("/notelist/").length);
            var aNewList = this.getView().getModel("ListModel").getData().noteList;
            aNewList.splice(parseInt(sIndex),1);
            this.getView().getModel("ListModel").setData({noteList : aNewList});
            this.updateLocalStorage();
        },
        onEditNote : function(e){
            var oItem = e.getSource().getParent().getParent().getParent();
            var sPath = oItem.getBindingContextPath();
            this.getView().getModel("InputModel").setData({
                InputValue: this.getView().getModel("ListModel").getProperty(sPath).note,
                editedPath: sPath
            });
            this.onOpenDialog();
           

        }
    });
 });