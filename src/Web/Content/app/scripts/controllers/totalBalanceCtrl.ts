module Cat {
    export interface ITotalBalanceScope extends ng.IScope {
        balance: any;
        balanceYears: Array<number>;

        showDetails: Function;
        openYear: Function;
        moveBack: Function;
        moveForward: Function;
    }
    export class TotalBalanceController {
        private _$scope: ITotalBalanceScope;
        private _$location;
        private _$http;

        firstDate: Date;
        lastDate: Date;
        
        dateFrom: Date;

        periodInMonth: number;

        public static $inject = [
            '$scope',
            '$http',
            '$location'
        ];
        constructor(
            $scope: ITotalBalanceScope,
            $http: ng.IHttpService,
            $location: ng.ILocationService) {

            this._$scope = $scope;
            this._$location = $location;
            this._$http = $http;

            this.init();

            this.loadData();
        }

        init() {
            this.periodInMonth = 6;

            this._$scope.showDetails = (type, year, month) => { this.showPeriodDetails(type, year, month); };
            this._$scope.openYear = (d) => { this.openYear(d); };
            this._$scope.moveBack = () => { this.moveBack(); }
            this._$scope.moveForward = () => { this.moveForward(); }
        }

        loadData() {
            this._$http.get('balance/dates')
                .success(data => {
                    if (data == null) {
                        this.firstDate = new Date();
                        this.lastDate = new Date();
                    } else {
                        this.firstDate = StringHelper.parseDate(data.firstDate);
                        this.lastDate = StringHelper.parseDate(data.lastDate);
                    }

                    this.loadBalance(DateHelper.addMonth(DateHelper.toFirstDate(this.lastDate), 1 - this.periodInMonth));
                    this.populateBalanceYears();
            });
        }

        loadBalance(dateFrom: Date) {
            this.dateFrom = dateFrom;
            var dateTo = DateHelper.addMonth(dateFrom, this.periodInMonth);

            this._$http.get('balance/'
                + StringHelper.dateToString(dateFrom) + "/"
                + StringHelper.dateToString(dateTo))

                .success(data => {
                    this._$scope.balance = data;
                });
        }

        populateBalanceYears() {
            var list = [];

            for (var i = this.firstDate.getFullYear(); i <= this.lastDate.getFullYear(); i++) {
                list.push(i);
            }

            this._$scope.balanceYears = list;
        }

        openYear(year) {
            var dateFrom = new Date(year, 0, 1);

            this.loadBalance(dateFrom);
        }

        moveBack() {
            var t = DateHelper.addMonth(this.dateFrom, -1);

            if (t >= DateHelper.toFirstDate(this.firstDate))
                this.loadBalance(t);
        }

        moveForward() {
            var t = DateHelper.addMonth(this.dateFrom, 1);

            if (DateHelper.addMonth(this.dateFrom, this.periodInMonth) <= DateHelper.toFirstDate(this.lastDate))
                this.loadBalance(t);
        }

        showPeriodDetails(type, year, month) {
            console.log("show details for " + year + "/" + month + ": " + type);

            var dateFrom = new Date(year, month - 1, 1);
            var dateTo = DateHelper.addMonth(dateFrom, 1);

            this._$location.path("/balance/"
                + type + '/'
                + StringHelper.dateToString(dateFrom) + "/"
                + StringHelper.dateToString(dateTo));
        }
    }
}  