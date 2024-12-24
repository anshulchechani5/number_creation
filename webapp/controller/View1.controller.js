sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("ysetnumbercreation.controller.View1", {
            onInit: function () {
                var oDate = new Date();
                var oModel = {
                    dDefaultDate: oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate()
                };
                this.getView().setModel(new JSONModel(oModel), "oDateModel")
                this.getView().setModel(oModel, "view");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);


            },
            finalsetno: function () {
                var Machinenumber = this.getView().byId("mno").getValue();
                if (Machinenumber === '') {
                    MessageBox.error("Please Enter Machine Number");
                }
                else 
                if(Machinenumber==="1"  || Machinenumber=== "2" ||Machinenumber=== "3" )
                   {
                    var oBusyDialog = new sap.m.BusyDialog({
                        text: "Please wait ..."
                    });
                    oBusyDialog.open();
                    var oModel1 = this.getView().getModel();
                    var date = this.getView().byId("date").getValue();
                    var oDate = new Date(date);
                    var oDate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                    var oDate2 = oDate1.toISOString().slice(0, 16);                
                    var dd=oDate2.slice(5,7);
                    var yy=oDate2.slice(2,4);
                    var yydd= yy+dd;
                    var mcno = this.getView().byId("mno").getValue();
                    var oInput = this.getView().byId("sno"); 
                    var oInput1 = this.getView().byId("fsn");  
                    var ofilter1 = new sap.ui.model.Filter("ZfnDate1", "EQ",yydd);
                    var ofilter2 = new sap.ui.model.Filter("ZmcNo", "EQ",mcno);
                    oModel1.read("/ZDNM_ALIAS", {
                        filters: [ofilter1,ofilter2],
                        success: function (ores) {
                            if(ores.results.length>0){
                              var lowest =0;  
                              var highest = 0;
                             for(var i =0;i<ores.results.length;i++){
                                lowest =Number(ores.results[i].ZsetNo)
                                 if(highest === 0){
                                   highest =Number(ores.results[i].ZsetNo)
                                 }else if(lowest >highest){
                                    highest= lowest
                                }
                                
                             }
                             if (lowest >highest ){
                                highest= lowest
                             }

                               var set = highest;
                               var setno= String(set + 1);
                               var len = setno.length;
                                if(len===1){
                                    setno = "0"+setno;
                                }
                               oInput.setValue(setno);
                               var fsn= mcno + dd + yy + setno;
                               oInput1.setValue(fsn);
                               oBusyDialog.close();
                            }
                            else{
                                var setno = "01"; 
                                oInput.setValue(setno);
                                var fsn= mcno + dd + yy + setno;
                                oInput1.setValue(fsn);
                                oBusyDialog.close();
                            }
                            
                        }.bind(this),
                        
                    })
                }
            },
            SAVEDATA: function () {
                var finalsetnumber = this.getView().byId("fsn").getValue();
                var plant = this.getView().byId("plant").getValue();
                var setnumber = this.getView().byId("sno").getValue();
                var set = this.getView().byId("sln").getValue();
                var Machinenumber = this.getView().byId("mno").getValue();
                var dyeingsort = this.getView().byId("dyeisort").getValue();
                var dyeingdesc = this.getView().byId("dyeidesc").getValue();
                var setlength = parseFloat(set).toFixed(2);
                if (plant === '') {
                    MessageBox.error("Please Select Plant");
                }
                else if (setnumber === '') {
                    MessageBox.error("Please Enter Set Number");
                }
                else if (setlength === '') {
                    MessageBox.error("Please Enter Set Length Number");
                }
                else if (Machinenumber === '') {
                    MessageBox.error("Please Enter Machine Number");
                }
                else if (finalsetnumber === '') {
                    MessageBox.error("Please Enter Final Set No.");
                }else if (dyeingsort === '') {
                    MessageBox.error("Please Enter Dyeing Sort");
                }
                else {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Saving data",
                    text: "Please wait ..."
                });
                oBusyDialog.open();

                var oModel1 = this.getView().getModel();
                var date = this.getView().byId("date").getValue();
                var oDate = new Date(date);
                var oDate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
                var oDate2 = oDate1.toISOString().slice(0, 16);


                var items = {
                    Werks: plant,
                    ZmcNo: Machinenumber,
                    ZsetNo: setnumber,
                    ZfsetNo: finalsetnumber,
                    ZfnDate: oDate2,
                    Zlength: setlength,
                    ZsetStd: oDate2,
                    mat_des:dyeingdesc,
                    material:dyeingsort
                }
                var oFilter1 = new sap.ui.model.Filter("Werks", "EQ", plant);
                var oFilter2 = new sap.ui.model.Filter("ZfsetNo", "EQ", finalsetnumber);
                oModel1.create("/ZDNM_ALIAS", items, {
                    filters: [oFilter1, oFilter2],
                    method: "POST",
                    success: function (ores) {
                        oBusyDialog.close();
                        MessageBox.show("Data Update Succesfully", {
                            title: "information",
                            icon: MessageBox.Icon.SUCCESS,
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.OK) {
                                    window.location.reload();
                                }
                            }

                        });
                    }.bind(this),
                    error: function (ores) {
                        oBusyDialog.close();
                        MessageBox.error("Data Not Upload");
                    }.bind(this)
                })
            }
            },
            dyeingsort: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                var dataModel = this.getOwnerComponent().getModel('dataModel');
                var oInput1 = this.getView().byId("dyeisort");
                var oInput = this.getView().byId("dyeidesc"); 
          
                if (!this._oValueHelpDialog) {
                    this._oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog("Orderfr", {
                        supportMultiselect: false,
                        supportRangesOnly: false,
                        stretch: sap.ui.Device.system.phone,
                        keys: "Orderid",
                        descriptionKey: "Orderid",
                        filtermode: "true",
                        enableBasicSearch: "true",
                        ok: function (oEvent) {
                            var valueset = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.Product;
                            var valueset1 = oEvent.mParameters.tokens[0].mAggregations.customData[0].mProperties.value.ProductDescription;
                            oInput1.setValue(valueset);
                            oInput.setValue(valueset1);
                            this.close();
                        },
                        cancel: function () {
                            this.close();
                        }
                    });
                }
          
          
                var oFilterBar = new sap.ui.comp.filterbar.FilterBar({
                    advancedMode: true,
                    filterBarExpanded: false,
                    filterBarExpanded: true,
                    enableBasicSearch: true,
                    showGoOnFB: !sap.ui.Device.system.phone,
                    filterGroupItems: [new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n1", label: "Product", control: new sap.m.Input() }),
                    new sap.ui.comp.filterbar.FilterGroupItem({ groupTitle: "foo", groupName: "gn1", name: "n2", label: "ProductDescription", control: new sap.m.Input() })],
          
          
          
          
                    search: function (oEvt) {
                        oBusyDialog.open();
                        //  var oParams = oEvt.getParameter("YY1_PACKINGTYPE");
                        var Product = oEvt.mParameters.selectionSet[0].mProperties.value;
                        var ProductDescription = oEvt.mParameters.selectionSet[1].mProperties.value;
                        // if threee no  values 
                        if (Product === "" && ProductDescription === "") {
                            oTable.bindRows({
                                path: "/MAT_DES"
                            });
                        }
          
                        //    if BillingDocument  value is insert then search  under block
                        else if (Product === "" ) {
                            oTable.bindRows({
                                path: "/MAT_DES", filters: [
                                    new sap.ui.model.Filter("ProductDescription", sap.ui.model.FilterOperator.Contains, ProductDescription)]
                            });
                        }
          
                        //    if BillingDocumentItem  value is insert then search under block
                        else if (ProductDescription === "" ) {
                            oTable.bindRows({
                                path: "/MAT_DES", filters: [
                                    new sap.ui.model.Filter("Product", sap.ui.model.FilterOperator.Contains, Product)]
                            });
                        }
                        
                        oBusyDialog.close();
                    }
                });
          
                this._oValueHelpDialog.setFilterBar(oFilterBar);
                var oColModel = new sap.ui.model.json.JSONModel();
                oColModel.setData({
                    cols: [
                        { label: "Product", template: "Product" },
                        { label: "ProductDescription", template: "ProductDescription" }
                    ]
                });
                var oTable = this._oValueHelpDialog.getTable();
                oTable.setModel(oColModel, "columns");
                var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZDENIM_SERVICE_V2");
                oTable.setModel(oModel);
                oBusyDialog.close();
                this._oValueHelpDialog.open();
                },
            onBack: function () {
              var sPreviousHash = History.getInstance().getPreviousHash();
              if (sPreviousHash !== undefined) {
                  window.history.go(-1);
              } else {
                  this.getOwnerComponent().getRouter().navTo("page1", null, true);
              }
            },


        });
    });
