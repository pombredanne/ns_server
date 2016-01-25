(function () {
  "use strict";

  angular
    .module("mnExternalRoles", [
      "mnExternalRolesService",
      "mnHelper",
      "mnPromiseHelper",
      "mnPoll",
      "mnSortableTable",
      "mnSpinner",
      "ui.select"
    ])
    .controller("mnExternalRolesController", mnExternalRolesController);

  function mnExternalRolesController($scope, $uibModal, mnPromiseHelper, mnExternalRolesService, mnPoller, mnHelper, mnSortableTable) {
    var vm = this;
    vm.addUser = addUser;
    vm.deleteUser = deleteUser;
    vm.editUser = editUser;
    vm.readRoleDescriptionByName = readRoleDescriptionByName;
    vm.sortableTableProperties = mnSortableTable.get();

    activate();

    function readRoleDescriptionByName(role) {
      return mnExternalRolesService.rolesByRole[role];
    }

    function activate() {
      mnPromiseHelper(vm, mnExternalRolesService.getRolseByRole())
        .applyToScope("rolseByRole");

      var poller = new mnPoller($scope, mnExternalRolesService.getState, 10000)
        .subscribe("state", vm)
        .reloadOnScopeEvent("reloadRolesPoller", vm)
        .cycle();
    }

    function editUser(user) {
      $uibModal.open({
        templateUrl: 'app/mn_admin/mn_security/mn_external_roles/add_dialog/mn_external_roles_add_dialog.html',
        controller: 'mnExternalRolesAddDialogController as externalRolesAddDialogCtl',
        resolve: {
          user: mnHelper.wrapInFunction(user)
        }
      });
    }
    function addUser() {
      $uibModal.open({
        templateUrl: 'app/mn_admin/mn_security/mn_external_roles/add_dialog/mn_external_roles_add_dialog.html',
        controller: 'mnExternalRolesAddDialogController as externalRolesAddDialogCtl',
        resolve: {
          user: mnHelper.wrapInFunction(undefined)
        }
      });
    }
    function deleteUser(user) {
      $uibModal.open({
        templateUrl: 'app/mn_admin/mn_security/mn_external_roles/delete_dialog/mn_external_roles_delete_dialog.html',
        controller: 'mnExternalRolesDeleteDialogController as externalRolesDeleteDialogCtl',
        resolve: {
          user: mnHelper.wrapInFunction(user)
        }
      });
    }
  }
})();