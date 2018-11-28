'use strict';

/* Directives */

angular.module('myApp').
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }).directive('currency', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelController) {
        
        var formatNumber = function(value) {
       
          value = value.toString();
          value = value.replace(/[^0-9\.]/g, "");
          var parts = value.split('.');
          parts[0] = parts[0].replace(/\d{1,3}(?=(\d{3})+(?!\d))/g, "$&,");
          if (parts[1] && parts[1].length > 2) {
            parts[1] = parts[1].substring(0, 2);
          }
         
          return parts.join(".");
        };
        var applyFormatting = function() {
          var value = element.val();
          var original = value;
          if (!value || value.length == 0) {
            return
          }
          value = formatNumber(value);
          if (value != original) {
            element.val(value);
            element.triggerHandler('input')
          }
        };
        element.bind('keyup', function(e) {
          var keycode = e.keyCode;
          var isTextInputKey =
            (keycode > 47 && keycode < 58) || // number keys
            keycode == 32 || keycode == 8 || // spacebar or backspace
            (keycode > 64 && keycode < 91) || // letter keys
            (keycode > 95 && keycode < 112) || // numpad keys
            (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
            (keycode > 218 && keycode < 223); // [\]' (in order)
          if (isTextInputKey) {
            applyFormatting();
          }
        });
        element.bind('blur', function(evt) {
          if (angular.isDefined(ngModelController.$modelValue)) {
            var val = ngModelController.$modelValue.split('.');
            if (val && val.length == 1) {
              if (val != "") {
                ngModelController.$setViewValue(val + '.00');
                ngModelController.$render();
              }
            } else if (val && val.length == 2) {
              if (val[1] && val[1].length == 1) {
                ngModelController.$setViewValue(val[0] + '.' + val[1] + '0');
                ngModelController.$render();
              } else if (val[1].length == 0) {
                ngModelController.$setViewValue(val[0] + '.00');
                ngModelController.$render();
              }
              applyFormatting();
            }
          }
        })
        ngModelController.$parsers.push(function(value) {
          if (!value || value.length == 0) {
            return value;
          }
          value = value.toString();
          value = value.replace(/[^0-9\.]/g, "");
          return value;
        });
        ngModelController.$formatters.push(function(value) {
          if (!value || value.length == 0) {
            return value;
          }
          value = formatNumber(value);
          return value;
        });
      }
    };
  }).directive("limitTo", [function() {
  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
      var limit = parseInt(attrs.limitTo);
      angular.element(elem).on("keypress", function(e) {
        if (this.value.length == limit) e.preventDefault();
      });
    }
  }
}]).directive('validNumber', function () {
  return {
      require: '?ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {

          element.on('keydown', function (event) {
            var keyCode=[]
            if(attrs.allowNegative == "true")
            { keyCode = [8, 9, 36, 35, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 109, 110, 173, 190,189];
            }
            else{
             var keyCode = [8, 9, 36, 35, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 173, 190];
            }
            
            
            if(attrs.allowDecimal == "false") {
              
              var index = keyCode.indexOf(190);


if (index > -1) {
  keyCode.splice(index, 1);
}
              
            }
                      
            if ($.inArray(event.which, keyCode) == -1) event.preventDefault();
              else {console.log(2);
                  var oVal = ngModelCtrl.$modelValue || '';
                  if ($.inArray(event.which, [109, 173]) > -1 && oVal.indexOf('-') > -1) event.preventDefault();
                  else if ($.inArray(event.which, [110, 190]) > -1 && oVal.indexOf('.') > -1) event.preventDefault();
              }
          })
          .on('blur', function () {

              if (element.val() == '' || parseFloat(element.val()) == 0.0 || element.val() == '-') {
                  ngModelCtrl.$setViewValue('0.00');
              }
              else if(attrs.allowDecimal == "false")
             { 
               ngModelCtrl.$setViewValue(element.val());
             }
             else{   
               if(attrs.decimalUpto)
               {
               var fixedValue = parseFloat(element.val()).toFixed(attrs.decimalUpto);}
               else{   var fixedValue = parseFloat(element.val()).toFixed(2);}
               ngModelCtrl.$setViewValue(fixedValue);
             }
                  
              

              ngModelCtrl.$render();
              scope.$apply();
          });

          ngModelCtrl.$parsers.push(function (text) {
              var oVal = ngModelCtrl.$modelValue;
              var nVal = ngModelCtrl.$viewValue;
console.log(nVal);
              if (parseFloat(nVal) != nVal) {

                  if (nVal === null || nVal === undefined || nVal == '' || nVal == '-') oVal = nVal;

                  ngModelCtrl.$setViewValue(oVal);
                  ngModelCtrl.$render();
                  return oVal;
              }
              else {
                  var decimalCheck = nVal.split('.');
                  if (!angular.isUndefined(decimalCheck[1])) {
                    if(attrs.decimalUpto)
                       decimalCheck[1] = decimalCheck[1].slice(0, attrs.decimalUpto);
                       else
                      decimalCheck[1] = decimalCheck[1].slice(0, 2);
                      nVal = decimalCheck[0] + '.' + decimalCheck[1];
                  }

                  ngModelCtrl.$setViewValue(nVal);
                  ngModelCtrl.$render();
                  return nVal;
              }
          });

          ngModelCtrl.$formatters.push(function (text) {
              if (text == '0' || text == null && attrs.allowDecimal == "false") return '0';
              else if (text == '0' || text == null && attrs.allowDecimal != "false" && attrs.decimalUpto == undefined) return '0.00';
              else if (text == '0' || text == null && attrs.allowDecimal != "false" && attrs.decimalUpto != undefined) return parseFloat(0).toFixed(attrs.decimalUpto);
              else if (attrs.allowDecimal != "false" && attrs.decimalUpto != undefined) return parseFloat(text).toFixed(attrs.decimalUpto);
              else return parseFloat(text).toFixed(2);
          });
      }
  };
});
                         
