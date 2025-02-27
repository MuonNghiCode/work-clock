import { put } from "./apiService";

import { ResponseModel } from "../models/ResponseModel";
import { API_CONTANTS } from "../constants/apiContants";

interface ChangePassword {
    old_password: string;
    new_password: string;
}
export const changePassword = async (old_password: string, new_password: string): Promise<ResponseModel<ChangePassword>> => {
    const response = await put<ChangePassword>(API_CONTANTS.USERS.CHANGE_PASSWORD, { old_password, new_password });

    if (response.success) {
        localStorage.setItem("lastChangedPassword", JSON.stringify({ old_password, new_password }));
    }

    return response;
};
