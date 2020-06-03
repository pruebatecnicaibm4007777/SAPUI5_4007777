sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/json/JSONModel"
], function (Controller, ODataModel, JSONModel) {
	"use strict";

	return Controller.extend("com.ibm.sap.pm.Equipos.controller.Equipos", {
		onInit: function () {
			/*var oModelEquipo = new JSONModel("model/equipos.json");
			this.getView().setModel(oModelEquipo,"equipos");*/
			this.getView().byId("bar1").setVisible(false);
			var oModelServEquipos = this.getView().getModel('servEquipos');
			var that = this;
			oModelServEquipos.read("/EquiposSet?$format=json", {
				success: function (results, error) {
					var oModel = new JSONModel(results);
					that.getView().setModel(oModel, "equipos");
				}
			});
		},
		onChangeComboBox: function (event) {
			var oValidatedComboBox = event.getSource(),
				sSelectedKey = oValidatedComboBox.getSelectedKey();

			if (sSelectedKey) {
				var waiting=this.getView().byId('waiting');
				waiting.setVisible(true);
				var oModelServEquipos = this.getView().getModel('servEquipos');
				var that = this;
				oModelServEquipos.read("/Equipos_DetalleSet('" + sSelectedKey + "')?$format=json", {
					//oModelServEquipos.read("/Equipos_DetalleSet('CON10469')?$format=json", {
					success: function (results, error) {
						var oModel = new JSONModel(results);
						that.getView().setModel(oModel, "detalleEquipo");
					}
				});
				//////////////////////////////////////////////////////////////////////////////////////////////////////
				oModelServEquipos.read("/Stock_MaterialesSet?$format=json", {
					//oModelServEquipos.read("/Equipos_DetalleSet('CON10469')?$format=json", {
					success: function (results, error) {
						results.count=Object.keys(results.results).length;
						var oModel = new JSONModel(results);
						that.getView().setModel(oModel, "materiales");
					}
				});
				//////////////////////////////////////////////////////////////////////////////////////////////////////
				oModelServEquipos.read("/EquiposSet('" + sSelectedKey + "')?$expand=NAVOrdenes&$format=json", {
				//oModelServEquipos.read("/EquiposSet('ENV0042')?$format=json", {
					urlParameters: {
						"$expand": "NAVOrdenes,NAVAvisos,NAVMediciones"
					},
					success: function (results, error) {
						var oModelHistorico = new JSONModel(results.NAVOrdenes);
						results.NAVOrdenes.count=Object.keys(results.NAVOrdenes.results).length;
						that.getView().setModel(oModelHistorico, "historico");
						var oModelAbiertos = new JSONModel(results.NAVAvisos);
						results.NAVAvisos.count=Object.keys(results.NAVAvisos.results).length;
						that.getView().setModel(oModelAbiertos, "mantenimiento");
						var oModelMediciones = new JSONModel(results.NAVMediciones);
						results.NAVMediciones.count=Object.keys(results.NAVMediciones.results).length;
						that.getView().setModel(oModelMediciones, "mediciones");
						waiting.setVisible(false);
						that.getView().byId("bar1").setVisible(true);
					}
				});
			}
		}
	});
});