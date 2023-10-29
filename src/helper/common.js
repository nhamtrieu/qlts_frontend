import emitter from "tiny-emitter/instance.js";
import resource from "./resource";

/**
 * Ẩn dialog cảnh báo lỗi
 * Author: TTNham (8/8/2023);
 */
export const hideDialogError = () => {
    emitter.emit("hideDialogError");
};

/**
 * Hiển dialog cảnh báo lỗi
 * Author: TTNham (8/8/2023)
 */
export const showDialogError = (errorDialogMsg) => {
    emitter.emit("showDialogError", errorDialogMsg);
};

/**
 * Hiển thị thông báo nhanh
 * Author: TTNham (8/8/2023)
 */
export const showToastMsg = (type, content) => {
    console.log(type, content);
    emitter.emit("showToastMsg", type, content);
};

/**
 * Hàm thông báo lỗi
 * Author: TTNham (26/08/2023)
 * @param {*} error
 */
export const errorApi = (error) => {
    if (error.response.status >= 400 && error.response.status < 500) {
        console.log(error.response.data);
        showDialogError(
            error.response.data.UserMessage || resource.Message.ApiErrorMsg
        );
    } else if (error.response.status >= 500) {
        showDialogError(resource.Message.ApiErrorMsg);
    }
};
