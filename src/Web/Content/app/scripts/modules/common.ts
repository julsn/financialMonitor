module Cat {
    export class StringHelper {
        public static dateToString(d: Date): string {
            return d.getFullYear().toString() + this.numToString(d.getMonth() + 1, 2) + this.numToString(d.getDate(), 2);
        }

        public static parseDate(d: string): Date {
            if (d.length == 8)
                return new Date(parseInt(d.substr(0, 4)), parseInt(d.substr(4, 2)) - 1, parseInt(d.substr(6, 2)));

            return new Date(d);
        }

        private static numToString(n: number, length: number) : string {
            var res = n.toString();

            if (length - res.length > 0) {
                var zeros = new Array(length - res.length + 1).join("0");
                return zeros + res;
            }

            return res;
        }
    }
    
    export class DateHelper {
        public static toFirstDate(date : Date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        }

        public static addMonth(date: Date, monthes: number, firstDate: boolean = false) {
            var d = firstDate ? 1 : date.getDate();
            var m = date.getMonth() + monthes;

            if (m >= 0 && m < 12) {
                return new Date(date.getFullYear(), m, d);
            }

            if (m >= 12) {
                return new Date(date.getFullYear() + 1, m - 12, d);
            }

            if (m < 0) {
                return new Date(date.getFullYear() - 1, 12 + m, d);
            }
        }
    }
} 