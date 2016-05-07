(function() {
  'use strict';

  angular
    .module('mad')
    .controller('HeaderCtrl', HeaderCtrl);

  /** @ngInject */
  function HeaderCtrl($rootScope, $scope, $location, $state, AdvertiserSrv) {
    $scope.isMain = false;

    $scope.isManage = false;
    $scope.isPush = false;
    $scope.isList = false;

    $scope.isPay = false;
    $scope.isPut = false;
    $scope.isBack = false;
    $scope.isConfirm = false;

    $scope.isStatistics = false;
    $scope.isAccSta = false;
    $scope.isAdSta = false;

    $scope.isMsg = false;

    $scope.isAccount = false;

    if ($location.path() == '/advert/push') {
      $scope.isManage = true;
      $scope.isPush = true;
    }

    if ($location.path() == '/advert') {
      $scope.isManage = true;
      $scope.isList = true;
    }

    if ($location.path() == '/account/recharge') {
      $scope.isPay = true;
      $scope.isPut = true;
    }

    if ($location.path() == '/account/refund') {
      $scope.isPay = true;
      $scope.isBack = true;
    }

    if ($location.path() == '/account/check') {
      $scope.isPay = true;
      $scope.isConfirm = true;
    }

    if ($location.path() == '/statistics') {
      $scope.isStatistics = true;
      $scope.isAccSta = true;
    }

    if ($location.path() == '/statistics/detail') {
      $scope.isStatistics = true;
      $scope.isAdSta = true;
    }

    if ($location.path() == '/account') {
      $scope.isAccount = true;
    }

    if ($location.path() == '/notification') {
      $scope.isMsg = true;
    }
    
    $('#signup').on('hidden.bs.modal', function (e) {
      $scope.thereIsError = false;
      $scope.errMessage = '';
      console.log('hide signup');
      
    });
    
    $('#login').on('hidden.bs.modal', function (e) {
      $scope.thereIsError = false;
      $scope.errMessage = '';
      console.log('hide login');
    })
    
    $scope.isLogin = true;//for test
    
    
    if ($rootScope.token !== undefined && $rootScope.token !== null) {
      $scope.isLogin = true;
    } 
    
    $scope.thereIsError = false;
    
    // 注册
    $scope.register = function (nickname, email, pass, confirmPass) {
      if (nickname == null || email == null || pass == null || confirmPass == null) {
        $scope.thereIsError = true;
        $scope.errMessage = '请输入完整信息';
        return;
      }
      if (pass !== confirmPass) {
        $scope.thereIsError = true;
        $scope.errMessage = '两次输入密码不一致';
        return;
      }
      if (email.search(/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/) === -1) {
        $scope.thereIsError = true;
        $scope.errMessage = '请输入合法邮箱';
        return;
      }
      
      $scope.thereIsError = false;
      AdvertiserSrv.register().save({
          username: nickname,
          email: email,
          password: pass
        }).$promise.then(
          function (response) {
            console.log(response);
            if ('0' == response.errCode) {
              console.log('注册成功');
              $('#signup').modal('hide');
            } else {
              // 错误处理
              if ('104' == response.errCode) {
                $scope.thereIsError = true;
                $scope.errMessage = '该用户邮箱已被注册';  
              } else {
                $scope.thereIsError = true;
                $scope.errMessage = '未知错误:' + response.errCode;
              }
            }
          }, function (error) {
            console.log('注册失败');
            console.log(error);
            $scope.thereIsError = true;
            $scope.errMessage = '未知错误' + error;
          });
      
    };
    
    // 登录
    $scope.login = function (email, pass) {
      if (email == null || pass == null) {
        $scope.thereIsError = true;
        $scope.errMessage = '请输入用户名和密码';
        return;
      }
      if (email.search(/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/) === -1) {
        $scope.thereIsError = true;
        $scope.errMessage = '请输入合法邮箱';
        return;
      }
      
      AdvertiserSrv.login().save({
        email: email,
        password: pass
      }).$promise.then(
        function (response) {
          console.log(response);
          if ('0' == response.errCode) {
            console.log('登录成功');
            $rootScope.token = response.token;
            $('#login').modal('hide');
            $scope.isLogin = true;
          } else {
            // 错误处理
            if ('103' == response.errCode) {
              $scope.thereIsError = true;
              $scope.errMessage = '用户邮箱未验证';
            } else if ('102' == response.errCode) {
              $scope.thereIsError = true;
              $scope.errMessage = '用户名或密码错误';
            } else {
              $scope.thereIsError = true;
              $scope.errMessage = '未知错误:' + response.errCode;
            }
          }
        }, function(error) {
          console.log('登录失败');
          console.log(error);
        });
    }
    
    $scope.logout = function () {
      console.log('logout');
      
      $rootScope.token = null;
      $scope.isLogin = false;
      $state.go('app');
    }
    
    
    
  }
})();
