const format = {
    /**
     * Định dạng tiền
     * Author: TTNham (02/08/2023)
     * @param {*} val
     */
    formatMoney(val) {
        if (val != 0) {
            let value = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(val);
            return value.substring(0, value.length - 2);
        } else return 0;
    },

    /**
     * Hủy format định dạng tiền
     * Author: TTNham (04/08/2023)
     * @param {*} val
     */
    unFomatMoney(val) {
        return +(val + "").replaceAll(".", "").replace(",", ".");
    },

    /**
     * Format số thập phân
     * Author: TTNham (04/08/2023)
     * @param {*} number
     * @returns
     */
    formatDecimalNumber(number) {
        number += "";
        // Chuyển dấu "." thành ","
        const commaDecimal = number.replace(".", ",");

        // Thêm dấu "." vào sau mỗi 3 chữ số từ phần nguyên
        const parts = commaDecimal.split(",");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        if (parts[1]) {
            parts[1] = parts[1].replace(/(\d{3})/g, "$1.");
            // Loại bỏ dấu "." dư thừa ở cuối nếu có
            parts[1] = parts[1].replace(/\.$/, "");
        }
        // Kết hợp lại phần nguyên và phần thập phân
        const formattedNumber = parts.join(",");

        return formattedNumber;
    },

    /**
     * Format định dạng ngày
     * Author: TTNham (04/08/2023)
     * @param {*} string
     * @returns
     */
    formatDateToyyyyMMdd(string) {
        const date = new Date(string);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    },

    formatDateToddMMyyyy(string) {
        const date = new Date(string);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${day}-${month}-${year}`;
    },
};

export default format;
