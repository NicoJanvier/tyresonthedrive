sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
 ], function (Controller, MessageToast, JSONModel) {
    "use strict";
    return Controller.extend("HelloWorld.App", {
        onInit: function () {
            this.instantiateModels();
            let oGlobalModel = this.getView().getModel("GlobalListModel");
            let bStorageAvalaible = this.storageAvailable();
            if(bStorageAvalaible){
                var oStorage = window['localStorage'].getItem("noteList");
                if(!oStorage){
                    oGlobalModel.setData({noteList: []});
                }else{
                    oGlobalModel.setData(JSON.parse(oStorage));
                }                
            }
            this.updateListModel();
        },
        onRemoveData: function(){
            let bStorageAvalaible = this.storageAvailable();
            if(bStorageAvalaible){
                window['localStorage'].removeItem("noteList");
            }
        },
        updateListModel: function(){
            let oView = this.getView();
            let oList = oView.byId("mainList");
            let oListModel = this.getView().getModel("ListModel");
            let oGlobalModel = this.getView().getModel("GlobalListModel");

            
            if(!oList.sort){
                oList.sort = {date: undefined, tag: undefined};
            }
            if(!oList.filter){
                oList.filter = {archived: false};
            }
            oListModel.setData(oGlobalModel.getData());
            this.filterList("archived", oList.filter.archived);
            this.sortList("desc", "date");

        },
        filterList: function(type, value) {
            let oView = this.getView();
            let oList = oView.byId("mainList");
            let oListModel = this.getView().getModel("ListModel");
            let oGlobalModel = this.getView().getModel("GlobalListModel");

            let aData = oGlobalModel.getData().noteList.filter((a)=>{
                return a[type] === value;
            });
            oList.filter[type] = value;
            oListModel.setData({noteList: aData});
        },
        sortList: function(mode, type){
            let oView = this.getView();
            let oList = oView.byId("mainList");
            let oListModel = oView.getModel("ListModel");
            let iMult = (mode === "asc") ? 1 : -1 ;
            if(oList.getItems().length > 1){
                oListModel.getData().noteList.sort((a,b)=>{
                    let iRes = (a[type]>b[type]) ? 1 : ((a[type]<b[type]) ? -1 : 0);
                    return iRes * iMult
                });
                oList.sort[type] = mode;
                oListModel.refresh();
            }
        },
        onPressSort : function(e){
            let oView = this.getView();
            let oList = oView.byId("mainList");
            let sType = (e.getSource().getId() === "__xmlview0--sortDate") ? "date" : "tag";
            let sMode = (oList.sort[sType] === "desc") ? "asc" : "desc";
            let sIcon = (sMode === "desc") ? "sap-icon://sort-ascending" : "sap-icon://sort-descending";
            this.sortList(sMode, sType);
            e.getSource().setIcon(sIcon);
        },
        instantiateModels : function() {
            var oInputModel = new JSONModel({});
            var oListModel = new JSONModel({});
            var oGlobalListModel = new JSONModel({});
            this.getView().setModel(oInputModel, "InputModel");
            this.getView().setModel(oListModel, "ListModel");            
            this.getView().setModel(oGlobalListModel, "GlobalListModel");

            var oTagModel = new JSONModel({
                tags: [
                    {
                        id: 'work',
                        text: 'Work'
                    },
                    {
                        id: 'travel',
                        text: 'Travel'
                    },
                    {
                        id: 'finance',
                        text: 'Finances'
                    },
                ]
            });
            this.getView().setModel(oTagModel, "TagModel");

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
            var sTitle;
            if(oView.getModel("InputModel").getData().editedPath === undefined){
                sTitle = "New Note";
            }else{
                sTitle = "Edit Note";
                var sSelectedTagKey = oView.getModel("ListModel").getProperty(oView.getModel("InputModel").getData().editedPath).tagKey;
                oView.byId("tagSelect").setSelectedKey(sSelectedTagKey);
            }
            
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
            let sTitle = this.getView().getModel("InputModel").getData().InputTitle;
            let sDate = new Date();
            let sTag = this.getView().byId("tagSelect").getSelectedItem().getText();
            let sTagKey = this.getView().byId("tagSelect").getSelectedItem().getKey();
            let oNewNote = {
                "title": sTitle,
                "note": sInputValue,
                "dateString": sDate.toLocaleString(),
                "date": sDate,
                "tag": sTag,
                "tagKey": sTagKey,
                "archived": false,
            };

            // let oListModel = this.getView().getModel("ListModel");
            let oGlobalListModel = this.getView().getModel("GlobalListModel");
            let sEditedPath = this.getView().getModel("InputModel").getData().editedPath;

            if(sEditedPath){
                oGlobalListModel.setProperty(sEditedPath, oNewNote);
            }else{
                oGlobalListModel.getData().noteList.unshift(oNewNote);
            }
            this.updateListModel();            
            this.updateLocalStorage();
            this.onCloseDialog();         
        },
        updateLocalStorage: function(){
            let oGlobalListModel = this.getView().getModel("GlobalListModel");
            let bStorageAvalaible = this.storageAvailable();
            if(!bStorageAvalaible){
                MessageToast.show("Local Storage unavailable")
            }else{
                var oStorage = window['localStorage'];
                oStorage.setItem('noteList', JSON.stringify(oGlobalListModel.getData()));
            }
        },
        onDeleteNote : function(e){
            var oItem = e.getSource().getParent().getParent().getParent();
            var sPath = oItem.getBindingContextPath();

            var sDate = this.getView().getModel("ListModel").getProperty(sPath).date;

            var aNewList = this.getView().getModel("GlobalListModel").getData().noteList.filter((obj)=>{
                return obj.date !== sDate;
            });

            this.getView().getModel("GlobalListModel").setData({noteList: aNewList});
            this.updateListModel();
            this.updateLocalStorage();
        },
        onEditNote : function(e){
            var oItem = e.getSource().getParent().getParent().getParent();
            var sPath = oItem.getBindingContextPath();
            this.getView().getModel("InputModel").setData({
                InputValue: this.getView().getModel("ListModel").getProperty(sPath).note,
                InputTitle: this.getView().getModel("ListModel").getProperty(sPath).title,
                editedPath: sPath
            });
            this.onOpenDialog();
        },
        onToggleArchived : function(e){
            let bPressed = e.getSource().getProperty("pressed");
            this.filterList("archived", bPressed);
        },
        onArchiveSelect : function(e){
            var oItem = e.getSource().getParent().getParent().getParent();
            var sPath = oItem.getBindingContextPath();
            var bSelected = e.getParameter("selected");
            this.updateLocalStorage();
            this.updateListModel();
        }
    });
 });