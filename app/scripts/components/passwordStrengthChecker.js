/**
 * Created by thzo on 19.08.16.
 */
(function(){
  angular.module('passwordStrengthCheckerApp',[]).component('passwordStrengthChecker',{
    bindings: {
      password: '<',
      strengthSteps: '<?'
    },
    controller: function ($scope) {
      var ctrl = this;

      var strengthService = {
        strength: [{
          label: 'unsecure',
          color: '#F00'
        }, {
          label: 'weak',
          color: '#F90'
        }, {
          label: 'middle',
          color: '#FF0'
        }, {
          label: 'good',
          color: '#9F0'
        }, {
          label: 'veryGood',
          color: '#0F0'
        }],
        measureStrength: function (password) {
          var strength = password.length * 4;

          var numbers = password.match(/\d+/g);
          var upperCase = password.match(/[A-Z]+/g);
          var lowerCase = password.match(/[a-z]+/g);
          var symbol = password.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]+/g);
          var consecutive = password.match(/(.)\1+/);

          if (numbers) {
            strength += numbers.join([]).length * 4;
            strength -= this.getValueForSubtraction(password, numbers);
          }
          if (upperCase) {
            strength += (password.length - upperCase.join([]).length) * 2;
            strength -= this.getValueForSubtraction(password, upperCase);
          }
          if (lowerCase) {
            strength += (password.length - lowerCase.join([]).length) * 2;
            strength -= this.getValueForSubtraction(password, lowerCase);
          }
          if (symbol) {
            strength += symbol.join([]).length * 6;
            strength -= this.getValueForSubtraction(password, symbol);
          }
          if (consecutive) {
            strength -= consecutive.length * 2;
          }

          for (var i = 1; i < password.length; i++) {
            if (password.charCodeAt(i-1) - 1 === password.charCodeAt(i) || password.charCodeAt(i-1) + 1 === password.charCodeAt(i)) {
              strength -= 3;
            }
          }
          strength = strength < 0 ? 0 : strength;
          return strength < 100 ? strength : 100;
        },
        getColor: function (password) {
          return this.strength[this.getStrengthIndex(password)].color;
        },
        getStrengthIndex: function (password) {
          return Math.floor(this.measureStrength(password) * this.strength.length / 101);
        },
        getValueForSubtraction: function (password, filteredPassword) {
          return filteredPassword === password ? password.length * 2 : 0;
        },
        getSelectedLabel: function(password){
          return this.strength[this.getStrengthIndex(password)].label;
        }
      };

      if(ctrl.strengthSteps && ctrl.strengthSteps[0].label && ctrl.strengthSteps[0].color){
        strengthService.strength = ctrl.strengthSteps;
      }

      ctrl.strength = strengthService.strength;

      $scope.$watch(function () {
        return ctrl.password;
      }, function (newVal, oldVal) {
        if (!ctrl.password || ctrl.password === '') {
        } else {
          ctrl.selectedColor = strengthService.getColor(ctrl.password);
          ctrl.strengthIndex = strengthService.getStrengthIndex(ctrl.password);
          ctrl.selectedLabel = strengthService.getSelectedLabel(ctrl.password);
          console.log(ctrl.selectedLabel+" "+ ctrl.selectedColor + " "+ ctrl.strengthIndex)
        }
      });
    },
    template:'<div>'+
    '<ul style="margin: 0; padding:0">'+
    '<li ng-repeat="strength in $ctrl.strength" style="border-radius: 2px; display: inline-block; height: 5px; margin-right: 1px; width: 20px;"'+
  "ng-style='$index <= $ctrl.strengthIndex?{background:$ctrl.selectedColor}:{ background:grey }'></li>"+
    '</ul>'+
    "<span ng-style='{ &quotcolor &quot:$ctrl.selectedColor}' >{{$ctrl.selectedLabel}}</span>"+
  '</div>'
  })
})()
