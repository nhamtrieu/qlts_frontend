import emitter from "tiny-emitter/instance";
import resource from "./resource";

/**
 * Hàm kiểm tra điều kiện validate chung
 * Author: TTNham (03/08/2023)
 * @param {import("vue").Ref} input
 */
export const conditionValidate = (input, inputName) => {
    if (input.value === "" || input.value === null) {
        input.errorMsg = inputName + " không được để trống.";
        return inputName.toLowerCase();
    } else {
        input.errorMsg = "";
        return "";
    }
};

/**
 *Hàm kiểm tra ký tự cuối cùng có phải là số hay không
 *Author: TTNham (22/08/2023)
 * @param {string} input
 */
export const endNumberValidate = (input) => {
    const lastCharacter = input[input.length - 1];
    return !isNaN(lastCharacter);
};

/**
 * Hàm kiểm tra người dùng nhập quá số ký tự cho phép chưa
 * Author: TTNham (22/08/2023)
 * @param {Event} event
 * @param {Number} maxLength
 */
export const maxLengthInputValidate = (event, maxLength) => {
    const newValue = event.target.value;
    if (newValue.length > maxLength) {
        inputValue.value = newValue.slice(0, maxLength);
    } else {
        inputValue.value = newValue;
    }
};

/**
 * Hàm kiểm tra xem ngày mua có lớn hơn ngày sử dụng không
 * Author: TTNham (22/08/2023)
 * @param {*} purchaseDate
 * @param {*} usedDate
 * @returns
 */
export const purchaseDateLessUsedDateValidate = (purchaseDate, usedDate) => {
    const res = new Date(purchaseDate) > new Date(usedDate);
    if (res) {
        emitter.emit("showWarning");
        return resource.Message.InValidUsedDate;
    } else {
        return false;
    }
};
