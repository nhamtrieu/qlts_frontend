/**
 * Xóa phần tử bị trùng
 * Author: TTNham (19/08/2023)
 * @param {*} data
 */
export const removeDuplicateElement = (data, name) =>
    Array.from(
        new Set(
            data
                .map((item) => {
                    name = { item };
                    return name || "";
                })
                .filter(Boolean)
        )
    );

/**
 * Tăng mã lên 1 đơn vị
 * Author: TTNham (30/08/2023)
 */
export const increaseCode = (code) => {
    // Sử dụng biểu thức chính quy để tìm phần số cuối cùng của chuỗi
    const match = code.match(/(.*?)(\d+)$/);
    const increasedNumber = increaseNumber(match[2], 1);
    const paddedNumber = increasedNumber.padStart(match[2].length, "0");
    return match[1] + paddedNumber;
};

/**
 * Hàm cộng 2 số lớn bất kỳ
 * Author: TTNham (30/08/2023)`
 * @param {*} a``
 * @param {*} b
 */
export const increaseNumber = (a, b) => {
    const numA = BigInt(a);
    const numB = BigInt(b);
    const result = numA + numB;
    return result.toString();
};
