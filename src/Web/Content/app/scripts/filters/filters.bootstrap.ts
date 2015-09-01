module Cat.Directives {
    angular.module('cat.filters', [])
        .filter('firstupperletter',
        () => input => {
            if (input == null || input.length == 0)
                return input;
            return input.substr(0, 1).toUpperCase() + input.substr(1);
        });
} 