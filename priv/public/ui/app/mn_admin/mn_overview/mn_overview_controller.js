(function () {
  "use strict";

  angular.module('mnOverview', [
    'mnOverviewService',
    'mnBarUsage',
    'mnPlot',
    'mnBucketsService',
    'mnPoll',
    'ui.bootstrap',
    'mnElementCrane',
    'mnAboutDialogService',
    'mnPromiseHelper',
    'mnXDCRService'
  ]).controller('mnOverviewController', mnOverviewController);

  function mnOverviewController($scope, $rootScope, mnBucketsService, mnOverviewService, mnPoller, mnAboutDialogService, mnPromiseHelper, mnXDCRService) {
    var vm = this;

    vm.getEndings = getEndings;

    activate();

    function getEndings(length) {
      return length !== 1 ? "s" : "";
    }

    function activate() {
      $rootScope.$broadcast("reloadPoolDefaultPoller");

      mnPromiseHelper(vm, mnAboutDialogService.getState())
        .applyToScope("aboutState");

      new mnPoller($scope, mnXDCRService.getReplicationState)
        .setInterval(3000)
        .subscribe("xdcrReferences", vm)
        .cycle();
      new mnPoller($scope, mnOverviewService.getOverviewConfig)
        .reloadOnScopeEvent("mnPoolDefaultChanged")
        .subscribe("mnOverviewConfig", vm)
        .cycle();
      new mnPoller($scope, function () {
          return mnOverviewService.getServices();
        })
        .reloadOnScopeEvent("nodesChanged")
        .subscribe("nodes", vm)
        .cycle();
      new mnPoller($scope, function () {
          return mnBucketsService.getBucketsByType();
        })
        .reloadOnScopeEvent("bucketUriChanged")
        .subscribe("buckets", vm)
        .cycle();

      if ($scope.rbac.cluster.bucket['*'].stats.read) {
        new mnPoller($scope, mnOverviewService.getStats)
          .setInterval(3000)
          .subscribe("mnOverviewStats", vm)
          .cycle();
      }
    }
  }
})();
